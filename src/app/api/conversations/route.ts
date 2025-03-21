// src/app/api/conversations/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/conversations - Fetch all conversations for logged in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conversations = await prisma.conversation.findMany({
      where: { userId: session.user.id },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 2, // Get the first and last message for better previewing
        }
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Format the conversations for the frontend
    const formattedConversations = conversations.map(conversation => {
      // Get the preview from the latest user message if available, or the latest message
      let preview = '';
      const sortedMessages = conversation.messages.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      // Try to find a user message for preview
      const userMessage = sortedMessages.find(msg => msg.role === 'user');
      
      if (userMessage) {
        preview = userMessage.content;
      } else if (sortedMessages.length > 0) {
        preview = sortedMessages[0].content;
      }
      
      // Truncate preview if needed
      if (preview.length > 60) {
        preview = `${preview.substring(0, 60)}...`;
      }
      
      return {
        id: conversation.id,
        title: conversation.title || 'New Conversation',
        preview: preview,
        lastActive: conversation.updatedAt.toISOString(),
      };
    });

    return NextResponse.json(formattedConversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}