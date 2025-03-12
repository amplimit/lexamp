// src/app/auth/firm/page.tsx
"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { signIn } from 'next-auth/react'

export default function FirmRegisterPage() {
  const [isLogin, setIsLogin] = useState(false)
  const [formData, setFormData] = useState({
    firmName: '',
    email: '',
    password: '',
    confirmPassword: '',
    licenseNumber: '',
    jurisdictions: [] as string[],
    specializations: [] as string[]
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const router = useRouter()

  const [specializations, setSpecializations] = useState([
    'Criminal Law', 'Family Law', 'Personal Injury', 'Real Estate Law', 
    'Corporate Law', 'Immigration Law', 'Intellectual Property', 'Tax Law',
    'Employment Law', 'Estate Planning', 'Bankruptcy', 'Environmental Law'
  ])

  const [jurisdictions, setJurisdictions] = useState([
    'California', 'New York', 'Texas', 'Florida', 'Illinois', 
    'Pennsylvania', 'Ohio', 'Georgia', 'Michigan', 'North Carolina',
    'New Jersey', 'Virginia', 'Washington', 'Massachusetts', 'Federal'
  ])

  // Fetch specializations and jurisdictions from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [specializationsRes, jurisdictionsRes] = await Promise.all([
          fetch('/api/specializations'),
          fetch('/api/jurisdictions')
        ])

        if (specializationsRes.ok) {
          const data = await specializationsRes.json()
          setSpecializations(data.map((s: any) => s.name))
        }

        if (jurisdictionsRes.ok) {
          const data = await jurisdictionsRes.json()
          setJurisdictions(data.map((j: any) => j.name))
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        // Continue with default data if fetch fails
      }
    }

    fetchData()
  }, [])

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
    setError('')
    setSuccess('')
    setIsLoading(true)
    
    if (step === 1) {
      // Validate first step
      if (!formData.email || !formData.password) {
        setError('Email and password are required')
        setIsLoading(false)
        return
      }
      
      if (!isLogin && formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        setIsLoading(false)
        return
      }
      
      if (isLogin) {
        // Handle login logic here
        try {
          const result = await signIn('credentials', {
            redirect: false,
            email: formData.email,
            password: formData.password,
          })
          
          if (result?.error) {
            setError(result.error || 'Invalid login credentials')
            setIsLoading(false)
            return
          }
          
          router.push('/firm-dashboard')
        } catch (err) {
          setError('Invalid login credentials')
          setIsLoading(false)
        }
      } else {
        // Move to second step for registration
        setStep(2)
        setIsLoading(false)
      }
    } else if (step === 2) {
      // Validate second step
      if (!formData.firmName || !formData.licenseNumber) {
        setError('Firm name and license number are required')
        setIsLoading(false)
        return
      }
      
      if (formData.jurisdictions.length === 0) {
        setError('Please select at least one jurisdiction')
        setIsLoading(false)
        return
      }
      
      if (formData.specializations.length === 0) {
        setError('Please select at least one specialization')
        setIsLoading(false)
        return
      }
      
      // Submit registration
      try {
        const response = await fetch('/api/auth/register-firm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
        
        const data = await response.json()
        
        if (!response.ok) {
          setError(data.error || 'Failed to register. Please try again.')
          setIsLoading(false)
          return
        }
        
        setSuccess('Registration successful! Redirecting to login...')
        
        // Auto login after successful registration
        setTimeout(async () => {
          const result = await signIn('credentials', {
            redirect: false,
            email: formData.email,
            password: formData.password,
          })
          
          if (result?.error) {
            setError(result.error || 'Login failed after registration')
            setIsLoading(false)
            return
          }
          
          router.push('/firm-dashboard')
        }, 2000)
      } catch (err) {
        setError('Failed to register. Please try again.')
        setIsLoading(false)
      }
    }
  }

  // Animation variants for form transition
  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <motion.div 
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
              setSuccess('')
            }}
          >
            {isLogin ? 'Register here' : 'Sign in'}
          </button>
        </p>
      </motion.div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <motion.div 
              className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {error}
            </motion.div>
          )}
          
          {success && (
            <motion.div 
              className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {success}
            </motion.div>
          )}
          
          <AnimatePresence mode="wait">
            <motion.form 
              key={`form-step-${step}`}
              className="space-y-6" 
              onSubmit={handleSubmit}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
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
                            checked={formData.jurisdictions.includes(jurisdiction)}
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
                            checked={formData.specializations.includes(specialization)}
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
                  <motion.button
                    type="button"
                    onClick={() => setStep(1)}
                    className="mb-4 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back
                  </motion.button>
                )}
                
                <motion.button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    isLogin ? 'Sign in' : step === 1 ? 'Continue' : 'Register'
                  )}
                </motion.button>
              </div>
            </motion.form>
          </AnimatePresence>
          
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
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={isLogin ? "/auth/firm" : "/auth"}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  {isLogin ? 'Register your law firm' : 'Sign in as a client'}
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}