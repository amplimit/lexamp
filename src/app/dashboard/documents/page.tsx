'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Calendar, Bell, ArrowRight, Book, Shield, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export default function DocumentsPage() {
  // Animation states
  const [isEmailFocused, setIsEmailFocused] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [countdown, setCountdown] = useState({ days: 30, hours: 12, minutes: 45, seconds: 0 })

  // Update countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  }

  const iconVariants = {
    hidden: { scale: 0, rotate: -180, opacity: 0 },
    visible: { 
      scale: 1, 
      rotate: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 0.1
      }
    },
    hover: { 
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.95 }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      // In a real application, you would send this to your backend
      console.log('Notification subscription:', email)
    }
  }

  const floatingFeatures = [
    {
      title: "AI-Powered Document Analysis",
      description: "Extract key information from legal documents automatically",
      icon: <FileText className="h-6 w-6 text-blue-600" />,
      delay: 0
    },
    {
      title: "Smart Contract Generation",
      description: "Create legal documents tailored to your specific needs",
      icon: <Book className="h-6 w-6 text-blue-600" />,
      delay: 0.3
    },
    {
      title: "Secure Document Storage",
      description: "Keep all your legal documents organized and secure",
      icon: <Shield className="h-6 w-6 text-blue-600" />,
      delay: 0.6
    }
  ]

  return (
    <div className="container mx-auto p-6 h-[calc(100vh-6rem)] flex items-center justify-center">
      <motion.div
        className="max-w-4xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="flex justify-center mb-8"
          variants={iconVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center shadow-lg">
            <FileText className="h-12 w-12 text-blue-900" />
          </div>
        </motion.div>

        <motion.h1 
          className="text-4xl font-bold text-gray-900 mb-4"
          variants={itemVariants}
        >
          Document Management Coming Soon
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-600 mb-8"
          variants={itemVariants}
        >
          We're building a powerful document management system to help you create, analyze, and manage legal documents with ease.
        </motion.p>
        
        {/* Countdown timer */}
        <motion.div
          className="mb-12"
          variants={itemVariants}
        >
          <p className="text-sm text-gray-500 mb-4">Estimated launch in:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <CountdownBox value={countdown.days} label="Days" />
            <CountdownBox value={countdown.hours} label="Hours" />
            <CountdownBox value={countdown.minutes} label="Minutes" />
            <CountdownBox value={countdown.seconds} label="Seconds" />
          </div>
        </motion.div>
        
        {/* Floating feature cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          variants={itemVariants}
        >
          {floatingFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
              initial={{ y: 0 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ 
                repeat: Infinity, 
                duration: 3,
                delay: feature.delay,
                ease: "easeInOut"
              }}
              whileHover={{ 
                y: -5, 
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f8fafc"
              }}
            >
              <div className="flex items-center justify-center mb-4">
                <motion.div 
                  className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {feature.icon}
                </motion.div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Notification form */}
        <motion.div 
          className="max-w-md mx-auto"
          variants={itemVariants}
        >
          {!isSubmitted ? (
            <Card className="p-6 shadow-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Get notified when we launch</h3>
              <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <div className="relative">
                  <Bell className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${isEmailFocused ? 'text-blue-600' : 'text-gray-400'}`} />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 transition-all duration-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                    required
                  />
                </div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800">
                    Notify Me
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </form>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-green-50 p-6 rounded-lg border border-green-100 shadow-md"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <motion.svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="text-green-600"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </motion.svg>
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Thank you for subscribing!</h3>
              <p className="text-gray-600">We'll notify you as soon as our document management system launches.</p>
            </motion.div>
          )}
        </motion.div>
        
        {/* Animated background elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-blue-100 opacity-20"
              style={{
                width: Math.random() * 100 + 20,
                height: Math.random() * 100 + 20,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * 100 - 50],
                x: [0, Math.random() * 100 - 50],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: Math.random() * 5
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// Countdown box component
function CountdownBox({ value, label }: { value: number, label: string }) {
  return (
    <motion.div 
      className="bg-blue-900 text-white p-3 rounded-lg flex flex-col items-center justify-center min-w-[80px] shadow-lg"
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.05, backgroundColor: "#1e3a8a" }}
      transition={{ duration: 0.2 }}
    >
      <motion.span 
        key={value} 
        className="text-2xl font-bold"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {value.toString().padStart(2, '0')}
      </motion.span>
      <span className="text-xs text-blue-100">{label}</span>
    </motion.div>
  )
}