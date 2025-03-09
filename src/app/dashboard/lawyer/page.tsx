"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  MapPin, 
  Calendar, 
  MessageSquare,
  ChevronDown,
  X,
  Filter
} from 'lucide-react'

// Mock data
const mockLawyers = [
  { 
    id: 1, 
    name: 'Jennifer Wilson', 
    photoUrl: '/avatar1.jpg',
    specialty: 'Family Law', 
    location: 'New York, NY',
    experience: '15 years',
    rating: 4.9, 
    reviews: 124,
    availability: 'Available in 2 days',
    description: 'Specializing in divorce, child custody, and family disputes with a compassionate approach focused on minimizing conflict.',
    languages: ['English', 'Spanish'],
    education: 'J.D. from Columbia Law School',
    consultationFee: '$150'
  },
  { 
    id: 2, 
    name: 'Michael Chen', 
    photoUrl: '/avatar2.jpg',
    specialty: 'Real Estate Law', 
    location: 'San Francisco, CA',
    experience: '8 years',
    rating: 4.8, 
    reviews: 98,
    availability: 'Available tomorrow',
    description: 'Experienced in residential and commercial real estate transactions, leases, and property disputes.',
    languages: ['English', 'Mandarin'],
    education: 'J.D. from Stanford Law School',
    consultationFee: '$175'
  },
  { 
    id: 3, 
    name: 'Sarah Johnson', 
    photoUrl: '/avatar3.jpg',
    specialty: 'Corporate Law', 
    location: 'Chicago, IL',
    experience: '12 years',
    rating: 4.7, 
    reviews: 87,
    availability: 'Available next week',
    description: 'Providing guidance on business formation, contracts, mergers and acquisitions, and compliance matters.',
    languages: ['English'],
    education: 'J.D. from University of Chicago Law School',
    consultationFee: '$200'
  },
  { 
    id: 4, 
    name: 'David Rodriguez', 
    photoUrl: '/avatar4.jpg',
    specialty: 'Immigration Law', 
    location: 'Miami, FL',
    experience: '10 years',
    rating: 4.9, 
    reviews: 112,
    availability: 'Available in 3 days',
    description: 'Helping individuals and families navigate the complex immigration system, visa applications, and citizenship process.',
    languages: ['English', 'Spanish', 'Portuguese'],
    education: 'J.D. from University of Miami School of Law',
    consultationFee: '$160'
  },
  { 
    id: 5, 
    name: 'Amanda Taylor', 
    photoUrl: '/avatar5.jpg',
    specialty: 'Personal Injury', 
    location: 'Los Angeles, CA',
    experience: '9 years',
    rating: 4.6, 
    reviews: 76,
    availability: 'Available tomorrow',
    description: 'Dedicated to getting clients fair compensation for injuries resulting from accidents, malpractice, and negligence.',
    languages: ['English'],
    education: 'J.D. from UCLA School of Law',
    consultationFee: '$180'
  },
];

const specialties = [
  'Family Law',
  'Real Estate Law',
  'Corporate Law',
  'Immigration Law',
  'Personal Injury',
  'Criminal Defense',
  'Intellectual Property',
  'Tax Law',
  'Employment Law'
];

export default function LawyersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [expandedLawyerId, setExpandedLawyerId] = useState<number | null>(null)

  const toggleSpecialty = (specialty: string) => {
    if (selectedSpecialties.includes(specialty)) {
      setSelectedSpecialties(selectedSpecialties.filter(s => s !== specialty))
    } else {
      setSelectedSpecialties([...selectedSpecialties, specialty])
    }
  }

  const filteredLawyers = mockLawyers.filter(lawyer => {
    const matchesSearch = 
      lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      lawyer.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesSpecialty = 
      selectedSpecialties.length === 0 || 
      selectedSpecialties.includes(lawyer.specialty)
    
    return matchesSearch && matchesSpecialty
  })

  return (
    <div className="p-6">
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
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Practice Areas</h3>
              <div className="flex flex-wrap gap-2">
                {specialties.map(specialty => (
                  <button
                    key={specialty}
                    onClick={() => toggleSpecialty(specialty)}
                    className={`text-xs px-3 py-1 rounded-full ${
                      selectedSpecialties.includes(specialty)
                        ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setSelectedSpecialties([])}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear filters
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Selected filters */}
      {selectedSpecialties.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {selectedSpecialties.map(specialty => (
            <div key={specialty} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center">
              {specialty}
              <button
                onClick={() => toggleSpecialty(specialty)}
                className="ml-1 text-blue-400 hover:text-blue-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <button
            onClick={() => setSelectedSpecialties([])}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
          >
            Clear all
          </button>
        </div>
      )}
      
      {/* Results */}
      {filteredLawyers.length > 0 ? (
        <div className="space-y-6">
          {filteredLawyers.map(lawyer => (
            <Card key={lawyer.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row">
                  {/* Avatar */}
                  <div className="md:flex-shrink-0 flex justify-center md:justify-start mb-4 md:mb-0">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-600">{lawyer.name.charAt(0)}</span>
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="md:ml-6 flex-grow">
                    <div className="flex flex-col md:flex-row md:justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{lawyer.name}</h3>
                        <div className="mt-1 text-sm text-gray-500 space-y-1">
                          <div className="flex items-center">
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">{lawyer.specialty}</span>
                            <span className="mx-2">•</span>
                            <span>{lawyer.experience} experience</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                            <span>{lawyer.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 md:mt-0 text-right">
                        <div className="flex items-center md:justify-end">
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
                          <span className="ml-1 text-sm text-gray-600">{lawyer.rating}</span>
                          <span className="ml-1 text-xs text-gray-500">({lawyer.reviews})</span>
                        </div>
                        <p className="mt-1 text-sm text-green-600">{lawyer.availability}</p>
                      </div>
                    </div>
                    
                    <p className="mt-3 text-gray-600">{lawyer.description}</p>
                    
                    {/* Languages */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {lawyer.languages.map(language => (
                        <span key={language} className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                          {language}
                        </span>
                      ))}
                    </div>
                    
                    {/* Expanded details */}
                    {expandedLawyerId === lawyer.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Education</h4>
                            <p className="text-sm text-gray-600">{lawyer.education}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Consultation Fee</h4>
                            <p className="text-sm text-gray-600">{lawyer.consultationFee} per hour</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <button
                        className="text-sm text-blue-600 hover:text-blue-800 mb-2 sm:mb-0"
                        onClick={() => setExpandedLawyerId(expandedLawyerId === lawyer.id ? null : lawyer.id)}
                      >
                        {expandedLawyerId === lawyer.id ? 'Less details' : 'More details'}
                      </button>
                      
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <Button variant="outline" className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Consultation
                        </Button>
                        <Button className="flex items-center bg-blue-900 hover:bg-blue-800">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border">
          <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No lawyers found</h3>
          <p className="mt-2 text-gray-500">Try adjusting your search or filters to find more results.</p>
          {(searchQuery || selectedSpecialties.length > 0) && (
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedSpecialties([])
              }}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}