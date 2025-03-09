"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  Users, 
  BarChart, 
  FileText, 
  MessageSquare, 
  Calendar, 
  DollarSign, 
  Settings 
} from 'lucide-react'

// Mock data for demonstration
const mockInquiries = [
  { id: 1, client: 'John D.', topic: 'Real Estate Contract Review', status: 'New', date: '2025-03-01' },
  { id: 2, client: 'Sarah M.', topic: 'Divorce Consultation', status: 'Pending', date: '2025-03-02' },
  { id: 3, client: 'Robert J.', topic: 'Business Formation', status: 'Completed', date: '2025-03-05' },
]

const mockStats = {
  pendingInquiries: 2,
  completedInquiries: 1,
  totalRevenue: 850,
  conversionRate: 65
}

export default function FirmDashboard() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState('overview')
  
  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    redirect('/auth/firm')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top navigation */}
      <nav className="bg-blue-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold">Universal<span className="text-amber-400">Legal</span></span>
                <span className="ml-2 text-sm bg-blue-800 px-2 py-1 rounded">Law Firm Portal</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm mr-4">Welcome, {session?.user?.name || 'Law Firm'}</span>
              <button className="p-1 rounded-full text-white hover:bg-blue-800">
                <Settings className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar navigation */}
        <div className="w-64 bg-white shadow-md h-[calc(100vh-4rem)] fixed">
          <div className="p-4">
            <nav className="mt-5 space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'overview'
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChart className="mr-3 h-5 w-5" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('inquiries')}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'inquiries'
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="mr-3 h-5 w-5" />
                Client Inquiries
              </button>
              <button
                onClick={() => setActiveTab('contracts')}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'contracts'
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FileText className="mr-3 h-5 w-5" />
                Contracts
              </button>
              <button
                onClick={() => setActiveTab('clients')}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'clients'
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Users className="mr-3 h-5 w-5" />
                Client Management
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'calendar'
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Calendar className="mr-3 h-5 w-5" />
                Calendar
              </button>
              <button
                onClick={() => setActiveTab('billing')}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'billing'
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <DollarSign className="mr-3 h-5 w-5" />
                Billing
              </button>
            </nav>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 ml-64 p-8">
          {activeTab === 'overview' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
              
              {/* Stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
                      <MessageSquare className="h-6 w-6 text-blue-800" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Pending Inquiries</p>
                      <h3 className="text-xl font-semibold text-gray-900">{mockStats.pendingInquiries}</h3>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
                      <FileText className="h-6 w-6 text-green-800" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Completed Cases</p>
                      <h3 className="text-xl font-semibold text-gray-900">{mockStats.completedInquiries}</h3>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-amber-100 rounded-full p-3">
                      <DollarSign className="h-6 w-6 text-amber-800" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Revenue (USD)</p>
                      <h3 className="text-xl font-semibold text-gray-900">${mockStats.totalRevenue}</h3>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-100 rounded-full p-3">
                      <BarChart className="h-6 w-6 text-purple-800" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                      <h3 className="text-xl font-semibold text-gray-900">{mockStats.conversionRate}%</h3>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recent inquiries */}
              <div className="bg-white rounded-lg shadow mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Inquiries</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Topic
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockInquiries.map((inquiry) => (
                        <tr key={inquiry.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {inquiry.client}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {inquiry.topic}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              inquiry.status === 'New' 
                                ? 'bg-blue-100 text-blue-800' 
                                : inquiry.status === 'Pending' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-green-100 text-green-800'
                            }`}>
                              {inquiry.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {inquiry.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <a href="#" className="text-blue-600 hover:text-blue-900">
                              View
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 border-t border-gray-200">
                  <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    View all inquiries →
                  </a>
                </div>
              </div>
              
              {/* Onboarding panel */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-blue-900">Complete Your Setup</h3>
                <p className="mt-1 text-sm text-blue-700">
                  Finish setting up your profile to start receiving client inquiries.
                </p>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">Create account</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">Verify credentials</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                        <span className="text-blue-600 font-medium text-sm">3</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">Complete firm profile</p>
                      <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                        Update profile →
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                        <span className="text-gray-600 font-medium text-sm">4</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">Set up payment information</p>
                      <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                        Configure payment →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Placeholder for other tabs */}
          {activeTab !== 'overview' && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>
              <p className="text-gray-600 mb-6">
                This section is coming soon. You'll be able to manage your {activeTab} here.
              </p>
              <button
                onClick={() => setActiveTab('overview')}
                className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}