import { auth0 } from "@/lib/auth0";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const body = await req.json();
    const { locationName, latitude, longitude, radiusKm } = body;
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

    const geoFencing = await prisma.locationPerimeter.upsert({
      where: { managerId: dbUser.id },
      update: {
        locationName,
        latitude,
        longitude,
        radiusKm,
      },
      create: {
        managerId: dbUser.id,
        locationName,
        latitude,
        longitude,
        radiusKm,
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
