// src/app/dashboard/layout.tsx
"use client"

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { default as NextLink } from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home,
  MessageSquare, 
  FileText, 
  Settings, 
  Menu,
  Users,
  X,
  LogOut,
  User,
  ChevronDown
} from 'lucide-react'
import { signOut } from 'next-auth/react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    redirect('/auth')
  }

  // Animation variants
  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  }

  const profileMenuVariants = {
    hidden: { opacity: 0, y: -5, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      } 
    },
    exit: { 
      opacity: 0, 
      y: -5, 
      scale: 0.95,
      transition: { 
        duration: 0.15,
        ease: [0.4, 0, 1, 1]
      } 
    }
  }

  const navItemVariants = {
    hover: {
      backgroundColor: "rgba(243, 244, 246, 1)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.div
        className="fixed top-0 left-0 h-full bg-white shadow-lg z-30"
        initial={false}
        animate={isSidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        style={{ width: '260px' }}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <NextLink href="/" className="text-xl font-bold text-blue-900">
            <span className="text-2xl font-bold text-[#0A2463]">Lex<span className="text-[#247BA0]">Amp</span></span>
          </NextLink>
          <motion.button
            className="md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-6 w-6 text-gray-500" />
          </motion.button>
        </div>
        
        <div className="px-5 mt-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <motion.div 
                className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <User className="h-5 w-5 text-blue-800" />
              </motion.div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{session?.user?.name || session?.user?.email}</p>
              <p className="text-xs text-gray-500">Client Account</p>
            </div>
          </div>
        </div>
        
        <nav className="mt-6 px-4 space-y-1">
          <motion.div
            whileHover="hover"
            whileTap="tap"
            variants={navItemVariants}
          >
            <NextLink
              href="/dashboard"
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Home className="h-5 w-5 text-gray-500" />
              <span>Overview</span>
            </NextLink>
          </motion.div>
          
          <motion.div
            whileHover="hover"
            whileTap="tap"
            variants={navItemVariants}
          >
            <NextLink
              href="/dashboard/lawyers"
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Users className="h-5 w-5 text-gray-500" />
              <span>Find Lawyers</span>
            </NextLink>
          </motion.div>
          
          <motion.div
            whileHover="hover"
            whileTap="tap"
            variants={navItemVariants}
          >
            <NextLink
              href="/dashboard/assistant"
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MessageSquare className="h-5 w-5 text-gray-500" />
              <span>AI Assistant</span>
            </NextLink>
          </motion.div>
          
          <motion.div
            whileHover="hover"
            whileTap="tap"
            variants={navItemVariants}
          >
            <NextLink
              href="/dashboard/documents"
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FileText className="h-5 w-5 text-gray-500" />
              <span>Documents</span>
            </NextLink>
          </motion.div>
          
          <div className="pt-4 mt-4 border-t border-gray-100">
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={navItemVariants}
            >
              <NextLink
                href="/dashboard/settings"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Settings className="h-5 w-5 text-gray-500" />
                <span>Settings</span>
              </NextLink>
            </motion.div>
            
            <motion.button
              onClick={() => signOut()}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              whileHover="hover"
              whileTap="tap"
              variants={navItemVariants}
            >
              <LogOut className="h-5 w-5 text-gray-500" />
              <span>Sign Out</span>
            </motion.button>
          </div>
        </nav>
        
        <div className="px-4 mt-auto mb-6 absolute bottom-0 left-0 right-0">
          <motion.div 
            className="bg-blue-50 rounded-lg p-4"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            <h4 className="text-sm font-medium text-blue-900">Need legal help?</h4>
            <p className="text-xs text-blue-700 mt-1">Get immediate answers from our AI assistant.</p>
            <NextLink 
              href="/dashboard/assistant" 
              className="mt-3 text-xs bg-blue-900 text-white px-3 py-2 rounded-md inline-flex items-center"
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Start AI Chat
            </NextLink>
          </motion.div>
        </div>
      </motion.div>

      {/* Main content */}
      <div
        className={`${
          isSidebarOpen ? 'md:pl-64' : ''
        } min-h-screen flex flex-col`}
      >
        {/* Top bar */}
        <div className="bg-white shadow z-10">
          <div className="h-16 flex items-center justify-between px-4">
            <motion.button
              className="md:hidden"
              onClick={() => setIsSidebarOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Menu className="h-6 w-6 text-gray-500" />
            </motion.button>
            
            <div className="ml-4 md:ml-0">
              <h1 className="text-lg font-medium text-gray-900">Client Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative" ref={profileRef}>
                <motion.button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center text-sm text-gray-700 focus:outline-none"
                  whileHover={{ color: '#0A2463' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="mr-2">{session?.user?.email}</span>
                  <motion.div
                    animate={{ rotate: isProfileOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </motion.button>
                
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                      variants={profileMenuVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <div className="py-1">
                        <NextLink
                          href="/dashboard/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Account Settings
                        </NextLink>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            signOut();
                            setIsProfileOpen(false);
                          }}
                        >
                          Sign out
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Content area */}
        <main className="flex-1 relative">
          {children}
        </main>
      </div>
    </div>
  )
}