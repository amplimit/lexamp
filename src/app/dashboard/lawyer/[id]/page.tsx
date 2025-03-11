"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock data - in a real app this would come from an API
const mockLawyers = [
  { 
    id: "1", 
    name: 'Jennifer Wilson', 
    photoUrl: '/avatar1.jpg',
    specialty: 'Family Law', 
    location: 'New York, NY',
    experience: '15 years',
    rating: 4.9, 
    reviews: 124,
    availability: 'Available in 2 days',
    description: 'Specializing in divorce, child custody, and family disputes with a compassionate approach focused on minimizing conflict.',
    longDescription: `I have been practicing family law for over 15 years, focusing on helping clients navigate emotionally challenging situations with empathy and expertise. My practice encompasses all aspects of family law including divorce, child custody, child support, spousal support, and property division.

I believe in finding constructive solutions that minimize conflict and protect the well-being of children. My approach emphasizes mediation and collaborative law whenever possible, but I'm also an experienced litigator when settlement isn't feasible.

Each family situation is unique, and I take the time to understand your specific circumstances and goals before developing a tailored legal strategy.`,
    languages: ['English', 'Spanish'],
    education: 'J.D. from Columbia Law School',
    consultationFee: '$150',
    expertise: [
      'Divorce Proceedings',
      'Child Custody Arrangements',
      'Spousal Support',
      'Property Division',
      'Prenuptial Agreements',
      'Domestic Violence Protection'
    ],
    barAssociations: [
      'New York State Bar Association',
      'American Bar Association'
    ],
    successCases: [
      'Successfully negotiated a complex custody arrangement involving international relocation',
      'Secured favorable property division in high-asset divorce case',
      'Obtained protective orders for clients in domestic violence situations'
    ],
    availableTimeSlots: [
      { date: '2025-03-12', slots: ['10:00 AM', '2:00 PM', '4:00 PM'] },
      { date: '2025-03-13', slots: ['9:00 AM', '11:00 AM', '3:00 PM'] },
      { date: '2025-03-14', slots: ['1:00 PM', '3:00 PM', '5:00 PM'] }
    ]
  },
  // Other lawyers would be here
];

