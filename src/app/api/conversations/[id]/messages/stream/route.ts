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
      include: {
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });
    
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }
    
    if (conversation.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    const body = await request.json();
    
    // Update conversation title if it's the first message
    if (conversation.messages.length <= 1 && body.message && !conversation.title) {
      // Use the first few words of the user's first message as the title
      let title = body.message;
      if (title.length > 30) {
        title = title.substring(0, 30) + '...';
      }
      
      await prisma.conversation.update({
        where: { id },
        data: { title }
      });
    }
    
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
      // 修正API路径 - 确保与后端匹配
      const backendUrl = `${FLASK_BACKEND_URL}/api/conversations/${id}/messages`;
      backendResponse = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
      });

      // 检查响应状态
      if (backendResponse.ok) {
        // 正常处理成功响应
        const data = await backendResponse.json();
        
        return NextResponse.json({
          status: "message_received",
          message_id: data.message_id || userMessage.id
        });
      } else {
        console.warn(`Backend responded with status ${backendResponse.status} for conversation ${id}`);
        // 如果是404，可能是API路径不匹配，静默失败并使用本地功能
        // 对于其他错误，我们也使用本地功能，但记录详细信息
        
        if (backendResponse.status !== 404) {
          try {
            const errorText = await backendResponse.text();
            console.error(`Backend error details: ${errorText}`);
          } catch (e) {
            console.error('Could not read error details from backend');
          }
        }
        
        console.error(`Failed to access backend API: ${backendUrl}`);
        
        // 返回用户消息ID以便继续使用本地响应
        return NextResponse.json({
          status: "message_received",
          message_id: userMessage.id
        });
      }
    } catch (error) {
      console.error(`Error sending message to conversation ${id}:`, error);
      console.error(`Failed to access backend API: ${FLASK_BACKEND_URL}/api/conversations/${encodeURIComponent(id)}/messages`);
      
      // 如果后端连接失败，返回用户消息ID以便继续使用本地响应
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
    
    // Get message ID from query (for tracing back to the original message)
    const messageId = request.nextUrl.searchParams.get('messageId') || `fallback-${Date.now()}`;
  
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
            // 如果响应不成功，不要立即报错，而是降级到本地模拟响应
            const backendUrl = `${FLASK_BACKEND_URL}/api/conversations/${id}/messages/stream`;
            if (response.status === 404) {
              console.warn(`Backend API endpoint not found (404) for conversation ${id}, using local fallback`);
              console.warn(`Attempted to access: ${backendUrl}`);
              console.warn(`Check if backend server is running and endpoint exists at this path`);
            } else {
              console.error(`Failed to connect to backend service for conversation ${id}, status: ${response.status}`);
              console.error(`Attempted to access: ${backendUrl}`);
              try {
                const errorText = await response.text();
                console.error(`Backend error details: ${errorText}`);
              } catch (e) {
                // 忽略读取错误详情时的错误
              }
            }
            
            // 生成本地回复
            await generateLocalResponse(controller, encoder, id, messageId);
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
            await saveAssistantMessage(id, fullResponse, messageId);
          }
          
          controller.close();
        } catch (error) {
          console.error(`Error streaming response for conversation ${id}:`, error);
          
          // 发送错误事件
          const errorData = JSON.stringify({
            status: "error",
            error: String(error),
            message: "Sorry, an error occurred while getting the response. Please try again later.",
            id: messageId
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          
          // 如果是模拟模式，发送一些模拟数据
          if (id.startsWith('mock-')) {
            const mockMessageId = messageId || `mock-msg-${Date.now()}`;
            const mockResponse = "This is a simulated response. In a real deployment, this would be provided by a real AI assistant.";
            
            // 模拟逐块发送
            const chunks = mockResponse.split('。');
            for (let i = 0; i < chunks.length; i++) {
              const chunk = chunks[i] + (i < chunks.length - 1 ? '。' : '');
              const fullResponseSoFar = chunks.slice(0, i + 1).join('。') + (i < chunks.length - 1 ? '。' : '');
              
              const chunkData = JSON.stringify({
                id: mockMessageId,
                chunk: chunk,
                full_response: fullResponseSoFar
              });
              controller.enqueue(encoder.encode(`data: ${chunkData}\n\n`));
              
              // 添加延迟
              await new Promise(resolve => setTimeout(resolve, 300));
            }
            
            // 发送完成事件
            const completionData = JSON.stringify({
              id: mockMessageId,
              status: "complete",
              full_response: mockResponse
            });
            controller.enqueue(encoder.encode(`data: ${completionData}\n\n`));
            
            // 保存模拟响应到数据库
            await saveAssistantMessage(id, mockResponse, mockMessageId);
          } else {
            // 保存错误信息到数据库
            await saveAssistantMessage(
              id, 
              "Sorry, an error occurred while getting the response. Please try again later.", 
              messageId
            );
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
async function saveAssistantMessage(conversationId: string, content: string, messageId?: string | null): Promise<void> {
  // 添加参数验证
  if (!conversationId || !content) {
    console.warn('Invalid parameters for saveAssistantMessage', { conversationId, contentLength: content?.length });
    return;
  }

  try {
    // 构建消息数据
    const messageData: any = {
      conversationId,
      content,
      role: 'assistant',
    };
    
    // 如果提供了messageId，使用它
    if (messageId) {
      messageData.id = messageId;
    }
    
    // 创建消息记录
    await prisma.message.create({
      data: messageData,
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

/**
 * 生成本地响应，当后端不可用时使用
 */
async function generateLocalResponse(
  controller: ReadableStreamDefaultController<Uint8Array>,
  encoder: TextEncoder,
  conversationId: string,
  messageId: string
): Promise<void> {
  try {
    // 查询用户的上一条消息
    const lastMessages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 2, // 获取最近的两条消息
    });

    // 提取用户问题
    const userMessage = lastMessages.find(msg => msg.role === 'user');
    let userQuestion = "I don't have any context of your request.";
    
    if (userMessage) {
      userQuestion = userMessage.content;
    }
    
    // 创建一个简单的回复
    const response = `I'm currently operating in offline mode due to a connection issue with the backend service. 
    
Your question was: "${userQuestion}"

I can provide some general information, but for more specific legal assistance, please try again later when the service is fully operational.`;

    // 分段发送响应以模拟流式处理
    const chunks = response.split('\n\n');
    let fullText = '';
    
    for (const chunk of chunks) {
      if (!chunk.trim()) continue;
      
      await new Promise(resolve => setTimeout(resolve, 100));
      fullText += chunk + '\n\n';
      
      const payload = {
        id: messageId,
        role: 'assistant',
        content: fullText.trim(),
        status: 'streaming'
      };
      
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
    }
    
    // 发送完成事件
    const finalPayload = {
      id: messageId,
      role: 'assistant',
      content: fullText.trim(),
      status: 'complete'
    };
    
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(finalPayload)}\n\n`));
    
    // 保存回复到数据库 - 使用 try/catch 包装以避免影响流的关闭
    try {
      // 确保参数有效再保存消息
      if (conversationId && fullText && fullText.trim() && messageId) {
        await saveAssistantMessage(conversationId, fullText.trim(), messageId);
      } else {
        console.warn('Skipping saveAssistantMessage due to invalid parameters:', 
                    { conversationId, messageLength: fullText?.length, messageId });
      }
    } catch (saveError) {
      console.error('Error saving assistant response:', saveError);
    }
    
    controller.close();
  } catch (error) {
    console.error('Error generating local response:', error);
    
    // 创建一个错误消息
    const errorMessage = 'Sorry, I encountered an error while processing your request.';
    const errorPayload = {
      id: messageId,
      role: 'assistant',
      content: errorMessage,
      status: 'complete'
    };
    
    // 尝试发送错误消息
    try {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorPayload)}\n\n`));
    } catch (encodeError) {
      console.error('Error sending error message:', encodeError);
    }
    
    // 关闭流
    try {
      controller.close();
    } catch (closeError) {
      console.error('Error closing stream:', closeError);
    }
    
    // 尝试保存错误消息
    try {
      await saveAssistantMessage(conversationId, errorMessage, messageId);
    } catch (saveError) {
      console.error('Error saving error message:', saveError);
    }
  }
}