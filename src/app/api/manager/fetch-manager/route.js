import { auth0 } from "@/lib/auth0";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const session = await auth0.getSession(req);
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

    const fencingZone = await prisma.locationPerimeter.findFirst();

    if (!fencingZone) {
      return NextResponse.json(
        {
          success: false,
          message: "No active fencing zone found..!!",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Manager details found..!!",
        dbUser,
        locationPerimeter: fencingZone,
      },
      { status: 200 },
    );
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
