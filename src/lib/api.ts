import { API_ENDPOINTS } from '@/lib/config';

export async function createConversation() {
  const response = await fetch(API_ENDPOINTS.conversations.create, {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error('Failed to create conversation');
  }
  
  return response.json();
}

export async function sendMessage(conversationId: string, message: string) {
  const response = await fetch(API_ENDPOINTS.conversations.streamMessages(conversationId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to send message');
  }
  
  return response.json();
}

export async function resetConversation(conversationId: string) {
  const response = await fetch(API_ENDPOINTS.conversations.reset(conversationId), {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error('Failed to reset conversation');
  }
  
  return response.json();
}