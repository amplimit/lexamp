import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/specializations
export async function GET() {
  try {
    const specializations = await prisma.specialization.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    
    return NextResponse.json(specializations)
  } catch (error) {
    console.error('Error fetching specializations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}