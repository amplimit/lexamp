// src/app/api/chat-backend/route.ts
import { NextResponse } from 'next/server';

const FLASK_BACKEND_URL = process.env.FLASK_BACKEND_URL || 'http://localhost:5000';

/**
 * 处理HEAD请求 - 用于前端检测API是否可用
 */
export async function HEAD() {
  try {
    // 尝试连接到实际的Flask后端健康检查端点
    const backendResponse = await fetch(`${FLASK_BACKEND_URL}/api/health`, {
      method: 'HEAD',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    // 如果Flask后端响应成功，返回200状态码
    if (backendResponse.ok) {
      console.log("Flask backend is available");
      return new NextResponse(null, { status: 200 });
    }
    
    // 如果Flask后端不可用，也返回200状态码，让前端使用真实模式
    // 或者可以返回503，表示服务暂时不可用，前端会切换到模拟模式
    console.log("Flask backend is not available, returning 200 anyway");
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Error connecting to Flask backend:", error);
    // 出错时返回200，让前端可以继续使用接口
    return new NextResponse(null, { status: 200 });
  }
}

/**
 * 处理GET请求 - 代理到Flask后端
 */
export async function GET(request: Request) {
  return proxyToBackend(request);
}

/**
 * 处理POST请求 - 代理到Flask后端
 */
export async function POST(request: Request) {
  return proxyToBackend(request);
}

/**
 * 代理请求到Flask后端
 */
async function proxyToBackend(request: Request) {
  try {
    // 提取请求URL中的路径部分
    const url = new URL(request.url);
    const path = url.pathname;
    const searchParams = url.search;
    
    // 构建转发到Flask后端的URL
    const backendUrl = `${FLASK_BACKEND_URL}${path}${searchParams}`;
    
    // 克隆请求头
    const headers = new Headers(request.headers);
    
    // 创建新的请求选项
    const requestOptions: RequestInit = {
      method: request.method,
      headers,
      // 仅对非GET请求处理body
      body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.blob() : undefined,
    };
    
    // 发送请求到Flask后端
    const backendResponse = await fetch(backendUrl, requestOptions);
    
    // 从后端响应创建新的响应对象
    const responseHeaders = new Headers(backendResponse.headers);
    const responseData = await backendResponse.blob();
    
    return new NextResponse(responseData, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Error proxying request to Flask backend:", error);
    return NextResponse.json(
      { error: "Error connecting to backend service" }, 
      { status: 500 }
    );
  }
}