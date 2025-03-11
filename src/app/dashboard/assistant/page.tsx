// src/app/dashboard/assistant/page.tsx - Updated version
"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Send, 
  Paperclip, 
  FileText, 
  User, 
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

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
const initialMessages = [
  {
    id: 1,
    role: 'assistant',
    content: `Hello! I'm your AI legal assistant. I'm here to provide general legal information and guidance.

Please note that while I can help explain legal concepts and procedures, my responses do not constitute legal advice, and I am not a substitute for a qualified attorney.

How can I help you today?`,
    timestamp: new Date().toISOString(),
  }
]

export default function AssistantPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const [messageId, setMessageId] = useState(null)
  const [eventSource, setEventSource] = useState(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [currentSuggestionPage, setCurrentSuggestionPage] = useState(0)
  
  const suggestionsPerPage = 4
  const totalSuggestionPages = Math.ceil(suggestedQuestions.length / suggestionsPerPage)
  const currentSuggestions = suggestedQuestions.slice(
    currentSuggestionPage * suggestionsPerPage, 
    (currentSuggestionPage + 1) * suggestionsPerPage
  )

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Create a new conversation when component mounts
  useEffect(() => {
    async function createConversation() {
      try {
        const response = await fetch('http://localhost:5000/api/conversations/new', {
          method: 'POST',
        });
        
        if (response.ok) {
          const data = await response.json();
          setConversationId(data.id);
          
          // Set initial assistant message from API response
          if (data.messages && data.messages.length > 0) {
            setMessages(data.messages.map(msg => ({
              id: msg.id,
              role: msg.role,
              content: msg.content,
              timestamp: msg.timestamp
            })));
          }
        } else {
          console.error('Failed to create conversation');
        }
      } catch (error) {
        console.error('Error creating conversation:', error);
      }
    }

    createConversation();
    
    // Cleanup function to close any open event source
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !conversationId) return
    
    // Add user message to state immediately
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    
    try {
      // Step 1: Send message to server
      const response = await fetch(`http://localhost:5000/api/conversations/${conversationId}/messages/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.content }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      setMessageId(data.message_id);
      
      // Step 2: Open SSE connection to receive streaming response
      const es = new EventSource(`http://localhost:5000/api/conversations/${conversationId}/messages/stream`);
      setEventSource(es);
      
      // Create a placeholder for the streaming response
      const assistantPlaceholder = {
        id: data.message_id,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        streaming: true,
      };
      
      setMessages(prev => [...prev, assistantPlaceholder]);
      
      es.onmessage = (event) => {
        const eventData = JSON.parse(event.data);
        
        if (eventData.status === 'complete') {
          // Stream is complete
          setIsTyping(false);
          es.close();
          setEventSource(null);
        } else if (eventData.chunk) {
          // Update the message with new chunk
          setMessages(prev => 
            prev.map(msg => 
              msg.id === data.message_id 
                ? { ...msg, content: eventData.full_response, streaming: true } 
                : msg
            )
          );
        } else if (eventData.status === 'error') {
          // Handle error
          setIsTyping(false);
          es.close();
          setEventSource(null);
          
          // Add error message
          setMessages(prev => [
            ...prev.filter(msg => msg.id !== data.message_id),
            {
              id: data.message_id,
              role: 'assistant',
              content: 'Sorry, there was an error processing your request. Please try again later.',
              timestamp: new Date().toISOString(),
              error: true,
            }
          ]);
        }
      };
      
      es.onerror = () => {
        console.error('EventSource error');
        es.close();
        setEventSource(null);
        setIsTyping(false);
      };
      
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Sorry, there was an error connecting to the assistant. Please try again later.',
          timestamp: new Date().toISOString(),
          error: true,
        }
      ]);
    }
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
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          {/* Chat messages */}
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
                      <div className="whitespace-pre-line">{message.content}</div>
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
  )
}