// src/app/api/chat-backend/api/conversations/new/route.ts
import { NextResponse } from 'next/server';

const FLASK_BACKEND_URL = process.env.FLASK_BACKEND_URL || 'http://localhost:5000';

/**
 * 处理POST请求 - 创建新对话
 */
export async function POST(request: Request) {
  try {
    const backendResponse = await fetch(`${FLASK_BACKEND_URL}/api/conversations/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!backendResponse.ok) {
      // 如果后端响应失败，返回错误
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || 'Failed to create conversation' },
        { status: backendResponse.status }
      );
    }

    // 转发后端响应
    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating conversation:", error);
    
    // 如果无法连接后端，创建一个模拟响应
    const mockConversationId = `mock-${Date.now()}`;
    const timestamp = new Date().toISOString();
    
    return NextResponse.json({
      id: mockConversationId,
      title: "新的对话",
      created_at: timestamp,
      messages: [
        {
          id: `welcome-${Date.now()}`,
          role: "assistant",
          content: "你好！我是您的法律助手，有什么我可以帮助您的吗？",
          timestamp: timestamp
        }
      ]
    });
  }
}