// 使用特定类型而不是any
interface PageParams {
  params: {
    id: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Page({ params }: any) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  
  // Find the lawyer with the matching ID
  const lawyer = mockLawyers.find(l => l.id === params.id)
  
  // Handle case where lawyer is not found
  if (!lawyer) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Lawyer Not Found</h1>
        <p className="text-gray-600 mb-6">The lawyer you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Button onClick={() => router.push('/dashboard/lawyers')}>
          Back to Lawyers
        </Button>
      </div>
    )
  }

  // Format dates for the availability calendar
  const formattedDates = lawyer.availableTimeSlots.map(slot => {
    const date = new Date(slot.date)
    return {
      ...slot,
      formattedDate: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      })
    }
  })

  return (
    <div className="p-6">
      {/* Back button */}
      <button 
        onClick={() => router.push('/dashboard/lawyers')}
        className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to all lawyers
      </button>
      
      {/* Lawyer profile header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex flex-col md:flex-row">
          {/* Avatar */}
          <div className="md:flex-shrink-0 flex justify-center md:justify-start mb-4 md:mb-0">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-600">{lawyer.name.charAt(0)}</span>
            </div>
          </div>
          
          {/* Basic info */}
          <div className="md:ml-6 flex-grow">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{lawyer.name}</h1>
                <div className="mt-2 text-gray-600 space-y-1">
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">{lawyer.specialty}</span>
                    <span className="mx-2">•</span>
                    <span>{lawyer.experience} experience</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{lawyer.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 text-gray-400 mr-2" />
                    <div className="flex flex-wrap gap-1">
                      {lawyer.languages.map(language => (
                        <span key={language} className="text-gray-600">{language}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 md:text-right">
                <div className="flex items-center md:justify-end">
                  <Star className="h-5 w-5 text-amber-400 mr-1" />
                  <span className="text-xl font-bold text-gray-900">{lawyer.rating}</span>
                  <span className="ml-1 text-gray-500">({lawyer.reviews} reviews)</span>
                </div>
                <p className="mt-1 text-green-600 font-medium">{lawyer.availability}</p>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="mt-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Button className="bg-blue-900 hover:bg-blue-800">
                <Calendar className="h-4 w-4 mr-2" />
                Book Consultation
              </Button>
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Message
              </Button>
            </div>
          </div>
        </div>
      </div>
      
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About {lawyer.name}</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{lawyer.longDescription}</p>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Education</h3>
                <div className="flex items-start">
                  <Award className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <span>{lawyer.education}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Bar Associations</h3>
                <ul className="space-y-2">
                  {lawyer.barAssociations.map((association, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>{association}</span>
                    </li>
                  ))}
                </ul>
                
                <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Success Stories</h3>
                <ul className="space-y-2">
                  {lawyer.successCases.map((successCase, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>{successCase}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
            
            <div>
              <Card className="p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultation Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <DollarSign className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Consultation Fee</p>
                      <p className="text-gray-600">{lawyer.consultationFee} per hour</p>
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
            </div>
          </div>
        </TabsContent>
        
        {/* Expertise tab */}
        <TabsContent value="expertise">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Areas of Expertise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lawyer.expertise.map((area, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">{area}</h3>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
        
        {/* Schedule consultation tab */}
        <TabsContent value="schedule">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Schedule a Consultation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Select a Date</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {formattedDates.map(slot => (
                    <div 
                      key={slot.date}
                      onClick={() => setSelectedDate(slot.date)}
                      className={`p-3 border rounded-lg text-center cursor-pointer transition-colors ${
                        selectedDate === slot.date
                          ? 'bg-blue-50 border-blue-300'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium">{slot.formattedDate}</div>
                    </div>
                  ))}
                </div>
                
                {selectedDate && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Select a Time</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {lawyer.availableTimeSlots
                        .find(slot => slot.date === selectedDate)?.slots
                        .map(time => (
                          <div 
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`p-3 border rounded-lg text-center cursor-pointer transition-colors ${
                              selectedTime === time
                                ? 'bg-blue-50 border-blue-300'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="font-medium">{time}</div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )}
              </div>
              
              <div className="border-t pt-6 md:border-t-0 md:border-l md:pl-6 md:pt-0">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Consultation Details</h3>
                
                <div className="mb-6 space-y-4">
                  <div className="flex items-start">
                    <DollarSign className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Consultation Fee</p>
                      <p className="text-gray-600">{lawyer.consultationFee} for 60 minutes</p>
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
                
                <div className="p-4 bg-blue-50 rounded-lg mb-6">
                  <h4 className="font-medium text-blue-900">Selected Time</h4>
                  {selectedDate && selectedTime ? (
                    <p className="text-blue-700">
                      {new Date(selectedDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })} at {selectedTime}
                    </p>
                  ) : (
                    <p className="text-blue-700">Please select a date and time</p>
                  )}
                </div>
                
                <Button 
                  className="w-full bg-blue-900 hover:bg-blue-800"
                  disabled={!selectedDate || !selectedTime}
                >
                  Confirm Booking
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        {/* Reviews tab */}
        <TabsContent value="reviews">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Client Reviews</h2>
              <div className="flex items-center">
                <Star className="h-5 w-5 text-amber-400 mr-1" />
                <span className="text-xl font-bold text-gray-900">{lawyer.rating}</span>
                <span className="ml-1 text-gray-500">({lawyer.reviews} reviews)</span>
              </div>
            </div>
            
            {/* Sample reviews - in a real app these would come from the API */}
            <div className="space-y-6">
              <div className="border-b pb-6">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <span className="font-medium text-blue-800">JD</span>
                    </div>
                    <div>
                      <div className="font-medium">John D.</div>
                      <div className="text-sm text-gray-500">2 months ago</div>
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < 5 ? 'text-amber-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">
                  Jennifer was fantastic throughout my divorce proceedings. She was compassionate, 
                  thorough, and always kept me informed. I particularly appreciated her focus on 
                  what was best for my children.
                </p>
              </div>
              
              <div className="border-b pb-6">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <span className="font-medium text-green-800">ML</span>
                    </div>
                    <div>
                      <div className="font-medium">Maria L.</div>
                      <div className="text-sm text-gray-500">4 months ago</div>
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < 5 ? 'text-amber-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">
                  I hired Jennifer for a complex custody case. Her knowledge of family law was impressive, 
                  and she guided me through every step of the process. She&apos;s an excellent communicator 
                  and truly cares about her clients.
                </p>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <span className="font-medium text-purple-800">RT</span>
                    </div>
                    <div>
                      <div className="font-medium">Robert T.</div>
                      <div className="text-sm text-gray-500">6 months ago</div>
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < 4 ? 'text-amber-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">
                  I needed assistance with a prenuptial agreement. Jennifer provided excellent advice 
                  and made the process much less awkward than I expected. She was professional, efficient, 
                  and fair with her billing.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}