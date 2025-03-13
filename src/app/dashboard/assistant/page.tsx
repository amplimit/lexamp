// src/app/dashboard/assistant/page.tsx
"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ReactMarkdown from 'react-markdown'
import { 
  Send, 
  Paperclip, 
  FileText, 
  User, 
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Menu,
  X,
  MessageSquare,
  AlertTriangle,
  Save,
  Trash2
} from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { 
  saveChat, 
  getChat, 
  getChatHistory, 
  getActiveChatId, 
  setActiveChatId, 
  deleteChat, 
  generateChatTitle 
} from '@/lib/chatHistoryService'

// Define message interface
interface Message {
  id: string | number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  streaming?: boolean;
  error?: boolean;
  isNew?: boolean; // Add property to track new messages for animations
}

// Define chat interface
interface Chat {
  id: string;
  title: string;
  preview: string;
  lastActive: string;
  messages: Message[];
}

// Example questions remain the same
const suggestedQuestions = [
  "What's the difference between a will and a trust?",
  "How do I evict a tenant who hasn't paid rent?",
  "What should I do after a car accident?",
  "How can I protect my intellectual property?",
  "What are my rights as an employee?",
  "How can I start the divorce process?",
  "What does a non-disclosure agreement cover?",
  "How can I contest a speeding ticket?",
]

// Initial welcome message
const initialMessages: Message[] = [
  {
    id: 1,
    role: 'assistant',
    content: `# Welcome to LexAmp AI Assistant

Hello! I'm your AI legal assistant. I'm here to provide general legal information and guidance.

Please note that while I can help explain legal concepts and procedures, my responses do not constitute legal advice, and I am not a substitute for a qualified attorney.

## How can I help you today?

I can answer questions about:
- Basic legal concepts
- Legal procedures
- Document preparation
- General rights and obligations

*Just type your question below to get started!*`,
    timestamp: new Date().toISOString(),
  }
]

// Add CSS animations
const animationStyles = `
  /* Message animations */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  
  @keyframes slideIn {
    from { transform: translateX(20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideInLeft {
    from { transform: translateX(-20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes pulseGlow {
    0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.3); }
    70% { box-shadow: 0 0 0 6px rgba(59, 130, 246, 0); }
    100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
  }
  
  @keyframes shimmer {
    0% { background-position: -468px 0; }
    100% { background-position: 468px 0; }
  }
  
  @keyframes blink {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
  
  @keyframes typingDot {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-2px); }
  }
  
  /* Typing indicator animation */
  .typing-dot:nth-child(1) { animation: typingDot 0.7s 0s infinite; }
  .typing-dot:nth-child(2) { animation: typingDot 0.7s 0.1s infinite; }
  .typing-dot:nth-child(3) { animation: typingDot 0.7s 0.2s infinite; }
  
  /* Message animation classes */
  .message-new-user {
    animation: slideIn 0.3s ease-out forwards;
  }
  
  .message-new-assistant {
    animation: slideInLeft 0.4s ease-out forwards;
  }
  
  /* Button hover animations */
  .button-hover-effect {
    transition: all 0.2s ease;
  }
  
  .button-hover-effect:hover {
    transform: translateY(-2px);
  }
  
  .button-hover-effect:active {
    transform: translateY(0);
  }
  
  /* Suggestion card animations */
  .suggestion-card {
    transition: all 0.2s ease;
  }
  
  .suggestion-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  /* Carousel animation */
  .carousel-slide-enter {
    opacity: 0;
    transform: translateX(50px);
  }
  
  .carousel-slide-enter-active {
    opacity: 1;
    transform: translateX(0);
    transition: all 0.3s ease-out;
  }
  
  .carousel-slide-exit {
    opacity: 1;
    transform: translateX(0);
  }
  
  .carousel-slide-exit-active {
    opacity: 0;
    transform: translateX(-50px);
    transition: all 0.3s ease-in;
  }
  
  /* Chat history item animation */
  .history-item {
    transition: all 0.15s ease;
  }
  
  .history-item:hover {
    background-color: rgba(243, 244, 246, 1);
  }
  
  .history-item-active {
    border-left: 4px solid #3b82f6;
    background-color: rgba(239, 246, 255, 0.7);
  }
  
  /* Form field focus animation */
  .form-field-focus {
    transition: all 0.2s ease;
  }
  
  .form-field-focus:focus-within {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }
  
  /* Skeleton loading animation */
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
  }
  
  /* Shimmer effect for loading */
  .shimmer {
    position: relative;
    overflow: hidden;
  }
  
  .shimmer::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: shimmer 1.5s infinite;
    transform: translateX(-100%);
  }
  
  /* Notification pulse */
  .notification-pulse {
    animation: pulseGlow 2s infinite;
  }
  
  /* Typing animation for AI */
  @keyframes typing {
    from { width: 0 }
    to { width: 100% }
  }
  
  .typing-effect {
    overflow: hidden;
    white-space: nowrap;
    animation: typing 1.5s steps(40, end);
  }
  
  /* Save indicator animation */
  @keyframes fadeInOut {
    0% { opacity: 0; }
    20% { opacity: 1; }
    80% { opacity: 1; }
    100% { opacity: 0; }
  }
  
  .save-indicator {
    animation: fadeInOut 2s ease-in-out;
  }
`;

