// src/app/api/conversations/[id]/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// Define the params type for Next.js 15
type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/conversations/[id] - Get a specific conversation
export async function GET(request: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the conversation ID from the route params
    const { id } = await context.params;
    
    // Fetch the conversation from the database
    const conversation = await prisma.conversation.findUnique({
      where: {
        id,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    // Check if the conversation exists and belongs to the user
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    if (conversation.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Format the messages for the frontend
    const formattedMessages = conversation.messages.map(message => ({
      id: message.id,
      role: message.role,
      content: message.content,
      timestamp: message.createdAt.toISOString(),
    }));

    return NextResponse.json({
      id: conversation.id,
      title: conversation.title,
      created_at: conversation.createdAt.toISOString(),
      messages: formattedMessages,
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/conversations/[id] - Delete a conversation
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the conversation ID from the route params
    const { id } = await context.params;
    
    // Get the conversation to check ownership
    const conversation = await prisma.conversation.findUnique({
      where: { id },
    });

    // Check if the conversation exists and belongs to the user
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    if (conversation.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete the conversation
    await prisma.conversation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/conversations/[id] - Update conversation (e.g., title)
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the conversation ID from the route params
    const { id } = await context.params;
    
    // Get the update data from the request body
    const data = await request.json();
    const { title } = data;
    
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    
    // Get the conversation to check ownership
    const conversation = await prisma.conversation.findUnique({
      where: { id },
    });

    // Check if the conversation exists and belongs to the user
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    if (conversation.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update the conversation
    const updatedConversation = await prisma.conversation.update({
      where: { id },
      data: { title },
    });

    return NextResponse.json(updatedConversation);
  } catch (error) {
    console.error('Error updating conversation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}