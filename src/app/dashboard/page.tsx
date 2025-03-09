"use client"

import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/card'
import { 
  BarChart,
  MessageSquare,
  FileText,
  Users,
} from 'lucide-react'
import Link from 'next/link'

// Mock data
const mockLawyers = [
  { id: 1, name: 'Jennifer Wilson', specialty: 'Family Law', rating: 4.9, reviews: 124 },
  { id: 2, name: 'Michael Chen', specialty: 'Real Estate', rating: 4.8, reviews: 98 },
  { id: 3, name: 'Sarah Johnson', specialty: 'Corporate Law', rating: 4.7, reviews: 87 },
]

const mockConsultations = [
  { id: 1, topic: 'Rental Agreement Review', date: '2025-03-05', status: 'Completed' },
  { id: 2, topic: 'Business Contract Question', date: '2025-03-08', status: 'Scheduled' },
]

export default function DashboardPage() {
  const { data: session } = useSession()

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {session?.user?.name || 'User'}</h1>
        <p className="text-gray-600 mt-1">What legal help do you need today?</p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="p-6 border-blue-100 hover:border-blue-300 transition-colors">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Find a Lawyer</h3>
              <p className="text-sm text-gray-500">Connect with qualified legal professionals</p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/dashboard/lawyers" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Browse lawyers →
            </Link>
          </div>
        </Card>
        
        <Card className="p-6 border-blue-100 hover:border-blue-300 transition-colors">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-amber-700" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Ask AI Assistant</h3>
              <p className="text-sm text-gray-500">Get instant answers to legal questions</p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/dashboard/assistant" className="text-amber-600 hover:text-amber-800 text-sm font-medium">
              Start conversation →
            </Link>
          </div>
        </Card>
        
        <Card className="p-6 border-blue-100 hover:border-blue-300 transition-colors">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <FileText className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Create Document</h3>
              <p className="text-sm text-gray-500">Generate contracts and legal documents</p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/dashboard/documents" className="text-green-600 hover:text-green-800 text-sm font-medium">
              Browse templates →
            </Link>
          </div>
        </Card>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming consultations */}
        <div className="lg:col-span-2">
          <Card className="border-t-4 border-t-blue-600">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Your Consultations</h2>
                <Link href="/dashboard/consultations" className="text-sm text-blue-600 hover:text-blue-800">
                  View all
                </Link>
              </div>
              
              {mockConsultations.length > 0 ? (
                <div className="space-y-4">
                  {mockConsultations.map(consultation => (
                    <div key={consultation.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{consultation.topic}</h3>
                          <p className="text-sm text-gray-500">Scheduled for: {consultation.date}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          consultation.status === 'Completed' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {consultation.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No consultations yet</h3>
                  <p className="text-gray-500 mb-4">Schedule your first consultation with a lawyer</p>
                  <Link
                    href="/dashboard/lawyers"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Find a Lawyer
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </div>
        
        {/* Recommended lawyers */}
        <div>
          <Card className="border-t-4 border-t-amber-500">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Top Lawyers</h2>
                <Link href="/dashboard/lawyers" className="text-sm text-blue-600 hover:text-blue-800">
                  View all
                </Link>
              </div>
              
              <div className="space-y-4">
                {mockLawyers.map(lawyer => (
                  <div key={lawyer.id} className="flex items-start space-x-3 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">{lawyer.name.charAt(0)}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{lawyer.name}</h3>
                      <p className="text-sm text-gray-500">{lawyer.specialty}</p>
                      <div className="flex items-center mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              className={`h-4 w-4 ${i < Math.floor(lawyer.rating) ? 'text-amber-400' : 'text-gray-300'}`} 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">({lawyer.reviews})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Coming soon section */}
      <div className="mt-8">
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <BarChart className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Coming Soon</h3>
              <p className="mt-1 text-sm text-gray-600">
                We're working on adding more features to help you with your legal needs. Stay tuned for AI-powered document analysis, smart contract generation, and more!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}