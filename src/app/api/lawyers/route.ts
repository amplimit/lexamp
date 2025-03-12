// src/app/api/lawyers/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/lawyers
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const search = searchParams.get('search') || ''
    const specialization = searchParams.get('specialization') || ''
    const language = searchParams.get('language') || ''
    const sortBy = searchParams.get('sortBy') || 'rating'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    
    // Build the query filters
    const filters: any = {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
        { 
          lawFirm: { 
            name: { contains: search, mode: 'insensitive' } 
          } 
        }
      ],
    }
    
    // Add specialization filter if provided
    if (specialization) {
      filters.specializations = {
        some: {
          specialization: {
            name: specialization
          }
        }
      }
    }
    
    // Add language filter if provided
    if (language) {
      filters.languages = {
        some: {
          language: {
            name: language
          }
        }
      }
    }
    
    // Determine sort order
    let orderBy: any = {}
    switch (sortBy) {
      case 'rating':
        orderBy = { rating: 'desc' }
        break
      case 'experience':
        orderBy = { experience: 'desc' }
        break
      case 'reviews':
        orderBy = { reviewCount: 'desc' }
        break
      default:
        orderBy = { rating: 'desc' }
    }
    
    // Execute the query
    const [lawyers, total] = await Promise.all([
      prisma.lawyer.findMany({
        where: filters,
        include: {
          lawFirm: {
            select: {
              name: true,
              jurisdictions: {
                include: {
                  jurisdiction: true
                }
              }
            }
          },
          specializations: {
            include: {
              specialization: true
            }
          },
          languages: {
            include: {
              language: true
            }
          },
          availability: {
            include: {
              slots: true
            },
            where: {
              date: {
                gte: new Date()
              }
            },
            orderBy: {
              date: 'asc'
            },
            take: 5
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.lawyer.count({
        where: filters
      })
    ])
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    const hasMore = page < totalPages
    
    // Transform lawyer data for response
    const formattedLawyers = lawyers.map(lawyer => ({
      id: lawyer.id,
      name: lawyer.name,
      photoUrl: lawyer.photoUrl,
      title: lawyer.title,
      experience: lawyer.experience,
      rating: lawyer.rating,
      reviewCount: lawyer.reviewCount,
      consultationFee: lawyer.consultationFee,
      firm: lawyer.lawFirm?.name,
      location: lawyer.lawFirm?.jurisdictions.map(j => j.jurisdiction.name).join(', '),
      specializations: lawyer.specializations.map(s => s.specialization.name),
      languages: lawyer.languages.map(l => l.language.name),
      availability: lawyer.availability.length > 0 ? 
        `Available in ${Math.ceil((lawyer.availability[0].date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days` : 
        'No availability',
      bio: lawyer.bio
    }))
    
    return NextResponse.json({
      lawyers: formattedLawyers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore
      }
    })
  } catch (error) {
    console.error('Error fetching lawyers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}