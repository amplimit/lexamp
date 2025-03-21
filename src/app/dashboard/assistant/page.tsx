"use client"

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { useSession } from 'next-auth/react'
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
  Loader2,
  RefreshCw,
  Check
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import 'katex/dist/katex.min.css'

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
  
  /* Markdown table styles */
  .markdown-content table {
    border-collapse: collapse;
    margin: 1em 0;
    width: 100%;
    overflow-x: auto;
    display: block;
  }
  
  .markdown-content table th,
  .markdown-content table td {
    border: 1px solid #e2e8f0;
    padding: 8px 12px;
    text-align: left;
  }
  
  .markdown-content table th {
    background-color: #f8fafc;
    font-weight: 600;
  }
  
  .markdown-content table tr:nth-child(even) {
    background-color: #f9fafb;
  }
  
  /* LaTeX/KaTeX styles overrides */
  .markdown-content .katex-display {
    margin: 1em 0;
    overflow-x: auto;
    overflow-y: hidden;
  }
  
  .markdown-content .katex {
    font-size: 1.1em;
  }
  
  /* Dark theme adjustments for user messages */
  .bg-blue-600 .markdown-content {
    color: white;
  }
  
  .bg-blue-600 .markdown-content table th,
  .bg-blue-600 .markdown-content table td {
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  .bg-blue-600 .markdown-content table th {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .bg-blue-600 .markdown-content table tr:nth-child(even) {
    background-color: rgba(255, 255, 255, 0.05);
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

  /* Delete button animation */
  .delete-btn {
    opacity: 0;
    transition: all 0.2s ease;
  }
  
  .history-item:hover .delete-btn {
    opacity: 1;
  }
  
  /* Form field focus animation */
  .form-field-focus {
    transition: all 0.2s ease;
  }
  
  .form-field-focus:focus-within {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }
  
  /* Skeleton loading animation */
`;

export default function AssistantPage() {
  // Use session for authentication
  const { data: session, status } = useSession()
  
  // Search params to check for active conversation
  const searchParams = useSearchParams();
  const router = useRouter();
  
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
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false)
  const [isDeletingChat, setIsDeletingChat] = useState<string | null>(null)
  
  // Dialog state for deletion confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [chatToDelete, setChatToDelete] = useState<string | null>(null)
  
  // Animation states
  const [fadeInSuggestions, setFadeInSuggestions] = useState(true)
  const [animateHeaderEffect, setAnimateHeaderEffect] = useState(false)
  
  // Use mock mode instead of real API (toggle this based on your environment)
  const [useMockMode, setUseMockMode] = useState(false)
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

  // Load conversation from URL parameter if provided
  useEffect(() => {
    const conversationIdFromUrl = searchParams.get('id');
    if (conversationIdFromUrl && apiStatusChecked) {
      loadConversation(conversationIdFromUrl);
    }
  }, [searchParams, apiStatusChecked]);

  // Auto scroll to bottom of messages only when shouldScrollToBottom is true
  useEffect(() => {
    if (shouldScrollToBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      setShouldScrollToBottom(false)
    }
  }, [shouldScrollToBottom, messages])

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

  // Load conversation history on component mount
  useEffect(() => {
    if (apiStatusChecked) {
      loadConversationHistory();
    }
  }, [apiStatusChecked]);

  // Check API status on component mount
  useEffect(() => {
    async function checkApiStatus() {
      if (apiStatusChecked) return;
      
      // Check if user is authenticated first
      if (status === 'loading') {
        // Wait for session loading to complete
        return;
      }
      
      if (status === 'unauthenticated') {
        // Redirect to login if not authenticated
        router.push('/auth');
        return;
      }
      
      try {
        console.log('Checking API status...');
        
        // Add timeout to avoid hanging if API is not responsive
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('API timeout')), 5000)
        );
        
        const fetchPromise = fetch('/api/chat-backend/health', { 
          method: 'HEAD',
          credentials: 'omit'
        });
        
        // Race between fetch and timeout
        await Promise.race([fetchPromise, timeoutPromise]);
        
        // If we get here, API is available
        setUseMockMode(false);
        console.log('API available, using real mode');
      } catch (error) {
        // API is not available
        setUseMockMode(false); // Still use real API but with fallback to database
        console.error('Direct API connection failed:', error instanceof Error ? error.message : String(error));
        console.log('Using database-backed mode');
      }
      
      setApiStatusChecked(true);
      
      // Check for conversation ID in URL or create new conversation
      const conversationIdFromUrl = searchParams.get('id');
      if (conversationIdFromUrl) {
        // Will be handled by the other useEffect
      } else {
        createNewConversation();
      }
    };
    
    checkApiStatus();
    
    // Cleanup function to close any open EventSource
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

  // Load conversation history from the server
  const loadConversationHistory = async () => {
    try {
      const response = await fetch('/api/conversations');
      
      if (response.ok) {
        const data = await response.json();
        setChatHistory(data);
      } else {
        console.error('Failed to load conversation history');
      }
    } catch (error) {
      console.error('Error loading conversation history:', error);
    }
  };

  // Delete conversation - show confirmation dialog
  const confirmDeleteConversation = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the chat selection
    setChatToDelete(chatId);
    setDeleteDialogOpen(true);
  };
  
  // Actually delete the conversation after confirmation
  const deleteConversation = async () => {
    if (!chatToDelete) return;
    
    try {
      setIsDeletingChat(chatToDelete);
      setDeleteDialogOpen(false);
      
      const response = await fetch(`/api/conversations/${chatToDelete}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Remove from chat history state
        setChatHistory(prev => prev.filter(chat => chat.id !== chatToDelete));
        
        // If this was the active chat, create a new conversation
        if (activeChatId === chatToDelete) {
          createNewConversation();
        }
        
        // If we're on this chat's page, redirect to base assistant page
        if (searchParams.get('id') === chatToDelete) {
          router.push('/dashboard/assistant');
        }
      } else {
        console.error('Failed to delete conversation');
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    } finally {
      setIsDeletingChat(null);
      setChatToDelete(null);
    }
  };

  // Function to create a new conversation with animation
  const createNewConversation = async () => {
    try {
      // Check authentication status
      if (status === 'unauthenticated') {
        console.error('User not authenticated');
        router.push('/auth');
        return;
      }
      
      if (!session?.user?.id) {
        console.error('No user ID available');
        // Show an error message with fallback to local mode
        setMessages([{
          id: 'auth-error',
          role: 'assistant',
          content: "There was an authentication error. Please try logging out and logging back in.",
          timestamp: new Date().toISOString(),
          error: true,
          isNew: true
        }]);
        return;
      }
      
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
      
      setInput('');
      setIsTyping(false);
      
      try {
        // Create a real conversation with the API
        const response = await fetch(`/api/conversations/new`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setConversationId(data.id)
          setActiveChatId(data.id) // Set as active chat
          
          // Update URL with the new conversation ID without full page reload
          router.push(`/dashboard/assistant?id=${data.id}`, { scroll: false });
          
          // Set initial messages from API response if available
          if (data.messages && data.messages.length > 0) {
            setMessages(data.messages.map((msg: any) => ({
              id: msg.id,
              role: msg.role,
              content: msg.content,
              timestamp: msg.timestamp,
              isNew: true
            })))
          } else {
            // Reset to initial welcome message if no messages from server
            setMessages([...initialMessages].map(msg => ({ ...msg, isNew: true })));
          }
          
          // Update chat history
          loadConversationHistory();
        } else {
          // Handle error response
          const errorData = await response.json();
          console.error('Error creating conversation:', errorData);
          
          // Show error message to user
          setMessages([{
            id: 'api-error',
            role: 'assistant',
            content: `There was an error creating a new conversation: ${errorData.error || 'Unknown error'}. ${errorData.details || ''}`,
            timestamp: new Date().toISOString(),
            error: true,
            isNew: true
          }]);
          
          // Still try to load existing conversations
          loadConversationHistory();
        }
      } catch (error) {
        console.error('Error creating conversation with API:', error)
        // Show error message to user
        setMessages([{
          id: 'exception-error',
          role: 'assistant',
          content: `There was an error connecting to the server. Please check your connection and try again.`,
          timestamp: new Date().toISOString(),
          error: true,
          isNew: true
        }]);
      }
      
      // Scroll to bottom with new messages
      setShouldScrollToBottom(true);
      
      // Complete loading animation
      setTimeout(() => {
        setIsLoadingChat(false);
      }, 300);
      
    } catch (error) {
      console.error('Error in createNewConversation:', error)
      setIsLoadingChat(false);
      // Show general error message
      setMessages([{
        id: 'general-error',
        role: 'assistant',
        content: `An unexpected error occurred. Please try again later.`,
        timestamp: new Date().toISOString(),
        error: true,
        isNew: true
      }]);
      setShouldScrollToBottom(true);
    }
  }
  
  // Load a conversation from history with animation
  const loadConversation = async (chatId: string) => {
    setIsLoadingChat(true);
    
    try {
      const response = await fetch(`/api/conversations/${chatId}`);
      
      if (response.ok) {
        const data = await response.json();
        
        setMessages(data.messages.map((msg: any) => ({
          ...msg,
          isNew: true
        })));
        
        setConversationId(data.id);
        setActiveChatId(chatId);
        
        // Update URL if needed (only if it doesn't already have this ID)
        if (searchParams.get('id') !== chatId) {
          router.push(`/dashboard/assistant?id=${chatId}`, { scroll: false });
        }
        
        setIsHistoryOpen(false); // Close sidebar on mobile
        
        // Scroll to bottom with loaded messages
        setShouldScrollToBottom(true);
      } else {
        console.error('Failed to load conversation:', await response.text());
        createNewConversation(); // Create a new conversation if loading fails
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      createNewConversation(); // Create a new conversation if loading fails
    } finally {
      setIsLoadingChat(false);
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
      isNew: true, // Mark as new for animation
    }
    
    setMessages((prev: Message[]) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    
    // Set shouldScrollToBottom to true when a message is sent
    setShouldScrollToBottom(true)
    
    try {      
      // Step 1: Send message to server
      const response = await fetch(`/api/conversations/${conversationId}/messages/stream`, {
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
      const es = new EventSource(`/api/conversations/${conversationId}/messages/stream?messageId=${data.message_id}`)
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
      
      es.onmessage = (event) => {
        const eventData = JSON.parse(event.data)
        
        if (eventData.status === 'complete') {
          // Stream is complete
          setIsTyping(false)
          es.close()
          setEventSource(null)
          
          // After completing a message, update the chat history
          loadConversationHistory();
          
        } else if (eventData.chunk || eventData.full_response) {
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
          
          // Add error message with animation
          setMessages((prev: Message[]) => [
            ...prev.filter(msg => msg.id !== data.message_id),
            {
              id: data.message_id,
              role: 'assistant',
              content: 'Sorry, there was an error processing your request. Please try again later.',
              timestamp: new Date().toISOString(),
              error: true,
              isNew: true,
            }
          ])
          
          // Update chat history
          loadConversationHistory();
        }
      }
      
      es.onerror = () => {
        console.error('EventSource error')
        es.close()
        setEventSource(null)
        setIsTyping(false)
        
        // Add error message with animation
        setMessages((prev: Message[]) => {
          // Only add error message if there isn't already a response with this message ID
          if (!prev.some(m => m.id === data.message_id && m.role === 'assistant' && m.content)) {
            return [
              ...prev.filter(msg => !(msg.id === data.message_id && msg.streaming)),
              {
                id: data.message_id,
                role: 'assistant',
                content: 'Sorry, there was an error connecting to the assistant. Please try again later.',
                timestamp: new Date().toISOString(),
                error: true,
                isNew: true,
              }
            ];
          }
          return prev;
        });
        
        // Update chat history
        loadConversationHistory();
      }
      
    } catch (error) {
      console.error('Error sending message:', error)
      setIsTyping(false)
      
      // Add error message with animation
      setMessages((prev: Message[]) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Sorry, there was an error connecting to the assistant. Please try again later.',
          timestamp: new Date().toISOString(),
          error: true,
          isNew: true,
        }
      ])
      
      // Update chat history
      loadConversationHistory();
    }
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
            
            {/* Chat list with animations */}
            <div className="flex-1 overflow-y-auto">
              {filteredHistory.length > 0 ? (
                <div className="divide-y">
                  {filteredHistory.map((chat) => (
                    <div
                      key={chat.id}
                      className={`relative group ${
                        activeChatId === chat.id ? 'history-item-active' : ''
                      }`}
                    >
                      <button
                        className={`w-full text-left p-4 transition-all duration-200 history-item ${
                          activeChatId === chat.id ? 'history-item-active' : ''
                        }`}
                        onClick={() => loadConversation(chat.id)}
                      >
                        <div className="flex items-start">
                          <div className={`flex-shrink-0 h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center transition-all duration-300 ${
                            activeChatId === chat.id ? 'bg-blue-200' : ''
                          }`}>
                            <MessageSquare className={`h-5 w-5 text-blue-600 transition-all duration-300 ${
                              activeChatId === chat.id ? 'text-blue-700' : ''
                            }`} />
                          </div>
                          <div className="ml-3 flex-grow pr-6">
                            <p className="font-medium text-gray-900 line-clamp-1">{chat.title}</p>
                            <p className="text-sm text-gray-500 line-clamp-1">{chat.preview}</p>
                            <div className="flex items-center mt-1 text-xs text-gray-400">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{formatDate(chat.lastActive)}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                      <button 
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-red-500 rounded-full delete-btn z-10"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          confirmDeleteConversation(chat.id, e);
                        }}
                        disabled={isDeletingChat === chat.id}
                        title="Delete conversation"
                      >
                        {isDeletingChat === chat.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
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
          {/* Top bar */}
          <div className={`bg-white border-b p-4 flex items-center justify-between transition-all duration-300 ${
            animateHeaderEffect ? 'bg-blue-50' : ''
          }`}>
            <div className="flex items-center">
              <button
                className="md:hidden mr-3 p-1 text-gray-500 hover:text-gray-700 transition-all duration-150 hover:scale-110"
                onClick={() => setIsHistoryOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <h2 className="text-lg font-medium text-gray-900">
                {activeChatId 
                  ? chatHistory.find(chat => chat.id === activeChatId)?.title || 'Chat' 
                  : 'New Chat'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-2">
              {conversationId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadConversation(conversationId)}
                  className="flex items-center button-hover-effect"
                  title="Refresh conversation"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
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
                              <ReactMarkdown 
                                remarkPlugins={[remarkGfm, remarkMath]} 
                                rehypePlugins={[rehypeKatex]}
                              >
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
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Conversation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={deleteConversation}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}