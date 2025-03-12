// src/app/api/lawyers/[id]/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// 修改接口定义以匹配 Next.js 15 的要求
type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/lawyers/[id]
export async function GET(request: Request, context: RouteContext) {
  try {
    // 使用 await 获取 id 参数
    const { id } = await context.params;
    
    const lawyer = await prisma.lawyer.findUnique({
      where: { id },
      include: {
        lawFirm: {
          select: {
            name: true,
            address: true,
            city: true,
            state: true,
            phone: true,
            email: true,
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
            slots: {
              orderBy: {
                startTime: 'asc'
              }
            }
          },
          where: {
            date: {
              gte: new Date()
            }
          },
          orderBy: {
            date: 'asc'
          }
        },
        reviews: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    })
    
    if (!lawyer) {
      return NextResponse.json(
        { error: 'Lawyer not found' },
        { status: 404 }
      )
    }
    
    // Transform data for the response
    const formattedLawyer = {
      id: lawyer.id,
      name: lawyer.name,
      photoUrl: lawyer.photoUrl || null,
      email: lawyer.email,
      title: lawyer.title || null,
      bio: lawyer.bio || null,
      experience: lawyer.experience || null,
      education: lawyer.education || null,
      barNumber: lawyer.barNumber || null,
      consultationFee: lawyer.consultationFee || null,
      rating: lawyer.rating || null,
      reviewCount: lawyer.reviewCount,
      firm: lawyer.lawFirm?.name || null,
      location: lawyer.lawFirm ? 
        `${lawyer.lawFirm.city || ''}, ${lawyer.lawFirm.state || ''}`.trim() : 
        null,
      jurisdictions: lawyer.lawFirm?.jurisdictions.map(j => j.jurisdiction.name) || [],
      specializations: lawyer.specializations.map(s => s.specialization.name),
      languages: lawyer.languages.map(l => l.language.name),
      successCases: [], // This would come from a separate model in a real implementation
      availability: lawyer.availability.map(avail => ({
        date: avail.date,
        formattedDate: avail.date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }),
        slots: avail.slots.map(slot => ({
          id: slot.id,
          startTime: slot.startTime,
          endTime: slot.endTime,
          formattedTime: slot.startTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          isBooked: slot.isBooked
        }))
      })),
      reviews: lawyer.reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        reviewerName: review.reviewerName || 'Anonymous',
        date: review.createdAt,
        formattedDate: review.createdAt.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }))
    }
    
    return NextResponse.json(formattedLawyer)
  } catch (error) {
    console.error('Error fetching lawyer details:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}