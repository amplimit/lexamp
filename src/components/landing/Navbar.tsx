"use client"

import NextLink from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { UserCircle, ChevronDown, Menu as MenuIcon, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Animation variants
  const menuVariants = {
    hidden: { opacity: 0, y: -5, scale: 0.95, transformOrigin: 'top right' },
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

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { 
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: { 
        duration: 0.2,
        ease: [0.4, 0, 1, 1]
      }
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <NextLink href="/" passHref>
                <div className="flex items-center cursor-pointer">
                  <div className="mr-2 relative w-10 h-10">
                    <Image src="/logo.png" alt="LexAmp Logo" width={40} height={40} className="object-contain" />
                  </div>
                  <span className="text-2xl font-bold text-[#0A2463]">Lex<span className="text-[#247BA0]">Amp</span></span>
                </div>
              </NextLink>
            </div>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-6">
            <NextLink href="#features" className="text-[#334E68] hover:text-[#0A2463] px-3 py-2 text-sm font-medium transition duration-150 ease-in-out">
              Features
            </NextLink>
            <NextLink href="#how-it-works" className="text-[#334E68] hover:text-[#0A2463] px-3 py-2 text-sm font-medium transition duration-150 ease-in-out">
              How it Works
            </NextLink>
            <NextLink href="#law-firms" className="text-[#334E68] hover:text-[#0A2463] px-3 py-2 text-sm font-medium transition duration-150 ease-in-out">
              For Law Firms
            </NextLink>
            <NextLink href="#contact" className="text-[#334E68] hover:text-[#0A2463] px-3 py-2 text-sm font-medium transition duration-150 ease-in-out">
              Contact
            </NextLink>
            
            {status === 'authenticated' && session?.user ? (
              <div className="relative" ref={profileRef}>
                <motion.button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E88E5]"
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="sr-only">Open user menu</span>
                  <motion.div 
                    className="flex items-center space-x-2 bg-[#E3F2FD] px-3 py-2 rounded-full"
                    whileHover={{ backgroundColor: '#C1DFFB' }}
                    transition={{ duration: 0.2 }}
                  >
                    <UserCircle className="h-6 w-6 text-[#247BA0]" />
                    <span className="text-[#0A2463] font-medium">{session.user.email}</span>
                    <motion.div
                      animate={{ rotate: isProfileOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4 text-[#1E88E5]" />
                    </motion.div>
                  </motion.div>
                </motion.button>
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-30"
                      variants={menuVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <NextLink
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-[#334E68] hover:bg-[#E3F2FD] transition-colors duration-150"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Dashboard
                      </NextLink>
                      <button
                        onClick={() => {
                          signOut();
                          setIsProfileOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-[#334E68] hover:bg-[#E3F2FD] transition-colors duration-150"
                      >
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <NextLink
                    href="/auth"
                    className="px-4 py-2 text-sm font-medium text-[#0A2463] hover:text-[#081D52] transition"
                  >
                    Sign In
                  </NextLink>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <NextLink
                    href="/auth/firm"
                    className="px-4 py-2 border border-[#247BA0] text-sm font-medium rounded-md text-[#247BA0] bg-white hover:bg-[#E3F2FD] transition duration-150 ease-in-out"
                  >
                    Join as a Law Firm
                  </NextLink>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <motion.button
              type="button"
              className="p-2 rounded-md text-[#334E68] hover:text-[#0A2463] hover:bg-[#E3F2FD]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu with animation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden bg-white overflow-hidden"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="pt-2 pb-3 space-y-1 border-t border-gray-200">
              <NextLink
                href="#features"
                className="block pl-3 pr-4 py-2 text-base font-medium text-[#334E68] hover:text-[#0A2463] hover:bg-[#E3F2FD]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </NextLink>
              <NextLink
                href="#how-it-works"
                className="block pl-3 pr-4 py-2 text-base font-medium text-[#334E68] hover:text-[#0A2463] hover:bg-[#E3F2FD]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How it Works
              </NextLink>
              <NextLink
                href="#law-firms"
                className="block pl-3 pr-4 py-2 text-base font-medium text-[#334E68] hover:text-[#0A2463] hover:bg-[#E3F2FD]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                For Law Firms
              </NextLink>
              <NextLink
                href="#contact"
                className="block pl-3 pr-4 py-2 text-base font-medium text-[#334E68] hover:text-[#0A2463] hover:bg-[#E3F2FD]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </NextLink>
              {status === 'authenticated' && session?.user ? (
                <>
                  <NextLink
                    href="/dashboard"
                    className="block pl-3 pr-4 py-2 text-base font-medium text-[#334E68] hover:text-[#0A2463] hover:bg-[#E3F2FD]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </NextLink>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-[#334E68] hover:text-[#0A2463] hover:bg-[#E3F2FD]"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <NextLink
                    href="/auth"
                    className="block pl-3 pr-4 py-2 text-base font-medium text-[#334E68] hover:text-[#0A2463] hover:bg-[#E3F2FD]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </NextLink>
                  <NextLink
                    href="/auth/firm"
                    className="block pl-3 pr-4 py-2 text-base font-medium text-[#247BA0] bg-[#E3F2FD] hover:bg-[#C5E4F3]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Join as a Law Firm
                  </NextLink>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}