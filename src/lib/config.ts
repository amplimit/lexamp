export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  conversations: {
    create: `${API_BASE_URL}/api/conversations/new`,
    get: (id: string) => `${API_BASE_URL}/api/conversations/${id}`,
    streamMessages: (id: string) => `${API_BASE_URL}/api/conversations/${id}/messages/stream`,
    reset: (id: string) => `${API_BASE_URL}/api/conversations/${id}/reset`,
  }
};