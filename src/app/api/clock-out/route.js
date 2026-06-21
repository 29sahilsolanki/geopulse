import { auth0 } from "@/lib/auth0";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { clockOutNote, latitudeOut, longitudeOut, locationName } = body;
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

    const activeShift = await prisma.shift.findFirst({
      where: {
        userId: dbUser.id,
        clockOut: null,
      },
      orderBy: {
        clockIn: "desc",
      },
    });

    if (!activeShift) {
      return NextResponse.json(
        {
          success: false,
          message: "No active shift found! You must clock in first.",
        },
        { status: 400 },
      );
    }

    const clockOutData = await prisma.shift.update({
      where: {
        id: activeShift.id,
      },
      data: {
        userId: dbUser.id,

        clockOut: new Date(),
        clockOutNote,
        latitudeOut: Number(latitudeOut),
        longitudeOut: Number(longitudeOut),
        outLocation: locationName,
        status: "CLOCKEDOUT",
      },
    });

    if (!clockOutData) {
      return NextResponse.json({
        success: false,
        message: "Couldn't mark clock out, Try again..!!",
      });
    }
    return NextResponse.json({
      success: true,
      message: "Clock out marked successfully..!!",
      clockOutData,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Internal server error..!!",
      error: error.message,
    });
  }
}
