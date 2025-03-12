// src/app/api/auth/register-firm/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { 
      email, 
      password, 
      firmName, 
      licenseNumber, 
      jurisdictions, 
      specializations 
    } = body

    console.log('Register firm attempt:', { email, firmName }) // Log for debugging

    if (!email || !password || !firmName || !licenseNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if firm already exists
    const existingFirm = await prisma.lawFirm.findUnique({
      where: { email }
    })

    if (existingFirm) {
      return NextResponse.json(
        { error: 'Law firm already exists with this email' },
        { status: 400 }
      )
    }

    // Check if jurisdictions and specializations exist
    for (const jurisdiction of jurisdictions) {
      const jurisdictionExists = await prisma.jurisdiction.findUnique({
        where: { name: jurisdiction }
      });
      
      if (!jurisdictionExists) {
        // Create the jurisdiction if it doesn't exist
        await prisma.jurisdiction.create({
          data: { name: jurisdiction }
        });
      }
    }
    
    for (const specialization of specializations) {
      const specializationExists = await prisma.specialization.findUnique({
        where: { name: specialization }
      });
      
      if (!specializationExists) {
        // Create the specialization if it doesn't exist
        await prisma.specialization.create({
          data: { name: specialization }
        });
      }
    }

    // Hash password for admin user account
    const hashedPassword = await bcrypt.hash(password, 10)

    // Transaction to create everything
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the law firm
      const newFirm = await tx.lawFirm.create({
        data: {
          name: firmName,
          email: email,
          licenseNumber: licenseNumber,
        }
      })

      // 2. Create a user account for the law firm admin
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name: firmName,
          type: 'firm_admin',
        }
      })

      // 3. Add jurisdictions
      for (const jurisdictionName of jurisdictions) {
        const jurisdiction = await tx.jurisdiction.findUnique({
          where: { name: jurisdictionName }
        })

        if (jurisdiction) {
          await tx.firmJurisdiction.create({
            data: {
              firmId: newFirm.id,
              jurisdictionId: jurisdiction.id
            }
          })
        }
      }

      // 4. Add specializations
      for (const specializationName of specializations) {
        const specialization = await tx.specialization.findUnique({
          where: { name: specializationName }
        })

        if (specialization) {
          await tx.firmSpecialization.create({
            data: {
              firmId: newFirm.id,
              specializationId: specialization.id
            }
          })
        }
      }

      return { firm: newFirm, user: newUser }
    })

    console.log('Law firm created successfully:', { email: result.firm.email }) // Log for debugging

    return NextResponse.json(
      { 
        message: 'Law firm registered successfully',
        firmId: result.firm.id 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error) // Log for debugging
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}