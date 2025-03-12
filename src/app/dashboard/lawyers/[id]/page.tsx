// src/app/dashboard/lawyers/[id]/page.tsx
"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  MessageSquare, 
  Star, 
  FileText, 
  Award, 
  Briefcase,
  Clock,
  Globe,
  DollarSign,
  CheckCircle,
  Loader2,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface LawyerDetail {
  id: string;
  name: string;
  photoUrl: string | null;
  email: string;
  title: string | null;
  bio: string | null;
  experience: number | null;
  education: string | null;
  barNumber: string | null;
  consultationFee: string | null;
  rating: number | null;
  reviewCount: number;
  firm: string | null;
  location: string | null;
  jurisdictions: string[];
  specializations: string[];
  languages: string[];
  successCases: string[];
  availability: {
    date: string;
    formattedDate: string;
    slots: {
      id: string;
      startTime: string;
      endTime: string;
      formattedTime: string;
      isBooked: boolean;
    }[];
  }[];
  reviews: {
    id: string;
    rating: number;
    comment: string | null;
    reviewerName: string;
    date: string;
    formattedDate: string;
  }[];
}

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
}

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const listItem = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
}

interface PageParams {
  params: {
    id: string;
  };
}

export default function LawyerDetailPage({ params }: PageParams) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lawyer, setLawyer] = useState<LawyerDetail | null>(null)
  
  // Mock success cases (would come from the database in a real implementation)
  const mockSuccessCases = [
    'Successfully negotiated a complex custody arrangement involving international relocation',
    'Secured favorable property division in high-asset divorce case',
    'Obtained protective orders for clients in domestic violence situations'
  ]
  
  useEffect(() => {
    const fetchLawyerDetails = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/lawyers/${params.id}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Lawyer not found')
          }
          throw new Error('Failed to fetch lawyer details')
        }
        
        const data = await response.json()
        
        // Add mock success cases (this would come from the API in a real implementation)
        data.successCases = mockSuccessCases
        
        setLawyer(data)
      } catch (error) {
        console.error('Error fetching lawyer details:', error)
        setError(error instanceof Error ? error.message : 'Failed to load lawyer details')
        
        // If the API fails, use mock data
        if (params.id === "1") {
          // Example mock data for lawyer with ID 1
          setLawyer(getMockLawyerDetails())
        }
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchLawyerDetails()
  }, [params.id])
  
  // Mock lawyer details for fallback
  const getMockLawyerDetails = (): LawyerDetail => {
    return {
      id: "1",
      name: "Jennifer Wilson",
      photoUrl: null,
      email: "jennifer@example.com",
      title: "Senior Partner",
      bio: "Specializing in divorce, child custody, and family disputes with a compassionate approach focused on minimizing conflict.",
      experience: 15,
      education: "J.D. from Columbia Law School",
      barNumber: "NY123456",
      consultationFee: "$150",
      rating: 4.9,
      reviewCount: 124,
      firm: "Wilson Family Law",
      location: "New York, NY",
      jurisdictions: ["New York", "New Jersey"],
      specializations: ["Family Law", "Divorce", "Child Custody"],
      languages: ["English", "Spanish"],
      successCases: mockSuccessCases,
      availability: [
        {
          date: "2025-03-12",
          formattedDate: "Mar 12, 2025",
          slots: [
            { id: "1", startTime: "2025-03-12T10:00:00", endTime: "2025-03-12T11:00:00", formattedTime: "10:00 AM", isBooked: false },
            { id: "2", startTime: "2025-03-12T14:00:00", endTime: "2025-03-12T15:00:00", formattedTime: "2:00 PM", isBooked: false },
            { id: "3", startTime: "2025-03-12T16:00:00", endTime: "2025-03-12T17:00:00", formattedTime: "4:00 PM", isBooked: false }
          ]
        },
        {
          date: "2025-03-13",
          formattedDate: "Mar 13, 2025",
          slots: [
            { id: "4", startTime: "2025-03-13T09:00:00", endTime: "2025-03-13T10:00:00", formattedTime: "9:00 AM", isBooked: false },
            { id: "5", startTime: "2025-03-13T11:00:00", endTime: "2025-03-13T12:00:00", formattedTime: "11:00 AM", isBooked: false },
            { id: "6", startTime: "2025-03-13T15:00:00", endTime: "2025-03-13T16:00:00", formattedTime: "3:00 PM", isBooked: false }
          ]
        }
      ],
      reviews: [
        {
          id: "1",
          rating: 5,
          comment: "Jennifer was fantastic throughout my divorce proceedings. She was compassionate, thorough, and always kept me informed. I particularly appreciated her focus on what was best for my children.",
          reviewerName: "John D.",
          date: "2025-01-10T14:30:00.000Z",
          formattedDate: "January 10, 2025"
        },
        {
          id: "2",
          rating: 5,
          comment: "I hired Jennifer for a complex custody case. Her knowledge of family law was impressive, and she guided me through every step of the process. She's an excellent communicator and truly cares about her clients.",
          reviewerName: "Maria L.",
          date: "2024-11-15T10:30:00.000Z",
          formattedDate: "November 15, 2024"
        },
        {
          id: "3",
          rating: 4,
          comment: "I needed assistance with a prenuptial agreement. Jennifer provided excellent advice and made the process much less awkward than I expected. She was professional, efficient, and fair with her billing.",
          reviewerName: "Robert T.",
          date: "2024-09-20T16:45:00.000Z",
          formattedDate: "September 20, 2024"
        }
      ]
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900">Loading lawyer profile...</h2>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !lawyer) {
    return (
      <div className="p-6 text-center">
        <div className="max-w-md mx-auto">
          <X className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Lawyer Not Found'}</h1>
          <p className="text-gray-600 mb-6">The lawyer you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push('/dashboard/lawyers')}>
            Back to Lawyers
          </Button>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      className="p-6"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* Back button */}
      <motion.button 
        onClick={() => router.push('/dashboard/lawyers')}
        className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        whileHover={{ x: -2 }}
        whileTap={{ scale: 0.97 }}
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to all lawyers
      </motion.button>
      
      {/* Lawyer profile header */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm border p-6 mb-6"
        variants={fadeIn}
      >
        <div className="flex flex-col md:flex-row">
          {/* Avatar */}
          <motion.div 
            className="md:flex-shrink-0 flex justify-center md:justify-start mb-4 md:mb-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
              {lawyer.photoUrl ? (
                <img src={lawyer.photoUrl} alt={lawyer.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="text-4xl font-bold text-gray-600">{lawyer.name.charAt(0)}</span>
              )}
            </div>
          </motion.div>
          
          {/* Basic info */}
          <div className="md:ml-6 flex-grow">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{lawyer.name}</h1>
                <div className="mt-2 text-gray-600 space-y-1">
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                    <div className="flex flex-wrap gap-2">
                      {lawyer.specializations.map(specialization => (
                        <span key={specialization} className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                          {specialization}
                        </span>
                      ))}
                    </div>
                    <span className="mx-2">•</span>
                    <span>{lawyer.experience ? `${lawyer.experience} years experience` : 'Professional Attorney'}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{lawyer.location || 'Location not specified'}</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 text-gray-400 mr-2" />
                    <div className="flex flex-wrap gap-1">
                      {lawyer.languages.map(language => (
                        <span key={language} className="text-gray-600">{language}</span>
                      )).reduce((prev, curr, i) => (
                        [prev, <span key={`sep-${i}`} className="text-gray-400 mx-1">•</span>, curr] as any
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 md:text-right">
                <div className="flex items-center md:justify-end">
                  <Star className="h-5 w-5 text-amber-400 mr-1" />
                  <span className="text-xl font-bold text-gray-900">{lawyer.rating}</span>
                  <span className="ml-1 text-gray-500">({lawyer.reviewCount} reviews)</span>
                </div>
                {lawyer.availability && lawyer.availability.length > 0 && (
                  <p className="mt-1 text-green-600 font-medium">
                    Available from {new Date(lawyer.availability[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                )}
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="mt-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button className="bg-blue-900 hover:bg-blue-800">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Consultation
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Tabs for different sections */}
      <Tabs defaultValue="about" className="mb-6">
        <TabsList className="mb-6">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="expertise">Expertise</TabsTrigger>
          <TabsTrigger value="schedule">Schedule Consultation</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        {/* About tab */}
        <TabsContent value="about">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="md:col-span-2" variants={listItem}>
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About {lawyer.name}</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{lawyer.bio || 'No bio provided'}</p>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Education</h3>
                <div className="flex items-start">
                  <Award className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <span>{lawyer.education || 'Not specified'}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Bar Associations</h3>
                <motion.ul className="space-y-2" variants={staggerChildren}>
                  {lawyer.jurisdictions.map((jurisdiction, index) => (
                    <motion.li key={index} className="flex items-start" variants={listItem}>
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>{jurisdiction} Bar Association</span>
                    </motion.li>
                  ))}
                </motion.ul>
                
                <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Success Stories</h3>
                <motion.ul className="space-y-2" variants={staggerChildren}>
                  {lawyer.successCases.map((successCase, index) => (
                    <motion.li key={index} className="flex items-start" variants={listItem}>
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>{successCase}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </Card>
            </motion.div>
            
            <motion.div variants={staggerChildren}>
              <motion.div variants={listItem}>
                <Card className="p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultation Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <DollarSign className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Consultation Fee</p>
                        <p className="text-gray-600">{lawyer.consultationFee || 'Contact for details'} per hour</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Typical Response Time</p>
                        <p className="text-gray-600">Within 24 hours</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
              
              <motion.div variants={listItem}>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Languages Spoken</h3>
                  <div className="space-y-2">
                    {lawyer.languages.map(language => (
                      <div key={language} className="flex items-center">
                        <Globe className="h-5 w-5 text-gray-400 mr-2" />
                        <span>{language}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </motion.div>
        </TabsContent>
        
        {/* Expertise tab */}
        <TabsContent value="expertise">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Areas of Expertise</h2>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                variants={staggerChildren}
              >
                {lawyer.specializations.map((area, index) => (
                  <motion.div key={index} className="flex items-start" variants={listItem}>
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900">{area}</h3>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </Card>
          </motion.div>
        </TabsContent>
        
        {/* Schedule consultation tab */}
        <TabsContent value="schedule">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Schedule a Consultation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Select a Date</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {lawyer.availability.map(slot => (
                      <motion.div 
                        key={slot.date}
                        onClick={() => setSelectedDate(slot.date)}
                        className={`p-3 border rounded-lg text-center cursor-pointer transition-colors ${
                          selectedDate === slot.date
                            ? 'bg-blue-50 border-blue-300'
                            : 'hover:bg-gray-50'
                        }`}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <div className="font-medium">{slot.formattedDate}</div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <AnimatePresence>
                    {selectedDate && (
                      <motion.div 
                        className="mt-6"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Select a Time</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {lawyer.availability
                            .find(slot => slot.date === selectedDate)?.slots
                            .map(time => (
                              <motion.div 
                                key={time.id}
                                onClick={() => setSelectedTime(time.id)}
                                className={`p-3 border rounded-lg text-center cursor-pointer transition-colors ${
                                  selectedTime === time.id
                                    ? 'bg-blue-50 border-blue-300'
                                    : time.isBooked
                                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                      : 'hover:bg-gray-50'
                                }`}
                                whileHover={!time.isBooked ? { scale: 1.03 } : {}}
                                whileTap={!time.isBooked ? { scale: 0.97 } : {}}
                              >
                                <div className="font-medium">
                                  {time.formattedTime}
                                  {time.isBooked && <span className="block text-xs text-red-500 mt-1">Booked</span>}
                                </div>
                              </motion.div>
                            ))
                          }
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="border-t pt-6 md:border-t-0 md:border-l md:pl-6 md:pt-0">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Consultation Details</h3>
                  
                  <div className="mb-6 space-y-4">
                    <div className="flex items-start">
                      <DollarSign className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Consultation Fee</p>
                        <p className="text-gray-600">{lawyer.consultationFee || 'Contact for pricing'} for 60 minutes</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">What to Expect</p>
                        <p className="text-gray-600">
                          Initial consultation to understand your legal needs, discuss potential approaches, 
                          and determine next steps.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <motion.div 
                    className="p-4 bg-blue-50 rounded-lg mb-6"
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h4 className="font-medium text-blue-900">Selected Time</h4>
                    {selectedDate && selectedTime ? (
                      <p className="text-blue-700">
                        {new Date(selectedDate).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })} at {
                          lawyer.availability
                            .find(slot => slot.date === selectedDate)?.slots
                            .find(slot => slot.id === selectedTime)?.formattedTime
                        }
                      </p>
                    ) : (
                      <p className="text-blue-700">Please select a date and time</p>
                    )}
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      className="w-full bg-blue-900 hover:bg-blue-800"
                      disabled={!selectedDate || !selectedTime}
                    >
                      Confirm Booking
                    </Button>
                  </motion.div>
                </div>
              </div>
            </Card>
          </motion.div>
        </TabsContent>
        
        {/* Reviews tab */}
        <TabsContent value="reviews">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Client Reviews</h2>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-amber-400 mr-1" />
                  <span className="text-xl font-bold text-gray-900">{lawyer.rating}</span>
                  <span className="ml-1 text-gray-500">({lawyer.reviewCount} reviews)</span>
                </div>
              </div>
              
              {/* Reviews list */}
              <motion.div 
                className="space-y-6"
                variants={staggerChildren}
              >
                {lawyer.reviews.map((review, index) => (
                  <motion.div 
                    key={review.id} 
                    className="border-b pb-6 last:border-b-0 last:pb-0"
                    variants={listItem}
                  >
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <span className="font-medium text-blue-800">{review.reviewerName.substring(0, 2).toUpperCase()}</span>
                        </div>
                        <div>
                          <div className="font-medium">{review.reviewerName}</div>
                          <div className="text-sm text-gray-500">{review.formattedDate}</div>
                        </div>
                      </div>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-5 w-5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">
                      {review.comment}
                    </p>
                  </motion.div>
                ))}
                
                {/* "Leave a review" button */}
                <motion.div 
                  className="pt-6 text-center"
                  variants={listItem}
                >
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button variant="outline">
                      Leave a Review
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}