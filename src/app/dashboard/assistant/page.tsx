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

// Mock data for example questions
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

// Mock data for chat history
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

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        role: 'assistant',
        content: getMockResponse(input),
        timestamp: new Date().toISOString(),
      }
      
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
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

  // Mock AI responses (in a real app, this would be an API call to your AI service)
  const getMockResponse = (question: string) => {
    // Simple pattern matching for demo purposes
    if (question.toLowerCase().includes('will') && question.toLowerCase().includes('trust')) {
      return `Great question about wills and trusts! Here's the key difference:

**Will:**
- Takes effect only after death
- Goes through probate (public court process)
- Distributes only probate assets
- Can name guardians for minor children

**Trust:**
- Can take effect during your lifetime
- Avoids probate (private)
- Can manage assets during incapacity
- Can manage distribution over time rather than all at once

Both documents serve important purposes in estate planning, and many people use both. A will serves as a "safety net" for assets not transferred to your trust.

Would you like more specific information about either wills or trusts?`
    } else if (question.toLowerCase().includes('evict') || question.toLowerCase().includes('tenant')) {
      return `Eviction procedures vary by location, but here's a general process:

1. **Valid legal reason** - Typically non-payment of rent, lease violations, property damage, or illegal activity
2. **Written notice** - Provide proper written notice with specific timeframe (varies by location, usually 3-30 days)
3. **File eviction lawsuit** - If tenant doesn't comply with notice
4. **Court hearing** - Both landlord and tenant present their case
5. **Court judgment** - If landlord wins, court issues order for tenant to vacate
6. **Enforcement** - If tenant still refuses to leave, local law enforcement handles removal

Important notes:
- "Self-help" evictions (changing locks, removing belongings, shutting off utilities) are illegal
- Local tenant protection laws may add requirements
- The COVID-19 pandemic affected eviction procedures in many jurisdictions

I recommend consulting with a local attorney who specializes in landlord-tenant law for advice specific to your situation.`
    } else if (question.toLowerCase().includes('car accident')) {
      return `Here are the steps you should take after a car accident:

**Immediate steps:**
1. Check for injuries and call 911 if needed
2. Move to a safe location if possible
3. Call police to file a report
4. Exchange information with other driver(s):
   - Name and contact information
   - Insurance company and policy number
   - Driver's license and license plate numbers
   - Vehicle make, model, and year
5. Document the scene:
   - Take photos of all vehicles and damage
   - Note road conditions, traffic signs, and weather
   - Get contact information from witnesses

**Follow-up steps:**
1. Notify your insurance company promptly
2. Seek medical attention (even for minor injuries)
3. Keep track of all expenses and documentation
4. Contact a personal injury attorney if:
   - There are significant injuries
   - There's dispute about fault
   - Insurance company is not cooperating

Remember, what you say after an accident can impact your claim. Stick to facts and avoid admitting fault.`
    } else {
      // Generic response for other questions
      return `Thanks for your question! While I can provide general legal information, the specifics of your situation may require personalized legal advice.

Based on your question about "${question.split(' ').slice(0, 5).join(' ')}...", I'd recommend:

1. Researching relevant laws in your jurisdiction
2. Consulting with a qualified attorney who specializes in this area of law
3. Gathering all relevant documentation related to your situation

Would you like me to help narrow down what type of legal professional would be best suited to help with this specific issue?`
    }
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
                    
                    {message.role === 'assistant' && (
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
            {isTyping && (
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
              disabled={!input.trim() || isTyping}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}