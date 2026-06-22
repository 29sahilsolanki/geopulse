import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

export async function GET(req) {
  try {
    const session = await auth0.getSession();
    const user = session?.user;

    if (!user || !user.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized, You need to login first..!!",
        },
        { status: 401 },
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser || dbUser.role !== "MANAGER") {
      return NextResponse.json(
        {
          success: false,
          message: "Access Denied! Only managers can access this endpoint.",
        },
        { status: 403 },
      );
    }

    const workers = await prisma.user.findMany({
      where: { role: "WORKER" },
      include: {
        shifts: {
          orderBy: {
            clockIn: "desc",
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Workers detail found..!!",
      workers,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error..!!",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
