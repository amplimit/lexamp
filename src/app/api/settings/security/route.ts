import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { currentPassword, newPassword, twoFactorEnabled } = body

    // First, find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { settings: true },
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    interface SecurityUpdateData {
      settings: {
        upsert: {
          create: {
            twoFactorEnabled: boolean;
          };
          update: {
            twoFactorEnabled: boolean;
          };
        };
      };
      password?: string;
    }

    const updateData: SecurityUpdateData = {
      settings: {
        upsert: {
          create: {
            twoFactorEnabled: twoFactorEnabled ?? user.settings?.twoFactorEnabled ?? false,
          },
          update: {
            twoFactorEnabled: twoFactorEnabled ?? user.settings?.twoFactorEnabled ?? false,
          },
        },
      },
    }

    // If changing password
    if (currentPassword && newPassword) {
      // Verify current password
      const isValid = await bcrypt.compare(currentPassword, user.password)
      if (!isValid) {
        return new NextResponse("Invalid current password", { status: 400 })
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      updateData.password = hashedPassword
    }

    // Update user settings
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
      include: {
        settings: true,
      },
    })

    return NextResponse.json({
      success: true,
      twoFactorEnabled: updatedUser.settings?.twoFactorEnabled,
    })
  } catch (error) {
    if (error instanceof Error) {
      console.error("[SETTINGS_SECURITY_PATCH]", error.message)
    }
    return new NextResponse("Internal error", { status: 500 })
  }
}
