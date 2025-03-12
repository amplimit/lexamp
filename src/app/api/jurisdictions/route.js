// src/app/api/jurisdictions/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/jurisdictions
export async function GET() {
  try {
    const jurisdictions = await prisma.jurisdiction.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    
    return NextResponse.json(jurisdictions)
  } catch (error) {
    console.error('Error fetching jurisdictions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}