// src/app/api/lawyers/book/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/lib/auth'

// 创建一个新的 Prisma 客户端实例，确保它包含所有模型
const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Get booking details from request body
    const body = await request.json()
    const { lawyerId, slotId, message } = body
    
    if (!lawyerId || !slotId) {
      return NextResponse.json(
        { error: 'Lawyer ID and slot ID are required' },
        { status: 400 }
      )
    }
    
    // Find the slot and check if it's available
    const slot = await prisma.slot.findUnique({
      where: { id: slotId },
      include: {
        availability: {
          include: {
            lawyer: true
          }
        }
      }
    })
    
    if (!slot) {
      return NextResponse.json(
        { error: 'Slot not found' },
        { status: 404 }
      )
    }
    
    if (slot.isBooked) {
      return NextResponse.json(
        { error: 'This slot is already booked' },
        { status: 400 }
      )
    }
    
    // Check if the slot belongs to the specified lawyer
    if (slot.availability.lawyer.id !== lawyerId) {
      return NextResponse.json(
        { error: 'This slot does not belong to the specified lawyer' },
        { status: 400 }
      )
    }
    
    // 使用事务来确保预约的原子性
    const result = await prisma.$transaction(async (tx) => {
      // 标记时间槽为已预约
      const bookedSlot = await tx.slot.update({
        where: { id: slotId },
        data: { isBooked: true }
      })
      
      // 创建预约记录
      const booking = await tx.booking.create({
        data: {
          userId: session.user.id,
          lawyerId: lawyerId,
          slotId: slotId,
          message: message || '',
          status: 'confirmed',
          // 为虚拟会议生成会议链接（在实际应用中可能会使用第三方API）
          meetingLink: `https://meet.lexamp.com/${Math.random().toString(36).substring(2, 15)}`
        }
      })
      
      return { booking, slot: bookedSlot }
    })
    
    // 预约成功，返回相关信息
    return NextResponse.json({
      success: true,
      message: 'Appointment booked successfully',
      bookingId: result.booking.id,
      slotId: slotId,
      startTime: slot.startTime,
      endTime: slot.endTime,
      lawyerId: lawyerId,
      lawyerName: slot.availability.lawyer.name,
      meetingLink: result.booking.meetingLink
    })
  } catch (error) {
    console.error('Error booking appointment:', error)
    
    // 如果错误与时间槽已被预约相关，尝试回滚
    try {
      if (error instanceof Error && error.message.includes('unique constraint')) {
        return NextResponse.json(
          { error: 'This slot has just been booked by someone else' },
          { status: 409 }
        )
      }
    } catch {
      // 如果解析错误失败，继续使用通用错误消息
    }
    
    return NextResponse.json(
      { error: 'Failed to book appointment' },
      { status: 500 }
    )
  }
}