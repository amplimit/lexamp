"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function FirmRegisterPage() {
  const [isLogin, setIsLogin] = useState(false)
  const [formData, setFormData] = useState({
    firmName: '',
    email: '',
    password: '',
    confirmPassword: '',
    licenseNumber: '',
    jurisdictions: [],
    specializations: []
  })
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
  const router = useRouter()

  const specializations = [
    'Criminal Law', 'Family Law', 'Personal Injury', 'Real Estate Law', 
    'Corporate Law', 'Immigration Law', 'Intellectual Property', 'Tax Law'
  ]

  const jurisdictions = [
    'California', 'New York', 'Texas', 'Florida', 'Illinois', 
    'Pennsylvania', 'Ohio', 'Georgia', 'Michigan', 'Other'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, array: string) => {
    const { value, checked } = e.target
    setFormData(prev => {
      if (checked) {
        return { 
          ...prev, 
          [array]: [...prev[array as keyof typeof prev] as string[], value] 
        }
      } else {
        return { 
          ...prev, 
          [array]: (prev[array as keyof typeof prev] as string[]).filter(item => item !== value) 
        }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step === 1) {
      // Validate first step
      if (!formData.email || !formData.password) {
        setError('Email and password are required')
        return
      }
      
      if (!isLogin && formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return
      }
      
      if (isLogin) {
        // Handle login logic here
        try {
          // Replace with actual login API call
          console.log('Login with:', { email: formData.email, password: formData.password })
          router.push('/firm-dashboard')
        } catch (err) {
          setError('Invalid login credentials')
        }
      } else {
        // Move to second step for registration
        setStep(2)
        setError('')
      }
    } else if (step === 2) {
      // Validate second step
      if (!formData.firmName || !formData.licenseNumber) {
        setError('Firm name and license number are required')
        return
      }
      
      if (formData.jurisdictions.length === 0) {
        setError('Please select at least one jurisdiction')
        return
      }
      
      if (formData.specializations.length === 0) {
        setError('Please select at least one specialization')
        return
      }
      
      // Submit registration
      try {
        // Replace with actual registration API call
        console.log('Registering firm:', formData)
        
        // For demo purposes, navigate to firm dashboard
        router.push('/firm-dashboard')
      } catch (err) {
        setError('Failed to register. Please try again.')
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? 'Sign in to your law firm account' : 'Register your law firm'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          {' '}
          <button
            className="font-medium text-blue-600 hover:text-blue-500"
            onClick={() => {
              setIsLogin(!isLogin)
              setStep(1)
              setError('')
            }}
          >
            {isLogin ? 'Register here' : 'Sign in'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {step === 1 ? (
              // Step 1: Basic credentials
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Step 2: Firm details
              <>
                <div>
                  <label htmlFor="firmName" className="block text-sm font-medium text-gray-700">
                    Law Firm Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="firmName"
                      name="firmName"
                      type="text"
                      required
                      value={formData.firmName}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                    Bar License Number
                  </label>
                  <div className="mt-1">
                    <input
                      id="licenseNumber"
                      name="licenseNumber"
                      type="text"
                      required
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jurisdictions
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                    {jurisdictions.map(jurisdiction => (
                      <div key={jurisdiction} className="flex items-center">
                        <input
                          id={`jurisdiction-${jurisdiction}`}
                          name="jurisdictions"
                          type="checkbox"
                          value={jurisdiction}
                          onChange={e => handleCheckboxChange(e, 'jurisdictions')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`jurisdiction-${jurisdiction}`} className="ml-2 text-sm text-gray-700">
                          {jurisdiction}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Practice Areas
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                    {specializations.map(specialization => (
                      <div key={specialization} className="flex items-center">
                        <input
                          id={`specialization-${specialization}`}
                          name="specializations"
                          type="checkbox"
                          value={specialization}
                          onChange={e => handleCheckboxChange(e, 'specializations')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`specialization-${specialization}`} className="ml-2 text-sm text-gray-700">
                          {specialization}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              {step === 2 && !isLogin && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="mb-4 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back
                </button>
              )}
              
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLogin ? 'Sign in' : step === 1 ? 'Continue' : 'Register'}
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {isLogin ? 'New to UniversaLegal?' : 'Not a law firm?'}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href={isLogin ? "/auth/firm" : "/auth"}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                {isLogin ? 'Register your law firm' : 'Sign in as a client'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}