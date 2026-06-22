import prisma from "@/lib/prisma";
import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";
export async function GET(req) {
  try {
    const session = await auth0.getSession(req);
    const user = session?.user;

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: {
        shifts: {
          orderBy: {
            clockIn: "desc",
          },
        },
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: "User not found in database matrix!" },
        { status: 444 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Shift details found for the user..!!",
      dbUser,
      shiftDetails: dbUser.shifts || [],
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Internal server error..!!",
      error: error.message,
    });
  }
}
