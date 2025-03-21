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
          orderBy: { createdAt: 'asc' },
          take: 1, // Get just the first message for preview purposes
        }
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Format the conversations for the frontend
    const formattedConversations = conversations.map(conversation => {
      const preview = conversation.messages[0]?.content || '';
      return {
        id: conversation.id,
        title: conversation.title || 'New Conversation',
        preview: preview.length > 50 ? `${preview.substring(0, 50)}...` : preview,
        lastActive: conversation.updatedAt.toISOString(),
      };
    });

    return NextResponse.json(formattedConversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}