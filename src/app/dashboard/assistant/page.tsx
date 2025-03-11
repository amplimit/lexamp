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
  AlertTriangle
} from 'lucide-react'

// Define message interface
interface Message {
  id: string | number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  streaming?: boolean;
  error?: boolean;
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

// Sample chat history (in a real implementation, this would come from the API)
const sampleChatHistory: Chat[] = [
  {
    id: 'chat-1',
    title: 'Rental Agreement Question',
    preview: 'What are my rights as a tenant?',
    lastActive: '2025-03-10T14:30:00.000Z',
    messages: [
      {
        id: '1a',
        role: 'assistant',
        content: 'Hello! How can I help you today?',
        timestamp: '2025-03-10T14:25:00.000Z',
      },
      {
        id: '2a',
        role: 'user',
        content: 'What are my rights as a tenant?',
        timestamp: '2025-03-10T14:26:00.000Z',
      },
      {
        id: '3a',
        role: 'assistant',
        content: '# Tenant Rights Overview\n\nAs a tenant, you generally have several key rights:\n\n1. **Right to habitable living conditions** - Your landlord must provide safe, sanitary housing\n2. **Right to privacy** - Landlords typically must provide notice before entering\n3. **Protection against illegal discrimination** - Based on protected characteristics\n4. **Right to your security deposit** - With proper documentation of damages\n5. **Protection against retaliatory actions** - Such as eviction for exercising legal rights\n\nThe specific rights can vary by location. *What state or country are you located in so I can provide more specific information?*',
        timestamp: '2025-03-10T14:28:00.000Z',
      }
    ]
  },
  {
    id: 'chat-2',
    title: 'Contract Review Help',
    preview: 'I need help understanding a contract clause.',
    lastActive: '2025-03-09T10:15:00.000Z',
    messages: [
      {
        id: '1b',
        role: 'assistant',
        content: 'Hello! How can I help you today?',
        timestamp: '2025-03-09T10:10:00.000Z',
      },
      {
        id: '2b',
        role: 'user',
        content: 'I need help understanding a contract clause.',
        timestamp: '2025-03-09T10:12:00.000Z',
      },
      {
        id: '3b',
        role: 'assistant',
        content: "I'd be happy to help you understand a contract clause. Could you please share the specific clause or section you're having trouble with?\n\nWhen analyzing contract clauses, I typically look at:\n\n- **Plain language meaning** - What the text literally states\n- **Context within the document** - How it relates to other provisions\n- **Legal terminology** - Any specialized terms with specific meanings\n- **Common interpretations** - How courts typically view similar language\n\nIf you can provide the exact wording, I'll do my best to explain it clearly.",
        timestamp: '2025-03-09T10:15:00.000Z',
      }
    ]
  },
  {
    id: 'chat-3',
    title: 'Small Claims Court Question',
    preview: 'How do I file in small claims court?',
    lastActive: '2025-03-08T16:45:00.000Z',
    messages: [
      {
        id: '1c',
        role: 'assistant',
        content: 'Hello! How can I help you today?',
        timestamp: '2025-03-08T16:40:00.000Z',
      },
      {
        id: '2c',
        role: 'user',
        content: 'How do I file in small claims court?',
        timestamp: '2025-03-08T16:42:00.000Z',
      },
      {
        id: '3c',
        role: 'assistant',
        content: '## Small Claims Court Filing Process\n\nFiling in small claims court typically involves these general steps:\n\n1. **Determine eligibility** - Verify your case qualifies for small claims (typically disputes under a certain dollar amount)\n2. **Identify jurisdiction** - Find the correct court for your location\n3. **Complete forms** - Fill out the required court documents\n4. **Pay filing fee** - Submit payment (fees vary by location)\n5. **Serve the defendant** - Formally notify the other party according to court rules\n6. **Prepare for hearing** - Gather evidence and organize your presentation\n\n> The specific process varies by location. Which state or jurisdiction are you in?\n\n*Note: Most small claims courts have self-help resources available on their websites.*',
        timestamp: '2025-03-08T16:45:00.000Z',
      }
    ]
  }
]

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
  
  // State for history and UI functionality
  const [chatHistory, setChatHistory] = useState<Chat[]>(sampleChatHistory)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Use mock mode instead of real API (toggle this based on your environment)
  const [useMockMode, setUseMockMode] = useState(true)
  const [apiStatusChecked, setApiStatusChecked] = useState(false)
  
  const suggestionsPerPage = 4
  const totalSuggestionPages = Math.ceil(suggestedQuestions.length / suggestionsPerPage)
  const currentSuggestions = suggestedQuestions.slice(
    currentSuggestionPage * suggestionsPerPage, 
    (currentSuggestionPage + 1) * suggestionsPerPage
  )

