"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Menu } from '@headlessui/react'
import { UserCircle, ChevronDown, Menu as MenuIcon, X } from 'lucide-react'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="flex items-center">
                <div className="mr-2 relative w-10 h-10">
                  <Image src="/logo.png" alt="LexAmp Logo" width={40} height={40} className="object-contain" />
                </div>
                <span className="text-2xl font-bold text-[#0A2463]">Lex<span className="text-[#247BA0]">Amp</span></span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link href="#features" className="text-[#334E68] hover:text-[#0A2463] px-3 py-2 text-sm font-medium transition duration-150 ease-in-out">
              Features
            </Link>
            <Link href="#how-it-works" className="text-[#334E68] hover:text-[#0A2463] px-3 py-2 text-sm font-medium transition duration-150 ease-in-out">
              How it Works
            </Link>
            <Link href="#law-firms" className="text-[#334E68] hover:text-[#0A2463] px-3 py-2 text-sm font-medium transition duration-150 ease-in-out">
              For Law Firms
            </Link>
            <Link href="#contact" className="text-[#334E68] hover:text-[#0A2463] px-3 py-2 text-sm font-medium transition duration-150 ease-in-out">
              Contact
            </Link>
            
            {status === 'authenticated' && session?.user ? (
              <Menu as="div" className="relative ml-3">
                <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E88E5]">
                  <span className="sr-only">Open user menu</span>
                  <div className="flex items-center space-x-2 bg-[#E3F2FD] px-3 py-2 rounded-full">
                    <UserCircle className="h-6 w-6 text-[#247BA0]" />
                    <span className="text-[#0A2463] font-medium">{session.user.email}</span>
                    <ChevronDown className="h-4 w-4 text-[#1E88E5]" />
                  </div>
                </Menu.Button>
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/dashboard"
                        className={`${
                          active ? 'bg-[#E3F2FD]' : ''
                        } block px-4 py-2 text-sm text-[#334E68]`}
                      >
                        Dashboard
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => signOut()}
                        className={`${
                          active ? 'bg-[#E3F2FD]' : ''
                        } block w-full text-left px-4 py-2 text-sm text-[#334E68]`}
                      >
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth"
                  className="px-4 py-2 text-sm font-medium text-[#0A2463] hover:text-[#081D52] transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/firm"
                  className="px-4 py-2 border border-[#247BA0] text-sm font-medium rounded-md text-[#247BA0] bg-white hover:bg-[#E3F2FD] transition duration-150 ease-in-out"
                >
                  Join as a Law Firm
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="p-2 rounded-md text-[#334E68] hover:text-[#0A2463] hover:bg-[#E3F2FD]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="pt-2 pb-3 space-y-1 border-t border-gray-200">
            <Link
              href="#features"
              className="block pl-3 pr-4 py-2 text-base font-medium text-[#334E68] hover:text-[#0A2463] hover:bg-[#E3F2FD]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="block pl-3 pr-4 py-2 text-base font-medium text-[#334E68] hover:text-[#0A2463] hover:bg-[#E3F2FD]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How it Works
            </Link>
            <Link
              href="#law-firms"
              className="block pl-3 pr-4 py-2 text-base font-medium text-[#334E68] hover:text-[#0A2463] hover:bg-[#E3F2FD]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              For Law Firms
            </Link>
            <Link
              href="#contact"
              className="block pl-3 pr-4 py-2 text-base font-medium text-[#334E68] hover:text-[#0A2463] hover:bg-[#E3F2FD]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            {status === 'authenticated' && session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-[#334E68] hover:text-[#0A2463] hover:bg-[#E3F2FD]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
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
                <Link
                  href="/auth"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-[#334E68] hover:text-[#0A2463] hover:bg-[#E3F2FD]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/firm"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-[#247BA0] bg-[#E3F2FD] hover:bg-[#C5E4F3]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Join as a Law Firm
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}