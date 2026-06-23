import { auth0 } from "@/lib/auth0";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const body = await req.json();
    const { locationName, latitude, longitude, radius } = body;
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

    if (radius < 100 || radius > 5000) {
      return NextResponse.json(
        {
          success: false,
          message: "Radius must be more that 100mtr and less than 2000mtr..!!",
        },
        { status: 400 },
      );
    }

    const geoFencing = await prisma.locationPerimeter.upsert({
      where: { id: "e431e4a5-e8d2-4f80-a646-5e8b2b328d1b" },
      update: {
        locationName,
        latitude,
        longitude,
        radiusMetre: radius,
      },
      create: {
        managerId: dbUser.id,
        locationName,
        latitude,
        longitude,
        radiusMetre: radius,
      },
    });

    if (!geoFencing) {
      return NextResponse.json(
        {
          success: false,
          message: "Couldn't set geo fencing for workers..!!",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Geo fensing set successfully..!!",
      geoFencing,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Internal server error..!!",
      error: error.message,
    });
  }
}