  // Filter chat history based on search term
  const filteredHistory = chatHistory.filter(chat => 
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.preview.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Check API status on component mount
  useEffect(() => {
    const checkApiStatus = async () => {
      if (apiStatusChecked) return;
      
      try {
        console.log('Checking API status...');
        
        // Simple ping to check if API is available
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('API timeout')), 2000)
        );
        
        console.log('Attempting to connect to:', getApiBaseUrl());
        const fetchPromise = fetch(getApiBaseUrl(), { 
          method: 'HEAD',
          // Adding these headers to help diagnose potential CORS issues 
          headers: {
            'Accept': 'application/json',
          },
          // Ensure credentials are included if needed
          credentials: 'include',
        });
        
        // Race between fetch and timeout
        await Promise.race([fetchPromise, timeoutPromise]);
        
        // If we get here, API is available
        setUseMockMode(false);
        console.log('✅ API is available, using real mode');
      } catch (error) {
        // API is not available
        setUseMockMode(true);
        console.error('❌ API connection failed:', error instanceof Error ? error.message : String(error));
        console.log('Using mock mode instead');
        
        // Show more diagnostic information
        console.log('Network diagnosis:');
        console.log('- Target API URL:', getApiBaseUrl());
        console.log('- Check if the server is running on that port');
        console.log('- Check for CORS configuration on the server');
        console.log('- Check browser console for more detailed error messages');
      }
      
      setApiStatusChecked(true);
      createNewConversation();
    };
    
    checkApiStatus();
    
