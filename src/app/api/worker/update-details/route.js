import { auth0 } from "@/lib/auth0";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await auth0.getSession(req);
    const user = session?.user;

    const body = await req.json();
    const { name, department, phone } = body;

    const dbUser = await prisma.user.findUnique({
      where: {
        email: user?.email,
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

    let updated = {};
    if (name) updated.name = name;
    if (department) updated.department = department;
    if (phone) updated.phone = phone;

    const newUser = await prisma.user.update({
      where: {
        id: dbUser.id,
      },
      data: updated,
    });

    if (!newUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Couldn't update the user..!!",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully..!!",
      user: newUser,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Internal server error...!!",
      error: error.message,
    });
  }
}
