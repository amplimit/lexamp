// src/lib/chatHistoryService.ts
// 定义Chat和Message的接口
export interface Message {
    id: string | number;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    streaming?: boolean;
    error?: boolean;
  }
  
  export interface Chat {
    id: string;
    title: string;
    preview: string;
    lastActive: string;
    messages: Message[];
  }
  
  // 本地存储的键
  const CHAT_HISTORY_KEY = 'lexamp_chat_history';
  const ACTIVE_CHAT_KEY = 'lexamp_active_chat';
  
  // 从本地存储中获取所有聊天记录
  export const getChatHistory = (): Chat[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const historyJson = localStorage.getItem(CHAT_HISTORY_KEY);
      return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
      console.error('Error retrieving chat history:', error);
      return [];
    }
  };
  
  // 获取当前活跃聊天ID
  export const getActiveChatId = (): string | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      return localStorage.getItem(ACTIVE_CHAT_KEY);
    } catch (error) {
      console.error('Error retrieving active chat id:', error);
      return null;
    }
  };
  
  // 设置当前活跃聊天ID
  export const setActiveChatId = (chatId: string | null): void => {
    if (typeof window === 'undefined') return;
    
    try {
      if (chatId) {
        localStorage.setItem(ACTIVE_CHAT_KEY, chatId);
      } else {
        localStorage.removeItem(ACTIVE_CHAT_KEY);
      }
    } catch (error) {
      console.error('Error setting active chat id:', error);
    }
  };
  
  // 获取特定聊天
  export const getChat = (chatId: string): Chat | null => {
    const history = getChatHistory();
    return history.find(chat => chat.id === chatId) || null;
  };
  
  // 保存聊天到历史记录
  export const saveChat = (chat: Chat): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const history = getChatHistory();
      const existingIndex = history.findIndex(c => c.id === chat.id);
      
      let updatedHistory: Chat[];
      
      if (existingIndex >= 0) {
        // 更新现有聊天
        updatedHistory = [...history];
        updatedHistory[existingIndex] = chat;
      } else {
        // 添加新聊天到顶部
        updatedHistory = [chat, ...history];
      }
      
      // 限制历史记录数量
      if (updatedHistory.length > 50) {
        updatedHistory = updatedHistory.slice(0, 50);
      }
      
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving chat to history:', error);
    }
  };
  
  // 删除特定聊天
  export const deleteChat = (chatId: string): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const history = getChatHistory();
      const updatedHistory = history.filter(chat => chat.id !== chatId);
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(updatedHistory));
      
      // 如果删除的是当前活跃聊天，清除活跃聊天ID
      if (getActiveChatId() === chatId) {
        setActiveChatId(null);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };
  
  // 清除所有聊天历史
  export const clearAllHistory = (): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(CHAT_HISTORY_KEY);
      localStorage.removeItem(ACTIVE_CHAT_KEY);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  };
  
  // 创建新对话的标题
  export const generateChatTitle = (userMessage: string): string => {
    // 截断长消息
    if (userMessage.length > 30) {
      return `${userMessage.substring(0, 30)}...`;
    }
    return userMessage;
  };