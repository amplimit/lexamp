"use client"

import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Menu } from '@headlessui/react'
import { UserCircle, ChevronDown } from 'lucide-react'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-900">Universal<span className="text-amber-700">Legal</span></span>
            </Link>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link href="#features" className="text-gray-700 hover:text-blue-900 px-3 py-2 text-sm font-medium transition duration-150 ease-in-out">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-700 hover:text-blue-900 px-3 py-2 text-sm font-medium transition duration-150 ease-in-out">
              How it Works
            </Link>
            <Link href="#law-firms" className="text-gray-700 hover:text-blue-900 px-3 py-2 text-sm font-medium transition duration-150 ease-in-out">
              For Law Firms
            </Link>
            <Link href="#contact" className="text-gray-700 hover:text-blue-900 px-3 py-2 text-sm font-medium transition duration-150 ease-in-out">
              Contact
            </Link>
            
            {status === 'authenticated' && session?.user ? (
              <Menu as="div" className="relative ml-3">
                <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <span className="sr-only">Open user menu</span>
                  <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-full">
                    <UserCircle className="h-6 w-6 text-blue-700" />
                    <span className="text-blue-900 font-medium">{session.user.email}</span>
                    <ChevronDown className="h-4 w-4 text-blue-500" />
                  </div>
                </Menu.Button>
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/dashboard"
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } block px-4 py-2 text-sm text-gray-700`}
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
                          active ? 'bg-gray-100' : ''
                        } block w-full text-left px-4 py-2 text-sm text-gray-700`}
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
                  className="px-4 py-2 text-sm font-medium text-blue-900 hover:text-blue-800"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/firm"
                  className="px-4 py-2 border border-amber-600 text-sm font-medium rounded-md text-amber-700 bg-white hover:bg-amber-50 transition duration-150 ease-in-out"
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
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg 
                className="h-6 w-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 border-t border-gray-200">
            <Link
              href="#features"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-blue-900 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-blue-900 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How it Works
            </Link>
            <Link
              href="#law-firms"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-blue-900 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              For Law Firms
            </Link>
            <Link
              href="#contact"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-blue-900 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            {status === 'authenticated' && session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-blue-900 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-blue-900 hover:bg-gray-50"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-blue-900 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/firm"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-amber-700 bg-amber-50 hover:bg-amber-100"
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