    // Cleanup function to close any open event source
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [apiStatusChecked]);

  // Get API base URL from environment variable or use default
  const getApiBaseUrl = () => {
    // In a real app, you would use environment variables
    // Try with different URL formats to help debugging
    
    // 1. Check if we're running in the same origin (e.g., proxy setup)
    if (typeof window !== 'undefined') {
      // When running in browser, we can try a relative URL first
      // which avoids CORS issues if the API is proxied through Next.js
      return '/api/chat-backend';
    }
    
    // 2. Explicit localhost URL as fallback
    return 'http://localhost:5000';
  }

  // Function to create a new conversation
  const createNewConversation = async () => {
    try {
      // Clean up existing event source if any
      if (eventSource) {
        eventSource.close()
        setEventSource(null)
      }
      
      setMessages(initialMessages)
      setInput('')
      setIsTyping(false)
      
      if (!useMockMode) {
        try {
          // Try to create a real conversation with the API
          const response = await fetch(`${getApiBaseUrl()}/api/conversations/new`, {
            method: 'POST',
          })
          
          if (response.ok) {
            const data = await response.json()
            setConversationId(data.id)
            setActiveChatId(null) // Reset active chat
            
            // Set initial assistant message from API response if available
            if (data.messages && data.messages.length > 0) {
              setMessages(data.messages.map((msg: any) => ({
                id: msg.id,
                role: msg.role,
                content: msg.content,
                timestamp: msg.timestamp
              })))
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
    } catch (error) {
      console.error('Error in createNewConversation:', error)
      createMockConversation()
    }
  }
  
  // Create a mock conversation when API is not available
  const createMockConversation = () => {
    // Generate a mock conversation ID
    const mockId = `mock-${Date.now()}`
    setConversationId(mockId)
    setActiveChatId(null)
    console.log("Using mock conversation with ID:", mockId)
  }
  
  // Load a conversation from history
  const loadConversation = (chatId: string) => {
    const selectedChat = chatHistory.find(chat => chat.id === chatId)
    if (selectedChat) {
      setMessages(selectedChat.messages)
      setActiveChatId(chatId)
      setIsHistoryOpen(false) // Close sidebar on mobile
    }
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
    }
    
    setMessages((prev: Message[]) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    
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
      }
      
      setMessages((prev: Message[]) => [...prev, assistantPlaceholder])
      
      es.onmessage = (event) => {
        const eventData = JSON.parse(event.data)
        
        if (eventData.status === 'complete') {
          // Stream is complete
          setIsTyping(false)
          es.close()
          setEventSource(null)
          
          // After completing a message, update the chat history with this new conversation
          const newChat: Chat = {
            id: conversationId || `chat-${Date.now()}`,
            title: userMessage.content.length > 30 
              ? `${userMessage.content.substring(0, 30)}...` 
              : userMessage.content,
            preview: userMessage.content,
            lastActive: new Date().toISOString(),
            messages: [...messages, userMessage, {
              ...assistantPlaceholder,
              content: eventData.full_response || assistantPlaceholder.content,
              streaming: false
            }]
          }
          
          setChatHistory((prev: Chat[]) => {
            // Check if we're updating an existing conversation or adding a new one
            const existingIndex = prev.findIndex(chat => chat.id === newChat.id)
            if (existingIndex >= 0) {
              const updated = [...prev]
              updated[existingIndex] = newChat
              return updated
            } else {
              return [newChat, ...prev]
            }
          })
          
        } else if (eventData.chunk) {
          // Update the message with new chunk
          setMessages((prev: Message[]) => 
            prev.map(msg => 
              msg.id === data.message_id 
                ? { ...msg, content: eventData.full_response, streaming: true } 
                : msg
            )
          )
        } else if (eventData.status === 'error') {
          // Handle error
          setIsTyping(false)
          es.close()
          setEventSource(null)
          
          // Add error message
          setMessages((prev: Message[]) => [
            ...prev.filter(msg => msg.id !== data.message_id),
            {
              id: data.message_id,
              role: 'assistant',
              content: 'Sorry, there was an error processing your request. Please try again later.',
              timestamp: new Date().toISOString(),
              error: true,
            }
          ])
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
        setMessages((prev: Message[]) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: 'Sorry, there was an error connecting to the assistant. Please try again later.',
            timestamp: new Date().toISOString(),
            error: true,
          }
        ])
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
      
      // Create the response message
      const mockResponse: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date().toISOString(),
      }
      
      // Add the response to messages
      setMessages((prev: Message[]) => [...prev, mockResponse])
      setIsTyping(false)
      
      // Update chat history
      const newChat: Chat = {
        id: conversationId || `chat-${Date.now()}`,
        title: userMessage.content.length > 30 
          ? `${userMessage.content.substring(0, 30)}...` 
          : userMessage.content,
        preview: userMessage.content,
        lastActive: new Date().toISOString(),
        messages: [...messages, userMessage, mockResponse]
      }
      
      setChatHistory((prev: Chat[]) => {
        const existingIndex = prev.findIndex(chat => chat.id === newChat.id)
        if (existingIndex >= 0) {
          const updated = [...prev]
          updated[existingIndex] = newChat
          return updated
        } else {
          return [newChat, ...prev]
        }
      })
    }, 1500) // Simulate typing delay
  }

  // Handle suggestion click
  const handleSuggestionClick = (question: string) => {
    setInput(question)
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent)
    }, 100)
  }

  // Get pages of suggestions
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

  // Main content
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Chat history sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-20 mt-16 w-72 bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${
          isHistoryOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 md:mt-0`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Chat History</h2>
              <button 
                className="md:hidden p-1 text-gray-500 hover:text-gray-700"
                onClick={() => setIsHistoryOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Button 
              className="w-full bg-blue-900 hover:bg-blue-800 flex items-center justify-center"
              onClick={createNewConversation}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
            
            {/* Search input */}
            <div className="relative mt-4">
              <Input
                type="text"
                placeholder="Search conversations"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
              <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* API status indicator */}
          {useMockMode && (
            <div className="px-4 py-2 bg-amber-50 border-b border-amber-100">
              <div className="flex items-center text-amber-800 text-xs">
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span>Demo Mode: Using simulated responses</span>
              </div>
            </div>
          )}
          
          {/* Chat list */}
          <div className="flex-1 overflow-y-auto">
            {filteredHistory.length > 0 ? (
              <div className="divide-y">
                {filteredHistory.map((chat) => (
                  <button
                    key={chat.id}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                      activeChatId === chat.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                    }`}
                    onClick={() => loadConversation(chat.id)}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900 line-clamp-1">{chat.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{chat.preview}</p>
                        <div className="flex items-center mt-1 text-xs text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{formatDate(chat.lastActive)}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p>No conversations found</p>
                {searchTerm && (
                  <button 
                    className="text-blue-600 mt-2 text-sm"
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

      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Chat header */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              className="md:hidden mr-3 p-1 text-gray-500 hover:text-gray-700"
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
          <Button
            variant="outline"
            size="sm"
            onClick={createNewConversation}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Chat
          </Button>
        </div>
        
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4">
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
                      }`}
                    >
                      {message.role === 'user' ? (
                        <User className="h-5 w-5 text-blue-700" />
                      ) : (
                        <FileText className="h-5 w-5 text-amber-700" />
                      )}
                    </div>
                    
                    <div>
                      <div 
                        className={`relative px-4 py-3 rounded-lg 
                          ${message.role === 'user' 
                            ? 'bg-blue-600 text-white' 
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
                          <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full">
                            <ThumbsUp className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full">
                            <ThumbsDown className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Show typing indicator */}
              {isTyping && !messages.some(msg => msg.streaming) && (
                <div className="flex justify-start">
                  <div className="flex flex-row">
                    <div className="h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center bg-amber-100 mr-3">
                      <FileText className="h-5 w-5 text-amber-700" />
                    </div>
                    <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
        
        {/* Suggested questions */}
        {messages.length < 3 && (
          <div className="border-t bg-gray-50 py-4">
            <div className="max-w-3xl mx-auto px-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Suggested questions</h3>
              <div className="flex items-center">
                <button 
                  onClick={prevSuggestionPage}
                  className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 mr-2"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-grow">
                  {currentSuggestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(question)}
                      className="p-3 text-left border rounded-lg bg-white hover:bg-gray-100 text-gray-900 flex justify-between items-center"
                    >
                      <span className="text-sm">{question}</span>
                      <ArrowRight className="h-4 w-4 text-gray-500" />
                    </button>
                  ))}
                </div>
                
                <button 
                  onClick={nextSuggestionPage}
                  className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 ml-2"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Input area */}
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
                  <button 
                    type="button"
                    className="p-1 text-gray-400 hover:text-gray-600"
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
                className="bg-blue-900 hover:bg-blue-800"
                disabled={!input.trim() || !conversationId || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}