export default function AssistantPage() {
  // State for chat functionality
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messageId, setMessageId] = useState<string | null>(null)
  const [eventSource, setEventSource] = useState<EventSource | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [currentSuggestionPage, setCurrentSuggestionPage] = useState(0)
  const [isPageChanging, setIsPageChanging] = useState(false)
  const [pageTransitionDirection, setPageTransitionDirection] = useState<'next' | 'prev'>('next')
  
  // State for history and UI functionality
  const [chatHistory, setChatHistory] = useState<Chat[]>([])
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoadingChat, setIsLoadingChat] = useState(false)
  const [showSaveIndicator, setShowSaveIndicator] = useState(false)
  
  // Animation states
  const [fadeInSuggestions, setFadeInSuggestions] = useState(true)
  const [animateHeaderEffect, setAnimateHeaderEffect] = useState(false)
  
  // Use mock mode instead of real API (toggle this based on your environment)
  const [useMockMode, setUseMockMode] = useState(true)
  const [apiStatusChecked, setApiStatusChecked] = useState(false)
  
  const suggestionsPerPage = 4
  const totalSuggestionPages = Math.ceil(suggestedQuestions.length / suggestionsPerPage)
  const currentSuggestions = suggestedQuestions.slice(
    currentSuggestionPage * suggestionsPerPage, 
    (currentSuggestionPage + 1) * suggestionsPerPage
  )

  // Load saved chat history from localStorage on initial mount
  useEffect(() => {
    const savedHistory = getChatHistory()
    if (savedHistory.length > 0) {
      setChatHistory(savedHistory)
    }
    
    const activeId = getActiveChatId()
    if (activeId) {
      setActiveChatId(activeId)
      const activeChat = getChat(activeId)
      if (activeChat) {
        setConversationId(activeId)
        setMessages(activeChat.messages)
      }
    }
  }, [])

  // Filter chat history based on search term
  const filteredHistory = chatHistory.filter(chat => 
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.preview.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Auto scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Handle animation effect for new messages
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Reset isNew flag after animation completes
      setMessages(msgs => 
        msgs.map(msg => ({
          ...msg,
          isNew: false
        }))
      )
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }, [messages])

  // Save chat to localStorage when messages or conversationId changes
  useEffect(() => {
    if (conversationId && messages.length > 0) {
      const currentChat: Chat = {
        id: conversationId,
        title: generateChatTitle(
          messages.find(msg => msg.role === 'user')?.content || 'New Conversation'
        ),
        preview: messages.find(msg => msg.role === 'user')?.content || 'Start a new conversation',
        lastActive: new Date().toISOString(),
        messages: messages
      }
      
      saveChat(currentChat)
      setActiveChatId(conversationId)
      
      // Show save indicator
      setShowSaveIndicator(true)
      const timer = setTimeout(() => {
        setShowSaveIndicator(false)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [messages, conversationId])

  // Update chat history in state when active chat changes
  useEffect(() => {
    const savedHistory = getChatHistory()
    setChatHistory(savedHistory)
  }, [activeChatId, conversationId])

  // Check API status on component mount
  useEffect(() => {
    async function checkApiStatus() {
      if (apiStatusChecked) return;
      
      try {
        console.log('正在检查API状态...');
        
        // 修改1: 增加超时时间到5秒
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('API超时')), 5000)
        );
        
        const apiUrl = getApiBaseUrl();
        console.log('尝试连接到API:', apiUrl);
        
        // 修改2: 使用更简单的fetch请求，使用HEAD方法
        const fetchPromise = fetch(`${apiUrl}/api/health`, { 
          method: 'HEAD',
          // 确保不包含不必要的headers，减少CORS问题
          credentials: 'omit'
        });
        
        // 使用Promise.race竞争超时
        await Promise.race([fetchPromise, timeoutPromise]);
        
        // 如果到这里，说明API可用
        setUseMockMode(false);
        console.log('✅ API可用，使用真实模式');
      } catch (error) {
        // API不可用
        setUseMockMode(true);
        console.error('❌ API连接失败:', error instanceof Error ? error.message : String(error));
        console.log('使用模拟模式');
        
        // 显示更多诊断信息
        console.log('网络诊断:');
        console.log('- 目标API URL:', getApiBaseUrl());
        console.log('- 检查服务器是否在该端口运行');
        console.log('- 检查服务器的CORS配置');
        console.log('- 检查浏览器控制台获取更详细的错误信息');
      }
      
      setApiStatusChecked(true);
      
      // 检查是否有活跃对话，如果没有则创建新对话
      const activeId = getActiveChatId();
      if (activeId) {
        const activeChat = getChat(activeId);
        if (activeChat) {
          setConversationId(activeId);
          setMessages(activeChat.messages);
          setActiveChatId(activeId);
          return;
        }
      }
      
      createNewConversation();
    };
    
    checkApiStatus();
    
    // 清理函数，关闭任何打开的event source
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [apiStatusChecked]);  

  // Animation for header effect
  useEffect(() => {
    if (animateHeaderEffect) {
      const timer = setTimeout(() => {
        setAnimateHeaderEffect(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [animateHeaderEffect]);

  // Get API base URL from environment variable or use default
  const getApiBaseUrl = () => {
    // 优先使用环境变量中的API URL
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    
    // 使用相对URL避免CORS问题
    if (typeof window !== 'undefined') {
      // 使用相对路径，通过Next.js API路由代理请求
      return '/api/chat-backend';
    }
    
    // 默认使用localhost
    return 'http://localhost:5000';
  }  

  // Function to create a new conversation with animation
  const createNewConversation = async () => {
    try {
      // Add animation effect
      setAnimateHeaderEffect(true);
      setIsLoadingChat(true);
      
      // Clean up existing event source if any
      if (eventSource) {
        eventSource.close()
        setEventSource(null)
      }
      
      // Begin with fade out animation for messages
      setMessages(prevMessages => prevMessages.map(msg => ({ ...msg, isNew: false })));
      
      // Short delay for animation
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Generate a new conversation ID
      const newConversationId = `conv-${Date.now()}`;
      setConversationId(newConversationId);
      setActiveChatId(newConversationId);
      
      // Set initial messages
      const newMessages = [...initialMessages].map(msg => ({ ...msg, isNew: true }));
      setMessages(newMessages);
      setInput('');
      setIsTyping(false);
      
      // Save the new conversation
      const newChat: Chat = {
        id: newConversationId,
        title: 'New Conversation',
        preview: 'Start a new conversation',
        lastActive: new Date().toISOString(),
        messages: newMessages
      };
      
      saveChat(newChat);
      setChatHistory(getChatHistory());
      
      if (!useMockMode) {
        try {
          // Try to create a real conversation with the API
          const response = await fetch(`${getApiBaseUrl()}/api/conversations/new`, {
            method: 'POST',
          })
          
          if (response.ok) {
            const data = await response.json()
            setConversationId(data.id)
            
            // Set initial assistant message from API response if available
            if (data.messages && data.messages.length > 0) {
              setMessages(data.messages.map((msg: any) => ({
                id: msg.id,
                role: msg.role,
                content: msg.content,
                timestamp: msg.timestamp,
                isNew: true
              })))
              
              // Save the conversation with API data
              const apiChat: Chat = {
                id: data.id,
                title: 'New Conversation',
                preview: 'Start a new conversation',
                lastActive: new Date().toISOString(),
                messages: data.messages.map((msg: any) => ({
                  id: msg.id,
                  role: msg.role,
                  content: msg.content,
                  timestamp: msg.timestamp
                }))
              };
              
              saveChat(apiChat);
              setActiveChatId(data.id);
              setChatHistory(getChatHistory());
            }
          } else {
            console.warn('API response not OK, using mock mode')
            createMockConversation()
          }
        } catch (error) {
          console.error('Error creating conversation with API:', error)
          createMockConversation()
        }
      } else {
        createMockConversation()
      }
      
      // Complete loading animation
      setTimeout(() => {
        setIsLoadingChat(false);
      }, 300);
      
    } catch (error) {
      console.error('Error in createNewConversation:', error)
      createMockConversation()
      setIsLoadingChat(false);
    }
  }
  
  // Create a mock conversation when API is not available
  const createMockConversation = () => {
    // Generate a mock conversation ID
    const mockId = `mock-${Date.now()}`
    setConversationId(mockId)
    setActiveChatId(mockId)
    
    // Create and save the mock conversation
    const mockChat: Chat = {
      id: mockId,
      title: 'New Conversation',
      preview: 'Start a new conversation',
      lastActive: new Date().toISOString(),
      messages: initialMessages
    };
    
    saveChat(mockChat);
    setChatHistory(getChatHistory());
    console.log("Using mock conversation with ID:", mockId)
  }
  
  // Load a conversation from history with animation
  const loadConversation = (chatId: string) => {
    setIsLoadingChat(true);
    
    // Add a small delay for animation
    setTimeout(() => {
      const selectedChat = getChat(chatId);
      
      if (selectedChat) {
        setMessages(selectedChat.messages.map(msg => ({...msg, isNew: true})));
        setConversationId(chatId);
        setActiveChatId(chatId);
        setIsHistoryOpen(false); // Close sidebar on mobile
      }
      
      setIsLoadingChat(false);
    }, 300);
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !conversationId) return
    
    // Add user message to state immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
      isNew: true, // Mark as new for animation
    }
    
    setMessages((prev: Message[]) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    
    // Update chat with user message
    const currentChat = getChat(conversationId);
    if (currentChat) {
      const updatedChat: Chat = {
        ...currentChat,
        title: generateChatTitle(userMessage.content),
        preview: userMessage.content,
        lastActive: new Date().toISOString(),
        messages: [...currentChat.messages, userMessage]
      };
      
      saveChat(updatedChat);
      setChatHistory(getChatHistory());
    }
    
    // Use mock mode or API based on setting
    if (useMockMode || conversationId.startsWith('mock-')) {
      handleMockResponse(userMessage)
      return
    }
    
    try {      
      // Step 1: Send message to server
      const response = await fetch(`${getApiBaseUrl()}/api/conversations/${conversationId}/messages/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.content }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to send message')
      }
      
      const data = await response.json()
      setMessageId(data.message_id)
      
      // Step 2: Open SSE connection to receive streaming response
      const es = new EventSource(`${getApiBaseUrl()}/api/conversations/${conversationId}/messages/stream`)
      setEventSource(es)
      
      // Create a placeholder for the streaming response
      const assistantPlaceholder: Message = {
        id: data.message_id,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        streaming: true,
        isNew: true, // Mark as new for animation
      }
      
      setMessages((prev: Message[]) => [...prev, assistantPlaceholder])
      
      // Update chat with placeholder message
      const chatToUpdate = getChat(conversationId);
      if (chatToUpdate) {
        const updatedChat: Chat = {
          ...chatToUpdate,
          lastActive: new Date().toISOString(),
          messages: [...chatToUpdate.messages, assistantPlaceholder]
        };
        
        saveChat(updatedChat);
      }
      
      es.onmessage = (event) => {
        const eventData = JSON.parse(event.data)
        
        if (eventData.status === 'complete') {
          // Stream is complete
          setIsTyping(false)
          es.close()
          setEventSource(null)
          
          // After completing a message, update the chat with this new conversation
          const finalChat = getChat(conversationId);
          if (finalChat) {
            const completedMessages = finalChat.messages.map(msg => 
              msg.id === data.message_id 
                ? {
                    ...msg,
                    content: eventData.full_response || msg.content,
                    streaming: false
                  } 
                : msg
            );
            
            const newChat: Chat = {
              ...finalChat,
              messages: completedMessages
            };
            
            saveChat(newChat);
            setChatHistory(getChatHistory());
          }
          
        } else if (eventData.chunk) {
          // Update the message with new chunk
          setMessages((prev: Message[]) => 
            prev.map(msg => 
              msg.id === data.message_id 
                ? { ...msg, content: eventData.full_response, streaming: true } 
                : msg
            )
          )
          
          // Update the saved chat with the current streaming content
          const streamChat = getChat(conversationId);
          if (streamChat) {
            const streamingMessages = streamChat.messages.map(msg => 
              msg.id === data.message_id 
                ? { 
                    ...msg, 
                    content: eventData.full_response, 
                    streaming: true 
                  } 
                : msg
            );
            
            const updatedStreamChat: Chat = {
              ...streamChat,
              messages: streamingMessages
            };
            
            saveChat(updatedStreamChat);
          }
        } else if (eventData.status === 'error') {
          // Handle error
          setIsTyping(false)
          es.close()
          setEventSource(null)
          
          // Add error message
          const errorMessage: Message = {
            id: data.message_id,
            role: 'assistant',
            content: 'Sorry, there was an error processing your request. Please try again later.',
            timestamp: new Date().toISOString(),
            error: true,
            isNew: true,
          };
          
          setMessages((prev: Message[]) => [
            ...prev.filter(msg => msg.id !== data.message_id),
            errorMessage
          ]);
          
          // Update chat with error message
          const errorChat = getChat(conversationId);
          if (errorChat) {
            const errorMessages = errorChat.messages.filter(msg => msg.id !== data.message_id);
            
            const updatedErrorChat: Chat = {
              ...errorChat,
              messages: [...errorMessages, errorMessage]
            };
            
            saveChat(updatedErrorChat);
            setChatHistory(getChatHistory());
          }
        }
      }
      
      es.onerror = () => {
        console.error('EventSource error')
        es.close()
        setEventSource(null)
        setIsTyping(false)
      }
      
    } catch (error) {
      console.error('Error sending message:', error)
      setIsTyping(false)
      
      // If API fails, use mock mode
      if (conversationId && !conversationId.startsWith('mock-')) {
        console.log('Switching to mock mode for response')
        handleMockResponse(userMessage)
      } else {
        // Add error message
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Sorry, there was an error connecting to the assistant. Please try again later.',
          timestamp: new Date().toISOString(),
          error: true,
          isNew: true,
        };
        
        setMessages((prev: Message[]) => [...prev, errorMessage]);
        
        // Update chat with error message
        const chatWithError = getChat(conversationId);
        if (chatWithError) {
          const updatedChat: Chat = {
            ...chatWithError,
            messages: [...chatWithError.messages, errorMessage]
          };
          
          saveChat(updatedChat);
          setChatHistory(getChatHistory());
        }
      }
    }
  }
  
  // Handle mock responses when API is not available
  const handleMockResponse = (userMessage: Message) => {
    // Simulate typing delay
    setTimeout(() => {
      // Create a response based on the user's message
      let responseContent = ''
      
      // Simple keyword matching for demo purposes
      const lowerCaseMessage = userMessage.content.toLowerCase()
      
      if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
        responseContent = "Hello! I'm your AI legal assistant. How can I help you today?"
      } else if (lowerCaseMessage.includes('tenant') || lowerCaseMessage.includes('rent')) {
        responseContent = "# Tenant Rights\n\nAs a tenant, you generally have several key rights:\n\n1. **Right to habitable living conditions**\n2. **Right to privacy**\n3. **Protection against illegal discrimination**\n4. **Right to your security deposit**\n5. **Protection against retaliatory actions**\n\nThe specific rights can vary by location. What state or country are you located in?"
      } else if (lowerCaseMessage.includes('contract') || lowerCaseMessage.includes('agreement')) {
        responseContent = "## Contract Analysis\n\nWhen reviewing any contract, pay attention to:\n\n- **Parties involved**: Who are the parties entering into the agreement?\n- **Terms and conditions**: What are the specific obligations?\n- **Duration**: How long is the agreement valid for?\n- **Termination clauses**: Under what conditions can the contract be ended?\n- **Dispute resolution**: How will disagreements be handled?\n\nWould you like me to explain any of these aspects in more detail?"
      } else if (lowerCaseMessage.includes('divorce') || lowerCaseMessage.includes('custody')) {
        responseContent = "# Family Law Matters\n\nDivorce and custody issues involve several legal considerations:\n\n1. **Division of assets and debts**\n2. **Child custody and visitation**\n3. **Child support and alimony**\n4. **Retirement and pension division**\n\nThese matters can be resolved through:\n- Mediation\n- Collaborative divorce\n- Litigation\n\nWhat specific aspect are you concerned about?"
      } else {
        responseContent = "I understand you're asking about: \"" + userMessage.content + "\"\n\nThis is a complex legal topic that can vary by jurisdiction. Could you provide more details about your specific situation so I can give you more relevant information?"
      }
      
      // Create the response message with animation
      const mockResponse: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date().toISOString(),
        isNew: true, // Mark as new for animation
      }
      
      // Add the response to messages
      setMessages((prev: Message[]) => [...prev, mockResponse])
      setIsTyping(false)
      
      // Update chat history
      const currentChat = getChat(conversationId!);
      if (currentChat) {
        const updatedChat: Chat = {
          ...currentChat,
          title: generateChatTitle(userMessage.content),
          preview: userMessage.content,
          lastActive: new Date().toISOString(),
          messages: [...currentChat.messages, mockResponse]
        };
        
        saveChat(updatedChat);
        setChatHistory(getChatHistory());
      }
    }, 1500) // Simulate typing delay
  }

  // Handle suggestion click with animation
  const handleSuggestionClick = (question: string) => {
    setInput(question)
    // Add animation to the suggestion that was clicked
    
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent)
    }, 100)
  }

  // Get pages of suggestions with animation
  const nextSuggestionPage = () => {
    setIsPageChanging(true)
    setPageTransitionDirection('next')
    
    setTimeout(() => {
      setCurrentSuggestionPage((prev) => 
        prev === totalSuggestionPages - 1 ? 0 : prev + 1
      )
      setIsPageChanging(false)
    }, 150)
  }

  const prevSuggestionPage = () => {
    setIsPageChanging(true)
    setPageTransitionDirection('prev')
    
    setTimeout(() => {
      setCurrentSuggestionPage((prev) => 
        prev === 0 ? totalSuggestionPages - 1 : prev - 1
      )
      setIsPageChanging(false)
    }, 150)
  }

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }
  
  // Format date for chat history
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    
    // Same day
    if (date.toDateString() === now.toDateString()) {
      return 'Today'
    }
    
    // Yesterday
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    }
    
    // Within last 7 days
    const oneWeekAgo = new Date(now)
    oneWeekAgo.setDate(now.getDate() - 7)
    if (date > oneWeekAgo) {
      return date.toLocaleDateString('en-US', { weekday: 'long' })
    }
    
    // Older than a week
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Handle deleting a conversation
  const handleDeleteConversation = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the loadConversation
    
    // Delete the conversation
    deleteChat(chatId);
    
    // Update the history list
    setChatHistory(getChatHistory());
    
    // If we're deleting the active conversation, create a new one
    if (chatId === activeChatId) {
      createNewConversation();
    }
    
    // Show success message
    toast({
      title: "Conversation deleted",
      description: "The conversation has been removed from your history."
    });
  };

  // Handle manually saving the conversation
  const handleSaveConversation = () => {
    if (conversationId && messages.length > 0) {
      const currentChat = getChat(conversationId);
      
      if (currentChat) {
        // Simply re-save the current conversation to trigger the save animation
        saveChat(currentChat);
        
        // Show save indicator
        setShowSaveIndicator(true);
        setTimeout(() => {
          setShowSaveIndicator(false);
        }, 2000);
        
        // Show success message
        toast({
          title: "Conversation saved",
          description: "Your conversation has been saved successfully."
        });
      }
    }
  };

  // Main content
  return (
    <>
      {/* Add animation styles */}
      <style jsx global>{animationStyles}</style>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Chat history sidebar with enhanced animations */}
        <div 
          className={`fixed inset-y-0 left-0 z-20 mt-16 w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            isHistoryOpen ? 'translate-x-0' : '-translate-x-full'
          } md:relative md:translate-x-0 md:mt-0`}
        >
          <div className="flex flex-col h-full">
            <div className={`p-4 border-b transition-all duration-300 ${animateHeaderEffect ? 'bg-blue-50' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Chat History</h2>
                <button 
                  className="md:hidden p-1 text-gray-500 hover:text-gray-700 transition-transform duration-150 hover:scale-110"
                  onClick={() => setIsHistoryOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <Button 
                className="w-full bg-blue-900 hover:bg-blue-800 flex items-center justify-center button-hover-effect"
                onClick={createNewConversation}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
              
              {/* Search input with focus animation */}
              <div className="relative mt-4 form-field-focus rounded-md">
                <Input
                  type="text"
                  placeholder="Search conversations"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 transition-all duration-200"
                />
                <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* API status indicator with animation */}
            {useMockMode && (
              <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 animate-pulse">
                <div className="flex items-center text-amber-800 text-xs">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span>Demo Mode: Using simulated responses</span>
                </div>
              </div>
            )}
            
            {/* Autosave indicator */}
            {showSaveIndicator && (
              <div className="px-4 py-2 bg-green-50 border-b border-green-100 save-indicator">
                <div className="flex items-center text-green-800 text-xs">
                  <Save className="h-4 w-4 mr-1" />
                  <span>Conversation saved automatically</span>
                </div>
              </div>
            )}
            
            {/* Chat list with animations */}
            <div className="flex-1 overflow-y-auto">
              {filteredHistory.length > 0 ? (
                <div className="divide-y">
                  {filteredHistory.map((chat) => (
                    <div
                      key={chat.id}
                      className={`w-full text-left p-4 transition-all duration-200 history-item relative group ${
                        activeChatId === chat.id ? 'history-item-active' : ''
                      }`}
                    >
                      <button 
                        className="w-full text-left flex items-start" 
                        onClick={() => loadConversation(chat.id)}
                      >
                        <div className={`flex-shrink-0 h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center transition-all duration-300 ${
                          activeChatId === chat.id ? 'bg-blue-200' : ''
                        }`}>
                          <MessageSquare className={`h-5 w-5 text-blue-600 transition-all duration-300 ${
                            activeChatId === chat.id ? 'text-blue-700' : ''
                          }`} />
                        </div>
                        <div className="ml-3 flex-grow">
                          <p className="font-medium text-gray-900 line-clamp-1">{chat.title}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{chat.preview}</p>
                          <div className="flex items-center mt-1 text-xs text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{formatDate(chat.lastActive)}</span>
                          </div>
                        </div>
                      </button>
                      
                      {/* Delete button that appears on hover */}
                      <button
                        className="absolute right-2 top-2 p-1 rounded-full bg-white text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleDeleteConversation(chat.id, e)}
                        title="Delete conversation"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <p>No conversations found</p>
                  {searchTerm && (
                    <button 
                      className="text-blue-600 mt-2 text-sm hover:underline transition-all duration-150"
                      onClick={() => setSearchTerm('')}
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main chat area with enhanced animations */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Chat header with animation */}
          <div className={`bg-white border-b p-4 flex items-center justify-between transition-all duration-300 ${
            animateHeaderEffect ? 'bg-blue-50' : ''
          }`}>
            <div className="flex items-center">
              <button
                className="md:hidden mr-3 p-1 text-gray-500 hover:text-gray-700 transition-all duration-150 hover:scale-110"
                onClick={() => setIsHistoryOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-medium">
                {activeChatId 
                  ? chatHistory.find(chat => chat.id === activeChatId)?.title || 'Chat' 
                  : 'New Chat'}
              </h2>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveConversation}
                className="flex items-center"
                title="Save conversation"
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={createNewConversation}
                className="flex items-center button-hover-effect"
              >
                <Plus className="h-4 w-4 mr-1" />
                New Chat
              </Button>
            </div>
          </div>
          
          {/* Chat messages with loading state */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoadingChat ? (
              <div className="max-w-3xl mx-auto space-y-4">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="flex">
                    <div className="h-8 w-8 rounded-full bg-gray-100 mr-3"></div>
                    <div className="w-full max-w-xl">
                      <div className="h-24 bg-gray-100 rounded-lg skeleton"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="max-w-3xl mx-auto">
                <div className="space-y-6">
                  {messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex max-w-xl ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div 
                          className={`h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                            message.role === 'user' 
                              ? 'bg-blue-100 ml-3' 
                              : 'bg-amber-100 mr-3'
                          } ${message.isNew ? 'animate-pulse' : ''}`}
                        >
                          {message.role === 'user' ? (
                            <User className="h-5 w-5 text-blue-700" />
                          ) : (
                            <FileText className="h-5 w-5 text-amber-700" />
                          )}
                        </div>
                        
                        <div className={`${message.isNew ? (message.role === 'user' ? 'message-new-user' : 'message-new-assistant') : 'opacity-100'}`}>
                          <div 
                            className={`relative px-4 py-3 rounded-lg transition-all duration-200 
                              ${message.role === 'user' 
                                ? 'bg-blue-600 text-white' 
                                : message.error 
                                  ? 'bg-red-50 border border-red-200 text-red-800' 
                                  : 'bg-white border border-gray-200 text-gray-900'}`}
                          >
                            <div className="markdown-content">
                              <ReactMarkdown>
                                {message.content}
                              </ReactMarkdown>
                            </div>
                            <span 
                              className={`text-xs absolute bottom-1 ${
                                message.role === 'user' ? 'right-2 text-blue-200' : 'left-2 text-gray-400'
                              }`}
                            >
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                          
                          {message.role === 'assistant' && !message.streaming && (
                            <div className="flex items-center mt-1 ml-1 space-x-2">
                              <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full transition-all duration-150 hover:scale-110">
                                <ThumbsUp className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full transition-all duration-150 hover:scale-110">
                                <ThumbsDown className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Improved typing indicator */}
                  {isTyping && !messages.some(msg => msg.streaming) && (
                    <div className="flex justify-start">
                      <div className="flex flex-row">
                        <div className="h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center bg-amber-100 mr-3">
                          <FileText className="h-5 w-5 text-amber-700" />
                        </div>
                        <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg shadow-sm">
                          <div className="flex space-x-2">
                            <div className="h-2 w-2 bg-amber-300 rounded-full typing-dot"></div>
                            <div className="h-2 w-2 bg-amber-300 rounded-full typing-dot"></div>
                            <div className="h-2 w-2 bg-amber-300 rounded-full typing-dot"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>
            )}
          </div>
          
          {/* Suggested questions with transition animations */}
          {messages.length < 3 && (
            <div className="border-t bg-gray-50 py-4 transition-all duration-300"
                style={{ opacity: fadeInSuggestions ? 1 : 0.7 }}>
              <div className="max-w-3xl mx-auto px-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Suggested questions</h3>
                <div className="flex items-center">
                  <button 
                    onClick={prevSuggestionPage}
                    className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 mr-2 transition-all duration-150 button-hover-effect"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-grow overflow-hidden">
                    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 w-full transition-all duration-300 ${
                      isPageChanging 
                      ? pageTransitionDirection === 'next' 
                        ? 'opacity-0 transform -translate-x-6' 
                        : 'opacity-0 transform translate-x-6'
                      : 'opacity-100 transform translate-x-0'
                    }`}>
                      {currentSuggestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(question)}
                          className="p-3 text-left border rounded-lg bg-white hover:bg-gray-100 text-gray-900 flex justify-between items-center transition-all duration-200 suggestion-card"
                        >
                          <span className="text-sm">{question}</span>
                          <ArrowRight className="h-4 w-4 text-gray-500 transition-transform duration-200 transform group-hover:translate-x-1" />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    onClick={nextSuggestionPage}
                    className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 ml-2 transition-all duration-150 button-hover-effect"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Input area with enhanced animation */}
          <div className="border-t bg-white p-4">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSubmit} className="flex items-end space-x-2">
                <div className="flex-grow">
                  <div className="p-3 rounded-lg border flex form-field-focus transition-all duration-200 hover:border-blue-300">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your legal question..."
                      className="flex-grow border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 transition-all duration-200"
                      disabled={!conversationId || isTyping}
                    />
                    <button 
                      type="button"
                      className="p-1 text-gray-400 hover:text-gray-600 transition-all duration-150 hover:scale-110"
                    >
                      <Paperclip className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    This AI assistant provides general information, not legal advice.
                  </p>
                </div>
                <Button 
                  type="submit" 
                  className={`bg-blue-900 hover:bg-blue-800 transition-all duration-200 ${
                    input.trim() && !isTyping ? 'shadow-md hover:shadow-lg' : ''
                  } button-hover-effect`}
                  disabled={!input.trim() || !conversationId || isTyping}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}