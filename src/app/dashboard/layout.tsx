"use client"

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { 
  Home,
  MessageSquare, 
  FileText, 
  Settings, 
  Menu,
  Users,
  X,
  LogOut,
  User
} from 'lucide-react'
import { signOut } from 'next-auth/react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    redirect('/auth')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 z-30`}
        style={{ width: '260px' }}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <Link href="/" className="text-xl font-bold text-blue-900">
            <span className="text-2xl font-bold text-[#0A2463]">Lex<span className="text-[#247BA0]">Amp</span></span>
          </Link>
          <button
            className="md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        <div className="px-5 mt-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-5 w-5 text-blue-800" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{session?.user?.name || session?.user?.email}</p>
              <p className="text-xs text-gray-500">Client Account</p>
            </div>
          </div>
        </div>
        
        <nav className="mt-6 px-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Home className="h-5 w-5 text-gray-500" />
            <span>Overview</span>
          </Link>
          <Link
            href="/dashboard/lawyers"
            className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Users className="h-5 w-5 text-gray-500" />
            <span>Find Lawyers</span>
          </Link>
          <Link
            href="/dashboard/assistant"
            className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <MessageSquare className="h-5 w-5 text-gray-500" />
            <span>AI Assistant</span>
          </Link>
          <Link
            href="/dashboard/documents"
            className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FileText className="h-5 w-5 text-gray-500" />
            <span>Documents</span>
          </Link>
          <div className="pt-4 mt-4 border-t border-gray-100">
            <Link
              href="/dashboard/settings"
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Settings className="h-5 w-5 text-gray-500" />
              <span>Settings</span>
            </Link>
            <button
              onClick={() => signOut()}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LogOut className="h-5 w-5 text-gray-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
        
        <div className="px-4 mt-auto mb-6 absolute bottom-0 left-0 right-0">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900">Need legal help?</h4>
            <p className="text-xs text-blue-700 mt-1">Get immediate answers from our AI assistant.</p>
            <Link 
              href="/dashboard/assistant" 
              className="mt-3 text-xs bg-blue-900 text-white px-3 py-2 rounded-md inline-flex items-center"
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Start AI Chat
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`${
          isSidebarOpen ? 'md:pl-64' : ''
        } min-h-screen flex flex-col`}
      >
        {/* Top bar */}
        <div className="bg-white shadow z-10">
          <div className="h-16 flex items-center justify-between px-4">
            <button
              className="md:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6 text-gray-500" />
            </button>
            
            <div className="ml-4 md:ml-0">
              <h1 className="text-lg font-medium text-gray-900">Client Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Help
              </Link>
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