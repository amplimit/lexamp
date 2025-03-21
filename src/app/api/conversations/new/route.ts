import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

const FLASK_BACKEND_URL = process.env.FLASK_BACKEND_URL || 'http://localhost:5000';

// POST /api/conversations/new - Create a new conversation
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      console.error("No session found");
      return NextResponse.json({ error: 'Not authenticated', details: 'No session found' }, { status: 401 });
    }
    
    if (!session?.user) {
      console.error("No user in session");
      return NextResponse.json({ error: 'Unauthorized', details: 'No user in session' }, { status: 401 });
    }
    
    if (!session?.user?.id) {
      console.error("No user ID in session");
      return NextResponse.json({ error: 'Unauthorized', details: 'No user ID in session' }, { status: 401 });
    }

    // First try to connect to the Flask backend
    let backendConversationId = null;
    
    try {
      const backendResponse = await fetch(`${FLASK_BACKEND_URL}/api/conversations/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (backendResponse.ok) {
        const data = await backendResponse.json();
        backendConversationId = data.id;
      }
    } catch (backendError) {
      console.error("Error connecting to Flask backend:", backendError instanceof Error ? backendError.message : 'Unknown error');
      // We'll continue without the backend if it fails
    }

    // Create conversation in database
    try {
      const conversation = await prisma.conversation.create({
        data: {
          userId: session.user.id,
          title: 'New Conversation',
        },
      });
  
      // Create a welcome message
      const welcomeMessage = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          content: "Hello! I'm your legal assistant. How can I help you today?",
          role: 'assistant',
        },
      });
  
      // Format the response to match the expected structure
      const timestamp = new Date().toISOString();
      const response = {
        id: conversation.id,
        title: conversation.title,
        backendId: backendConversationId, // Store the backend ID for later use
        created_at: timestamp,
        messages: [
          {
            id: welcomeMessage.id,
            role: "assistant",
            content: welcomeMessage.content,
            timestamp: welcomeMessage.createdAt.toISOString()
          }
        ]
      };
  
      return NextResponse.json(response);
    } catch (dbError) {
      console.error("Database error creating conversation:", dbError instanceof Error ? dbError.message : 'Unknown error');
      return NextResponse.json({ 
        error: 'Database error', 
        details: dbError instanceof Error ? dbError.message : 'Unknown database error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error creating conversation:", error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ 
      error: 'Error creating conversation', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}