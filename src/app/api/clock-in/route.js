import { auth0 } from "@/lib/auth0";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { clockInNote, latitudeIn, longitudeIn, locationName } = body;
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
      where: {
        email: user.email,
      },
    });
    if (!dbUser || dbUser.role !== "WORKER") {
      return NextResponse.json(
        {
          success: false,
          message: "Access Denied! Only workers can access this endpoint.",
        },
        { status: 403 },
      );
    }

    const clockInData = await prisma.shift.create({
      data: {
        userId: dbUser.id,
        clockIn: new Date(),
        latitudeIn: Number(latitudeIn),
        longitudeIn: Number(longitudeIn),
        clockInNote,
        inLocation: locationName,
        status: "CLOCKEDIN",
      },
    });

    if (!clockInData) {
      return NextResponse.json({
        success: false,
        message: "Couldn't mark clock in, Try again..!!",
      });
    }
    return NextResponse.json({
      success: true,
      message: "Clock in marked successfully..!!",
      clockInData,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Internal server error..!!",
      error: error.message,
    });
  }
}
