// src/app/api/chat-backend/api/conversations/[id]/messages/stream/route.ts
import { NextRequest, NextResponse } from 'next/server';

const FLASK_BACKEND_URL = process.env.FLASK_BACKEND_URL || 'http://localhost:5000';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * 处理POST请求 - 发送消息
 */
export async function POST(request: NextRequest, context: RouteParams) {
    const { id } = context.params;
  
  try {
    const body = await request.json();
    
    const backendResponse = await fetch(`${FLASK_BACKEND_URL}/api/conversations/${id}/messages/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      // 如果后端响应失败，返回错误
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || 'Failed to send message' },
        { status: backendResponse.status }
      );
    }

    // 转发后端响应
    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error sending message to conversation ${id}:`, error);
    
    // 如果无法连接后端，创建一个模拟响应
    return NextResponse.json({
      status: "message_received",
      message_id: `mock-msg-${Date.now()}`
    });
  }
}

/**
 * 处理GET请求 - 流式获取响应
 */
export async function GET(request: NextRequest, context: RouteParams) {
  const id = context.params.id; // 直接使用，不需要解构
  
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
          controller.close();
          return;
        }

        // 处理来自后端的流式响应
        const reader = response.body.getReader();
        let buffer = '';
        
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
            }
          }
        }
        
        // 处理可能剩余在缓冲区中的最后一个事件
        if (buffer.trim().startsWith('data:')) {
          controller.enqueue(encoder.encode(`${buffer}\n\n`));
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
}