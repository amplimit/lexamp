import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { theme, fontSize } = body

    // First, find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { settings: true },
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Update appearance settings
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        settings: {
          upsert: {
            create: {
              theme,
              fontSize,
            },
            update: {
              theme,
              fontSize,
            },
          },
        },
      },
      include: {
        settings: true,
      },
    })

    return NextResponse.json(updatedUser.settings)
  } catch (error) {
    if (error instanceof Error) {
      console.error("[SETTINGS_APPEARANCE_PATCH]", error.message)
    }
    return new NextResponse("Internal error", { status: 500 })
  }
}
