import { auth0 } from "@/lib/auth0";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Haversine formula to calculate distance
function getDistanceInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function POST(req) {
  try {
    const session = await auth0.getSession(req);
    const user = session?.user;

    const body = await req.json();
    const { clockInNote, latitudeIn, longitudeIn, locationName } = body;

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

    // check current radius is valid or not
    const givenRadius = await prisma.locationPerimeter.findUnique({
      where: { id: "e431e4a5-e8d2-4f80-a646-5e8b2b328d1b" },
    });

    if (!givenRadius) {
      return NextResponse.json(
        {
          success: false,
          message: "Geofencing parameters not found in data..!!",
        },
        { status: 404 },
      );
    }

    // calculating distance
    const centerLat = Number(givenRadius.latitude);
    const centerLng = Number(givenRadius.longitude);
    const allowedRadiusInMeters = Number(givenRadius.radiusMetre);

    const distanceCalculated = getDistanceInMeters(
      Number(latitudeIn),
      Number(longitudeIn),
      centerLat,
      centerLng,
    );

    console.log(
      `Worker is at a distance of ${distanceCalculated.toFixed(2)} meters.`,
    );

    const distanceInKm = (distanceCalculated / 1000).toFixed(2);

    if (distanceCalculated > allowedRadiusInMeters) {
      return NextResponse.json(
        {
          success: false,
          message: `Clock-in Failed! You are outside the designated work perimeter. Distance: ${distanceInKm} KM`,
        },
        { status: 400 },
      );
    }

    //saving clockIn data
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
