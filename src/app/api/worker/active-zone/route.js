import { auth0 } from "@/lib/auth0";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const session = await auth0.getSession(req);
    const user = session?.user;

    if (!user || !user.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in." },
        { status: 401 },
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
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

    const activeLocation = await prisma.locationPerimeter.findFirst();

    if (!activeLocation) {
      return NextResponse.json(
        { success: false, message: "No active location found..!!" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Active location found..!!",
        activeLocation,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error..!!" },
      { status: 500 },
    );
  }
}
