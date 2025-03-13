"use client"
import { useState, useRef, useEffect } from 'react'
import { default as NextLink } from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from 'framer-motion'
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
  Trash2,
  Save,
  MoreHorizontal,
  Search
} from 'lucide-react'
import {
  getChatHistory,
  saveChat,
  getActiveChatId,
  setActiveChatId,
  deleteChat,
  generateChatTitle
} from '@/lib/chatHistoryService'
import type { Message, Chat } from '@/lib/chatHistoryService'

// 示例问题保持不变
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

// 初始欢迎消息
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

export default function AssistantPage() {
  // 状态管理
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messageId, setMessageId] = useState<string | null>(null)
  const [eventSource, setEventSource] = useState<EventSource | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [currentSuggestionPage, setCurrentSuggestionPage] = useState(0)
  
  // 历史记录和UI状态
  const [chatHistory, setChatHistory] = useState<Chat[]>([])
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  // 模拟模式设置
  const [useMockMode, setUseMockMode] = useState(true)
  const [apiStatusChecked, setApiStatusChecked] = useState(false)
  
  // 搜索和分页配置
  const suggestionsPerPage = 4
  const totalSuggestionPages = Math.ceil(suggestedQuestions.length / suggestionsPerPage)
  const currentSuggestions = suggestedQuestions.slice(
    currentSuggestionPage * suggestionsPerPage, 
    (currentSuggestionPage + 1) * suggestionsPerPage
  )

  // 过滤聊天历史
  const filteredHistory = chatHistory.filter(chat => 
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.preview.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 自动滚动到消息底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 加载聊天历史记录
  useEffect(() => {
    const history = getChatHistory();
    setChatHistory(history);
    
    // 获取活跃聊天ID
    const storedActiveChatId = getActiveChatId();
    if (storedActiveChatId) {
      setActiveChatId(storedActiveChatId);
      
      // 加载活跃聊天内容
      const activeChat = history.find(chat => chat.id === storedActiveChatId);
      if (activeChat) {
        setMessages(activeChat.messages);
        setConversationId(activeChat.id);
      }
    }
  }, []);

  // 检查API状态
  useEffect(() => {
    async function checkApiStatus() {
      if (apiStatusChecked) return;
      
      try {
        console.log('正在检查API状态...');
        
        // 增加超时时间到5秒
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('API超时')), 5000)
        );
        
        const apiUrl = getApiBaseUrl();
        console.log('尝试连接到API:', apiUrl);
        
        // 使用更简单的fetch请求，使用HEAD方法
        const fetchPromise = fetch(`${apiUrl}/api/health`, { 
          method: 'HEAD',
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
      }
      
      setApiStatusChecked(true);
      
      // 如果没有活跃会话，创建新会话
      if (!conversationId) {
        createNewConversation();
      }
    }
    
    checkApiStatus();
    
    // 清理函数，关闭任何打开的event source
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [apiStatusChecked, conversationId]);  

  // 获取API基础URL
  const getApiBaseUrl = () => {
    // 优先使用环境变量中的API URL
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    
    // 使用相对URL避免CORS问题
    if (typeof window !== 'undefined') {
      return '/api/chat-backend';
    }
    
    // 默认使用localhost
    return 'http://localhost:5000';
  }  

  // 创建新对话
  const createNewConversation = async () => {
    try {
      // 清理现有事件源
      if (eventSource) {
        eventSource.close()
        setEventSource(null)
      }
      
      // 重置消息
      setMessages(initialMessages)
      setInput('')
      setIsTyping(false)
      
      // 清除活跃聊天ID
      setActiveChatId(null)
      setActiveChatId(null)
      
      if (!useMockMode) {
        try {
          // 尝试创建真实对话
          const response = await fetch(`${getApiBaseUrl()}/api/conversations/new`, {
            method: 'POST',
          })
          
          if (response.ok) {
            const data = await response.json()
            const newConversationId = data.id
            setConversationId(newConversationId)
            
            // 设置初始助手消息
            if (data.messages && data.messages.length > 0) {
              setMessages(data.messages.map((msg: any) => ({
                id: msg.id,
                role: msg.role,
                content: msg.content,
                timestamp: msg.timestamp
              })))
            }
            
            // 创建并保存新聊天
            const newChat: Chat = {
              id: newConversationId,
              title: "New Conversation",
              preview: "Start a new conversation",
              lastActive: new Date().toISOString(),
              messages: [...messages]
            }
            
            saveChat(newChat)
            setChatHistory(prev => [newChat, ...prev])
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
    } catch (error) {
      console.error('Error in createNewConversation:', error)
      createMockConversation()
    }
  }
  
  // 创建模拟对话
  const createMockConversation = () => {
    // 生成模拟对话ID
    const mockId = `mock-${Date.now()}`
    setConversationId(mockId)
    setActiveChatId(null)
    
    // 创建并保存新聊天
    const newChat: Chat = {
      id: mockId,
      title: "New Conversation",
      preview: "Start a new conversation",
      lastActive: new Date().toISOString(),
      messages: [...initialMessages]
    }
    
    saveChat(newChat)
    setChatHistory(prev => [newChat, ...prev])
    console.log("Using mock conversation with ID:", mockId)
  }
  
  // 加载历史对话
  const loadConversation = (chatId: string) => {
    const selectedChat = chatHistory.find(chat => chat.id === chatId)
    if (selectedChat) {
      setMessages(selectedChat.messages)
      setActiveChatId(chatId)
      setConversationId(chatId)
      setActiveChatId(chatId)
      setIsHistoryOpen(false) // 在移动设备上关闭侧边栏
      
      // 保存活跃聊天ID到本地存储
      setActiveChatId(chatId)
    }
  }

  // 删除对话
  const deleteConversation = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation() // 防止点击事件冒泡触发加载对话
    
    // 从本地存储和状态中删除
    deleteChat(chatId)
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId))
    
    // 如果删除的是当前活跃对话，创建新对话
    if (chatId === activeChatId) {
      createNewConversation()
    }
  }

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !conversationId) return
    
    // 立即添加用户消息到状态
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    }
    
    setMessages((prev: Message[]) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    
    // 更新聊天标题（如果是第一条消息）
    if (messages.length <= 1) { // 只有欢迎消息
      const updatedChatHistory = chatHistory.map(chat => {
        if (chat.id === conversationId) {
          return {
            ...chat,
            title: generateChatTitle(input),
            preview: input,
            lastActive: new Date().toISOString()
          }
        }
        return chat
      })
      
      setChatHistory(updatedChatHistory)
      
      // 更新本地存储
      const chatToUpdate = updatedChatHistory.find(chat => chat.id === conversationId)
      if (chatToUpdate) {
        saveChat(chatToUpdate)
      }
    }
    
    // 使用模拟模式或API
    if (useMockMode || conversationId.startsWith('mock-')) {
      handleMockResponse(userMessage)
      return
    }
    
    try {      
      // 步骤1: 发送消息到服务器
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
      
      // 步骤2: 打开SSE连接接收流式响应
      const es = new EventSource(`${getApiBaseUrl()}/api/conversations/${conversationId}/messages/stream`)
      setEventSource(es)
      
      // 创建流式响应的占位符
      const assistantPlaceholder: Message = {
        id: data.message_id,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        streaming: true,
      }
      
      setMessages((prev: Message[]) => [...prev, assistantPlaceholder])
      
      es.onmessage = (event) => {
        const eventData = JSON.parse(event.data)
        
        if (eventData.status === 'complete') {
          // 流完成
          setIsTyping(false)
          es.close()
          setEventSource(null)
          
          // 构建完整的消息
          const completeMessage = {
            ...assistantPlaceholder,
            content: eventData.full_response || assistantPlaceholder.content,
            streaming: false
          }
          
          // 更新消息列表
          setMessages(prev => 
            prev.map(msg => 
              msg.id === data.message_id ? completeMessage : msg
            )
          )
          
          // 完成后，更新聊天历史
          const updatedMessages = [...messages.filter(msg => msg.id !== data.message_id), userMessage, completeMessage]
          
          const updatedChat: Chat = {
            id: conversationId,
            title: chatHistory.find(chat => chat.id === conversationId)?.title || generateChatTitle(userMessage.content),
            preview: userMessage.content,
            lastActive: new Date().toISOString(),
            messages: updatedMessages
          }
          
          // 更新状态和本地存储
          setChatHistory(prev => {
            const existingIndex = prev.findIndex(chat => chat.id === conversationId)
            if (existingIndex >= 0) {
              const updated = [...prev]
              updated[existingIndex] = updatedChat
              return updated
            } else {
              return [updatedChat, ...prev]
            }
          })
          
          saveChat(updatedChat)
        } else if (eventData.chunk) {
          // 更新消息内容
          setMessages(prev => 
            prev.map(msg => 
              msg.id === data.message_id 
                ? { ...msg, content: eventData.full_response, streaming: true } 
                : msg
            )
          )
        } else if (eventData.status === 'error') {
          // 处理错误
          setIsTyping(false)
          es.close()
          setEventSource(null)
          
          // 添加错误消息
          const errorMessage: Message = {
            id: data.message_id,
            role: 'assistant',
            content: 'Sorry, there was an error processing your request. Please try again later.',
            timestamp: new Date().toISOString(),
            error: true,
          }
          
          setMessages(prev => [
            ...prev.filter(msg => msg.id !== data.message_id),
            errorMessage
          ])
          
          // 更新聊天历史
          const updatedChat: Chat = {
            id: conversationId,
            title: chatHistory.find(chat => chat.id === conversationId)?.title || generateChatTitle(userMessage.content),
            preview: userMessage.content,
            lastActive: new Date().toISOString(),
            messages: [...messages.filter(msg => msg.id !== data.message_id), userMessage, errorMessage]
          }
          
          setChatHistory(prev => {
            const existingIndex = prev.findIndex(chat => chat.id === conversationId)
            if (existingIndex >= 0) {
              const updated = [...prev]
              updated[existingIndex] = updatedChat
              return updated
            } else {
              return [updatedChat, ...prev]
            }
          })
          
          saveChat(updatedChat)
        }
      }
      
      es.onerror = () => {
        console.error('EventSource error')
        es.close()
        setEventSource(null)
        setIsTyping(false)
        
        // 添加错误消息
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Connection error. Please try again later.',
          timestamp: new Date().toISOString(),
          error: true,
        }
        
        setMessages(prev => [...prev, errorMessage])
        
        // 更新聊天历史
        const updatedChat: Chat = {
          id: conversationId,
          title: chatHistory.find(chat => chat.id === conversationId)?.title || generateChatTitle(userMessage.content),
          preview: userMessage.content,
          lastActive: new Date().toISOString(),
          messages: [...messages, userMessage, errorMessage]
        }
        
        setChatHistory(prev => {
          const existingIndex = prev.findIndex(chat => chat.id === conversationId)
          if (existingIndex >= 0) {
            const updated = [...prev]
            updated[existingIndex] = updatedChat
            return updated
          } else {
            return [updatedChat, ...prev]
          }
        })
        
        saveChat(updatedChat)
      }
      
    } catch (error) {
      console.error('Error sending message:', error)
      setIsTyping(false)
      
      // 如果API失败，使用模拟模式
      if (conversationId && !conversationId.startsWith('mock-')) {
        console.log('Switching to mock mode for response')
        handleMockResponse(userMessage)
      } else {
        // 添加错误消息
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Sorry, there was an error connecting to the assistant. Please try again later.',
          timestamp: new Date().toISOString(),
          error: true,
        }
        
        setMessages(prev => [...prev, errorMessage])
        
        // 更新聊天历史
        const updatedChat: Chat = {
          id: conversationId,
          title: chatHistory.find(chat => chat.id === conversationId)?.title || generateChatTitle(userMessage.content),
          preview: userMessage.content,
          lastActive: new Date().toISOString(),
          messages: [...messages, userMessage, errorMessage]
        }
        
        setChatHistory(prev => {
          const existingIndex = prev.findIndex(chat => chat.id === conversationId)
          if (existingIndex >= 0) {
            const updated = [...prev]
            updated[existingIndex] = updatedChat
            return updated
          } else {
            return [updatedChat, ...prev]
          }
        })
        
        saveChat(updatedChat)
      }
    }
  }
  
  // 处理模拟响应
  const handleMockResponse = (userMessage: Message) => {
    // 模拟打字延迟
    setTimeout(() => {
      // 创建基于用户消息的响应
      let responseContent = ''
      
      // 简单的关键词匹配
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
      
      // 创建响应消息
      const mockResponse: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date().toISOString(),
      }
      
      // 添加响应到消息列表
      setMessages(prev => [...prev, mockResponse])
      setIsTyping(false)
      
      // 更新聊天历史
      const title = chatHistory.find(chat => chat.id === conversationId)?.title || 
                   generateChatTitle(userMessage.content)
      
      const updatedChat: Chat = {
        id: conversationId || `chat-${Date.now()}`,
        title: title,
        preview: userMessage.content,
        lastActive: new Date().toISOString(),
        messages: [...messages, userMessage, mockResponse]
      }
      
      setChatHistory(prev => {
        const existingIndex = prev.findIndex(chat => chat.id === updatedChat.id)
        if (existingIndex >= 0) {
          const updated = [...prev]
          updated[existingIndex] = updatedChat
          return updated
        } else {
          return [updatedChat, ...prev]
        }
      })
      
      // 保存到本地存储
      saveChat(updatedChat)
    }, 1500) // 模拟打字延迟
  }

  // 处理建议点击
  const handleSuggestionClick = (question: string) => {
    setInput(question)
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent)
    }, 100)
  }

  // 获取建议页
  const nextSuggestionPage = () => {
    setCurrentSuggestionPage((prev) => 
      prev === totalSuggestionPages - 1 ? 0 : prev + 1
    )
  }

  const prevSuggestionPage = () => {
    setCurrentSuggestionPage((prev) => 
      prev === 0 ? totalSuggestionPages - 1 : prev - 1
    )
  }

  // 格式化时间戳
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }
  
  // 格式化聊天历史日期
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    
    // 同一天
    if (date.toDateString() === now.toDateString()) {
      return 'Today'
    }
    
    // 昨天
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    }
    
    // 一周内
    const oneWeekAgo = new Date(now)
    oneWeekAgo.setDate(now.getDate() - 7)
    if (date > oneWeekAgo) {
      return date.toLocaleDateString('en-US', { weekday: 'long' })
    }
    
    // 超过一周
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // 动画变体
  const sidebarVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }
    },
    exit: { 
      x: "-100%", 
      opacity: 0,
      transition: { 
        duration: 0.2, 
        ease: "easeInOut" 
      }
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: { duration: 0.2 }
    }
  };

  const chatItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({ 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: i * 0.05,
        duration: 0.2
      }
    }),
    exit: { 
      opacity: 0, 
      x: -10,
      transition: { duration: 0.1 }
    },
    hover: { 
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      transition: { duration: 0.2 }
    }
  };

  // 主内容
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* 聊天历史侧边栏 */}
      <AnimatePresence>
        {isHistoryOpen && (
          <motion.div 
            className="fixed inset-y-0 left-0 z-20 mt-16 w-72 bg-white shadow-lg"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
          >
            <div className="flex flex-col h-full">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Chat History</h2>
                  <motion.button 
                    className="md:hidden p-1 text-gray-500 hover:text-gray-700"
                    onClick={() => setIsHistoryOpen(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    className="w-full bg-blue-900 hover:bg-blue-800 flex items-center justify-center"
                    onClick={createNewConversation}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Chat
                  </Button>
                </motion.div>
                
                {/* 搜索输入框 */}
                <div className="relative mt-4">
                  <Input
                    type="text"
                    placeholder="Search conversations"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                  <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  {searchTerm && (
                    <motion.button
                      className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() => setSearchTerm('')}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  )}
                </div>
              </div>
              
              {/* API状态指示器 */}
              {useMockMode && (
                <div className="px-4 py-2 bg-amber-50 border-b border-amber-100">
                  <div className="flex items-center text-amber-800 text-xs">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span>Demo Mode: Using simulated responses</span>
                  </div>
                </div>
              )}
              
              {/* 聊天历史列表 */}
              <div className="flex-1 overflow-y-auto">
                <AnimatePresence>
                  {filteredHistory.length > 0 ? (
                    <motion.div 
                      className="divide-y"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {filteredHistory.map((chat, index) => (
                        <motion.button
                          key={chat.id}
                          className={`w-full text-left p-4 hover:bg-gray-50 transition-colors relative ${
                            activeChatId === chat.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                          }`}
                          onClick={() => loadConversation(chat.id)}
                          variants={chatItemVariants}
                          custom={index}
                          whileHover="hover"
                          layoutId={`chat-${chat.id}`}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                              <MessageSquare className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-3 pr-6">
                              <p className="font-medium text-gray-900 line-clamp-1">{chat.title}</p>
                              <p className="text-sm text-gray-500 line-clamp-1">{chat.preview}</p>
                              <div className="flex items-center mt-1 text-xs text-gray-400">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{formatDate(chat.lastActive)}</span>
                              </div>
                            </div>
                          </div>
                          <motion.button
                            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => deleteConversation(chat.id, e)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </motion.button>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="p-4 text-center text-gray-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <p>No conversations found</p>
                      {searchTerm && (
                        <motion.button 
                          className="text-blue-600 mt-2 text-sm"
                          onClick={() => setSearchTerm('')}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Clear search
                        </motion.button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`hidden md:block md:w-72 md:border-r ${isHistoryOpen ? '' : ''}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Chat History</h2>
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                className="w-full bg-blue-900 hover:bg-blue-800 flex items-center justify-center"
                onClick={createNewConversation}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
            </motion.div>
            
            {/* 搜索输入框 */}
            <div className="relative mt-4">
              <Input
                type="text"
                placeholder="Search conversations"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
              <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              {searchTerm && (
                <motion.button
                  className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm('')}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-4 w-4" />
                </motion.button>
              )}
            </div>
          </div>
          
          {/* API状态指示器 */}
          {useMockMode && (
            <div className="px-4 py-2 bg-amber-50 border-b border-amber-100">
              <div className="flex items-center text-amber-800 text-xs">
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span>Demo Mode: Using simulated responses</span>
              </div>
            </div>
          )}
          
          {/* 聊天历史列表 */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence>
              {filteredHistory.length > 0 ? (
                <motion.div 
                  className="divide-y"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {filteredHistory.map((chat, index) => (
                    <motion.div
                      key={chat.id}
                      className={`group w-full text-left p-4 hover:bg-gray-50 transition-colors relative ${
                        activeChatId === chat.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                      }`}
                      variants={chatItemVariants}
                      custom={index}
                      whileHover="hover"
                    >
                      <button 
                        className="w-full text-left"
                        onClick={() => loadConversation(chat.id)}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                            <MessageSquare className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-3 pr-8">
                            <p className="font-medium text-gray-900 line-clamp-1">{chat.title}</p>
                            <p className="text-sm text-gray-500 line-clamp-1">{chat.preview}</p>
                            <div className="flex items-center mt-1 text-xs text-gray-400">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{formatDate(chat.lastActive)}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                      <motion.button
                        className="absolute top-4 right-4 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => deleteConversation(chat.id, e)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  className="p-4 text-center text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <p>No conversations found</p>
                  {searchTerm && (
                    <motion.button 
                      className="text-blue-600 mt-2 text-sm"
                      onClick={() => setSearchTerm('')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Clear search
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 主聊天区域 */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* 聊天头部 */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center">
            <motion.button
              className="md:hidden mr-3 p-1 text-gray-500 hover:text-gray-700"
              onClick={() => setIsHistoryOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Menu className="h-5 w-5" />
            </motion.button>
            <h2 className="text-lg font-medium">
              {activeChatId 
                ? chatHistory.find(chat => chat.id === activeChatId)?.title || 'Chat' 
                : 'New Chat'}
            </h2>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={createNewConversation}
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Chat
            </Button>
          </motion.div>
        </div>
        
        {/* 聊天消息 */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="popLayout">
              <div className="space-y-6">
                {messages.map(message => (
                  <motion.div 
                    key={message.id} 
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    <div className={`flex max-w-xl ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <motion.div 
                        className={`h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                          message.role === 'user' 
                            ? 'bg-blue-100 ml-3' 
                            : 'bg-amber-100 mr-3'
                        }`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        {message.role === 'user' ? (
                          <User className="h-5 w-5 text-blue-700" />
                        ) : (
                          <FileText className="h-5 w-5 text-amber-700" />
                        )}
                      </motion.div>
                      
                      <div>
                        <motion.div 
                          className={`relative px-4 py-3 rounded-lg 
                            ${message.role === 'user' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-white border border-gray-200 text-gray-900'}`}
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2 }}
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
                        </motion.div>
                        
                        {message.role === 'assistant' && !message.streaming && (
                          <motion.div 
                            className="flex items-center mt-1 ml-1 space-x-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            <motion.button 
                              className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <ThumbsUp className="h-4 w-4" />
                            </motion.button>
                            <motion.button 
                              className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <ThumbsDown className="h-4 w-4" />
                            </motion.button>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* 显示打字指示器 */}
                {isTyping && !messages.some(msg => msg.streaming) && (
                  <motion.div 
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="flex flex-row">
                      <div className="h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center bg-amber-100 mr-3">
                        <FileText className="h-5 w-5 text-amber-700" />
                      </div>
                      <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg">
                        <div className="flex space-x-1">
                          <motion.div 
                            className="h-2 w-2 bg-gray-300 rounded-full"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.2 }}
                          ></motion.div>
                          <motion.div 
                            className="h-2 w-2 bg-gray-300 rounded-full"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.2, delay: 0.1 }}
                          ></motion.div>
                          <motion.div 
                            className="h-2 w-2 bg-gray-300 rounded-full"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.2, delay: 0.2 }}
                          ></motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </AnimatePresence>
          </div>
        </div>
        
        {/* 建议问题 */}
        <AnimatePresence>
          {messages.length < 3 && (
            <motion.div 
              className="border-t bg-gray-50 py-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-3xl mx-auto px-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Suggested questions</h3>
                <div className="flex items-center">
                  <motion.button 
                    onClick={prevSuggestionPage}
                    className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 mr-2"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </motion.button>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-grow">
                    <AnimatePresence mode="wait">
                      {currentSuggestions.map((question, index) => (
                        <motion.button
                          key={`${currentSuggestionPage}-${index}`}
                          onClick={() => handleSuggestionClick(question)}
                          className="p-3 text-left border rounded-lg bg-white hover:bg-gray-100 text-gray-900 flex justify-between items-center"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, backgroundColor: 'rgba(243, 244, 246, 1)' }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="text-sm">{question}</span>
                          <ArrowRight className="h-4 w-4 text-gray-500" />
                        </motion.button>
                      ))}
                    </AnimatePresence>
                  </div>
                  
                  <motion.button 
                    onClick={nextSuggestionPage}
                    className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 ml-2"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* 输入区域 */}
        <div className="border-t bg-white p-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="flex items-end space-x-2">
              <div className="flex-grow">
                <div className="p-3 rounded-lg border flex">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your legal question..."
                    className="flex-grow border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                    disabled={!conversationId || isTyping}
                  />
                  <motion.button 
                    type="button"
                    className="p-1 text-gray-400 hover:text-gray-600"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Paperclip className="h-5 w-5" />
                  </motion.button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This AI assistant provides general information, not legal advice.
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  type="submit" 
                  className="bg-blue-900 hover:bg-blue-800"
                  disabled={!input.trim() || !conversationId || isTyping}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </motion.div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}