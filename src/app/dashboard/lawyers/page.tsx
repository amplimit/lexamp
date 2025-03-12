"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  MapPin, 
  Calendar, 
  MessageSquare,
  ChevronDown,
  X,
  Filter,
  Loader2,
  Star
} from 'lucide-react'
import React from 'react'

// Types
interface Lawyer {
  id: string;
  name: string;
  photoUrl: string | null;
  specialty?: string;
  specializations: string[];
  experience?: number;
  location: string;
  rating: number;
  reviews: number;
  reviewCount: number;
  availability: string;
  description?: string;
  bio?: string;
  languages: string[];
  education?: string;
  consultationFee: string | null;
  firm?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export default function LawyersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [expandedLawyerId, setExpandedLawyerId] = useState<string | null>(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasMore: false
  })
  
  // Data fetching state
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lawyers, setLawyers] = useState<Lawyer[]>([])
  const [specialties, setSpecialties] = useState<string[]>([])
  
  // Fetch specializations on component mount
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await fetch('/api/specializations')
        if (response.ok) {
          const data = await response.json()
          setSpecialties(data.map((s: any) => s.name))
        } else {
          console.error('Failed to fetch specializations')
        }
      } catch (error) {
        console.error('Error fetching specializations:', error)
      }
    }
    
    fetchSpecializations()
  }, [])
  
  // Fetch lawyers whenever filters change
  useEffect(() => {
    const fetchLawyers = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Build query string
        const searchParams = new URLSearchParams()
        if (searchQuery) {
          searchParams.append('search', searchQuery)
        }
        if (selectedSpecialties.length === 1) {
          searchParams.append('specialization', selectedSpecialties[0])
        }
        searchParams.append('page', currentPage.toString())
        searchParams.append('limit', '10')
        
        const response = await fetch(`/api/lawyers?${searchParams.toString()}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch lawyers')
        }
        
        const data = await response.json()
        setLawyers(data.lawyers)
        setPagination(data.pagination)
      } catch (error) {
        console.error('Error fetching lawyers:', error)
        setError('Failed to load lawyers. Please try again.')
        
        // Use mock data for fallback
        setLawyers(generateMockLawyers())
      } finally {
        setIsLoading(false)
      }
    }
    
    // Add a slight delay to avoid too many requests during typing
    const timeoutId = setTimeout(() => {
      fetchLawyers()
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }, [searchQuery, selectedSpecialties, currentPage])
  
  // Function to generate mock lawyers data for fallback
  const generateMockLawyers = (): Lawyer[] => {
    return [
      { 
        id: "1", 
        name: 'Jennifer Wilson', 
        photoUrl: null,
        specializations: ['Family Law'],
        location: 'New York, NY',
        experience: 15,
        rating: 4.9, 
        reviewCount: 124,
        reviews: 124,
        availability: 'Available in 2 days',
        bio: 'Specializing in divorce, child custody, and family disputes with a compassionate approach focused on minimizing conflict.',
        languages: ['English', 'Spanish'],
        education: 'J.D. from Columbia Law School',
        consultationFee: '$150',
        firm: 'Wilson Family Law'
      },
      { 
        id: "2", 
        name: 'Michael Chen', 
        photoUrl: null,
        specializations: ['Real Estate Law'],
        location: 'San Francisco, CA',
        experience: 8,
        rating: 4.8, 
        reviewCount: 98,
        reviews: 98,
        availability: 'Available tomorrow',
        bio: 'Experienced in residential and commercial real estate transactions, leases, and property disputes.',
        languages: ['English', 'Mandarin'],
        education: 'J.D. from Stanford Law School',
        consultationFee: '$175',
        firm: 'Chen Legal Group'
      },
    ]
  }

  const toggleSpecialty = (specialty: string) => {
    if (selectedSpecialties.includes(specialty)) {
      setSelectedSpecialties(selectedSpecialties.filter(s => s !== specialty))
    } else {
      setSelectedSpecialties([...selectedSpecialties, specialty])
    }
    // Reset to first page when filters change
    setCurrentPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Animation variants
  const lawyerCardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  }

  return (
    <motion.div 
      className="p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Find a Lawyer</h1>
        <p className="text-gray-600 mt-1">Connect with qualified legal professionals specialized in your needs</p>
      </div>
      
      {/* Search and filter */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search by name, specialty, or location"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            className="md:w-auto"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        
        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              className="mt-4 p-4 bg-gray-50 rounded-lg border"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Practice Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {specialties.map(specialty => (
                    <motion.button
                      key={specialty}
                      onClick={() => toggleSpecialty(specialty)}
                      className={`text-xs px-3 py-1 rounded-full ${
                        selectedSpecialties.includes(specialty)
                          ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {specialty}
                    </motion.button>
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <motion.button
                  onClick={() => setSelectedSpecialties([])}
                  className="text-sm text-gray-500 hover:text-gray-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear filters
                </motion.button>
                <motion.button
                  onClick={() => setShowFilters(false)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Apply
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Selected filters */}
      <AnimatePresence>
        {selectedSpecialties.length > 0 && (
          <motion.div 
            className="mb-6 flex flex-wrap gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {selectedSpecialties.map(specialty => (
              <motion.div 
                key={specialty} 
                className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                layout
              >
                {specialty}
                <button
                  onClick={() => toggleSpecialty(specialty)}
                  className="ml-1 text-blue-400 hover:text-blue-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            ))}
            <motion.button
              onClick={() => setSelectedSpecialties([])}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear all
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          <span className="ml-2 text-lg text-gray-600">Loading lawyers...</span>
        </div>
      )}
      
      {/* Error state */}
      {error && !isLoading && (
        <div className="text-center py-8 bg-red-50 rounded-lg border border-red-100">
          <X className="h-10 w-10 text-red-400 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-red-800 mb-1">{error}</h3>
          <p className="text-red-600 mb-4">Please try again or contact support if the problem persists.</p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-red-200 text-red-700 hover:bg-red-50"
          >
            Retry
          </Button>
        </div>
      )}
      
      {/* Results */}
      {!isLoading && !error && (
        <>
          {lawyers.length > 0 ? (
            <div className="space-y-6">
              <AnimatePresence>
                {lawyers.map((lawyer, index) => (
                  <motion.div 
                    key={lawyer.id}
                    custom={index}
                    variants={lawyerCardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row">
                          {/* Avatar */}
                          <div className="md:flex-shrink-0 flex justify-center md:justify-start mb-4 md:mb-0">
                            <motion.div 
                              className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.2 }}
                            >
                              {lawyer.photoUrl ? (
                                <img 
                                  src={lawyer.photoUrl} 
                                  alt={lawyer.name} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-2xl font-bold text-gray-600">{lawyer.name.charAt(0)}</span>
                              )}
                            </motion.div>
                          </div>
                          
                          {/* Info */}
                          <div className="md:ml-6 flex-grow">
                            <div className="flex flex-col md:flex-row md:justify-between">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900">{lawyer.name}</h3>
                                <div className="mt-1 text-sm text-gray-500 space-y-1">
                                  <div className="flex items-center flex-wrap gap-2">
                                    {lawyer.specializations.map(specialization => (
                                      <span key={specialization} className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                                        {specialization}
                                      </span>
                                    ))}
                                    <span className="mx-2">•</span>
                                    <span>{lawyer.experience ? `${lawyer.experience} years experience` : 'Professional Attorney'}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                                    <span>{lawyer.location || 'Location not specified'}</span>
                                    {lawyer.firm && (
                                      <>
                                        <span className="mx-2">•</span>
                                        <span>{lawyer.firm}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-3 md:mt-0 text-right">
                                <div className="flex items-center md:justify-end">
                                  <div className="flex">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`h-4 w-4 ${i < Math.floor(lawyer.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} 
                                      />
                                    ))}
                                  </div>
                                  <span className="ml-1 text-sm text-gray-600">{lawyer.rating}</span>
                                  <span className="ml-1 text-xs text-gray-500">({lawyer.reviewCount})</span>
                                </div>
                                <p className="mt-1 text-sm text-green-600">{lawyer.availability}</p>
                              </div>
                            </div>
                            
                            <p className="mt-3 text-gray-600">{lawyer.bio || lawyer.description}</p>
                            
                            {/* Languages */}
                            <div className="mt-3 flex flex-wrap gap-2">
                              {lawyer.languages.map(language => (
                                <span key={language} className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                                  {language}
                                </span>
                              ))}
                            </div>
                            
                            {/* Expanded details */}
                            <AnimatePresence>
                              {expandedLawyerId === lawyer.id && (
                                <motion.div 
                                  className="mt-4 pt-4 border-t border-gray-100"
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-900">Education</h4>
                                      <p className="text-sm text-gray-600">{lawyer.education || 'Not specified'}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-900">Consultation Fee</h4>
                                      <p className="text-sm text-gray-600">{lawyer.consultationFee || 'Contact for details'}</p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                            
                            <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                              <motion.button
                                className="text-sm text-blue-600 hover:text-blue-800 mb-2 sm:mb-0"
                                onClick={() => setExpandedLawyerId(expandedLawyerId === lawyer.id ? null : lawyer.id)}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                              >
                                {expandedLawyerId === lawyer.id ? 'Less details' : 'More details'}
                              </motion.button>
                              
                              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                  <Button variant="outline" className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Book Consultation
                                  </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                  <Button 
                                    className="flex items-center bg-blue-900 hover:bg-blue-800"
                                    onClick={() => router.push(`/dashboard/lawyers/${lawyer.id}`)}
                                  >
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    View Profile
                                  </Button>
                                </motion.div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                        .filter(page => 
                          page === 1 || 
                          page === pagination.totalPages || 
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        )
                        .map((page, index, array) => (
                          <React.Fragment key={page}>
                            {index > 0 && array[index - 1] !== page - 1 && (
                              <span className="text-gray-500">...</span>
                            )}
                            <Button
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                              className={currentPage === page ? "bg-blue-900" : ""}
                            >
                              {page}
                            </Button>
                          </React.Fragment>
                        ))
                      }
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasMore}
                    >
                      Next
                    </Button>
                  </nav>
                </div>
              )}
            </div>
          ) : (
            <motion.div 
              className="text-center py-12 bg-white rounded-lg border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No lawyers found</h3>
              <p className="mt-2 text-gray-500">Try adjusting your search or filters to find more results.</p>
              {(searchQuery || selectedSpecialties.length > 0) && (
                <motion.button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedSpecialties([])
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-800"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear all filters
                </motion.button>
              )}
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  )
}