// src/app/api/conversations/[id]/messages/stream/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// 修改接口定义以匹配 Next.js 15 的要求
type RouteContext = {
  params: Promise<{ id: string }>;
};

const FLASK_BACKEND_URL = process.env.FLASK_BACKEND_URL || 'http://localhost:5000';

/**
 * 处理POST请求 - 发送消息
 */
export async function POST(request: NextRequest, context: RouteContext) {
  // 使用 await 获取 id 参数
  const { id } = await context.params;
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if conversation exists and belongs to user
    const conversation = await prisma.conversation.findUnique({
      where: { id },
    });
    
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }
    
    if (conversation.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    const body = await request.json();
    
    // Store user message in database first
    const userMessage = await prisma.message.create({
      data: {
        conversationId: id,
        content: body.message,
        role: 'user',
      },
    });
    
    // Update conversation updatedAt timestamp
    await prisma.conversation.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    // Try connecting to the Flask backend
    let backendResponse;
    try {
      backendResponse = await fetch(`${FLASK_BACKEND_URL}/api/conversations/${id}/messages/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!backendResponse.ok) {
        throw new Error('Failed to send message to backend');
      }

      // Get backend response data
      const data = await backendResponse.json();
      
      return NextResponse.json({
        status: "message_received",
        message_id: data.message_id || userMessage.id
      });
    } catch (error) {
      console.error(`Error sending message to conversation ${id}:`, error);
      
      // If backend fails, return user message ID so we can continue with mock response
      return NextResponse.json({
        status: "message_received",
        message_id: userMessage.id
      });
    }
  } catch (error) {
    console.error(`Error sending message to conversation ${id}:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * 处理GET请求 - 流式获取响应
 */
export async function GET(request: NextRequest, context: RouteContext) {
  // 使用 await 获取 id 参数
  const { id } = await context.params;
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    // Check if conversation exists and belongs to user
    const conversation = await prisma.conversation.findUnique({
      where: { id },
    });
    
    if (!conversation) {
      return new NextResponse('Conversation not found', { status: 404 });
    }
    
    if (conversation.userId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 403 });
    }
  
    // 创建一个响应流
    const encoder = new TextEncoder();
    const customReadable = new ReadableStream({
      async start(controller) {
        try {
          // 尝试连接到Flask后端的流式API
          const response = await fetch(`${FLASK_BACKEND_URL}/api/conversations/${id}/messages/stream`, {
            method: 'GET',
            headers: {
              'Accept': 'text/event-stream',
            },
          });

          if (!response.ok || !response.body) {
            // 如果响应不成功，发送错误事件并关闭流
            const errorData = JSON.stringify({
              status: "error",
              error: "Failed to connect to backend service",
              message: "抱歉，无法连接到聊天服务。请稍后再试。"
            });
            controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
            
            // 创建一个错误消息并保存到数据库
            await saveAssistantMessage(id, "抱歉，无法连接到聊天服务。请稍后再试。");
            
            controller.close();
            return;
          }

          // 处理来自后端的流式响应
          const reader = response.body.getReader();
          let buffer = '';
          let fullResponse = '';
          
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              break;
            }
            
            // 将Uint8Array转换为字符串并添加到缓冲区
            buffer += new TextDecoder().decode(value);
            
            // 从缓冲区中提取完整的事件流数据
            const events = buffer.split('\n\n');
            buffer = events.pop() || '';  // 保留最后一个可能不完整的事件
            
            // 处理完整的事件
            for (const event of events) {
              if (event.trim().startsWith('data:')) {
                controller.enqueue(encoder.encode(`${event}\n\n`));
                
                // 尝试解析数据以获取完整响应
                try {
                  const eventData = JSON.parse(event.replace('data: ', ''));
                  if (eventData.status === 'complete') {
                    fullResponse = eventData.full_response;
                  } else if (eventData.full_response) {
                    fullResponse = eventData.full_response;
                  }
                } catch (e) {
                  // 解析失败，继续处理
                }
              }
            }
          }
          
          // 处理可能剩余在缓冲区中的最后一个事件
          if (buffer.trim().startsWith('data:')) {
            controller.enqueue(encoder.encode(`${buffer}\n\n`));
            
            // 尝试解析数据以获取完整响应
            try {
              const eventData = JSON.parse(buffer.replace('data: ', ''));
              if (eventData.status === 'complete') {
                fullResponse = eventData.full_response;
              } else if (eventData.full_response) {
                fullResponse = eventData.full_response;
              }
            } catch (e) {
              // 解析失败，继续处理
            }
          }
          
          // 将完整响应保存到数据库
          if (fullResponse) {
            await saveAssistantMessage(id, fullResponse);
          }
          
          controller.close();
        } catch (error) {
          console.error(`Error streaming response for conversation ${id}:`, error);
          
          // 发送错误事件
          const errorData = JSON.stringify({
            status: "error",
            error: String(error),
            message: "抱歉，获取响应时出现错误。请稍后再试。"
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          
          // 如果是模拟模式，发送一些模拟数据
          if (id.startsWith('mock-')) {
            const messageId = request.nextUrl.searchParams.get('messageId') || `mock-msg-${Date.now()}`;
            const mockResponse = "这是一个模拟响应。在实际部署中，这将由真实的AI助手提供。";
            
            // 模拟逐块发送
            const chunks = mockResponse.split('。');
            for (let i = 0; i < chunks.length; i++) {
              const chunk = chunks[i] + (i < chunks.length - 1 ? '。' : '');
              const fullResponseSoFar = chunks.slice(0, i + 1).join('。') + (i < chunks.length - 1 ? '。' : '');
              
              const chunkData = JSON.stringify({
                id: messageId,
                chunk: chunk,
                full_response: fullResponseSoFar
              });
              controller.enqueue(encoder.encode(`data: ${chunkData}\n\n`));
              
              // 添加延迟
              await new Promise(resolve => setTimeout(resolve, 300));
            }
            
            // 发送完成事件
            const completionData = JSON.stringify({
              id: messageId,
              status: "complete",
              full_response: mockResponse
            });
            controller.enqueue(encoder.encode(`data: ${completionData}\n\n`));
            
            // 保存模拟响应到数据库
            await saveAssistantMessage(id, mockResponse);
          } else {
            // 保存错误信息到数据库
            await saveAssistantMessage(id, "抱歉，获取响应时出现错误。请稍后再试。");
          }
          
          controller.close();
        }
      }
    });

    // 返回流式响应
    return new NextResponse(customReadable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error(`Error in GET handler for conversation ${id}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Helper function to save assistant message to database
async function saveAssistantMessage(conversationId: string, content: string): Promise<void> {
  try {
    await prisma.message.create({
      data: {
        conversationId,
        content,
        role: 'assistant',
      },
    });
    
    // Update conversation updatedAt timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });
  } catch (error) {
    console.error('Error saving assistant message:', error);
  }
}