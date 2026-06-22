import { auth0 } from "@/lib/auth0";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const session = await auth0.getSession(req);
    const user = session?.user;

    const formData = await req.formData();
    const image = formData.get("image");

    if (!image) {
      return NextResponse.json(
        { success: false, message: "File missing..!!" },
        { status: 400 },
      );
    }

    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        {
          success: false,
          message: "Access Denied! Only (PNG, JPG, WEBP) Formatte allowed..!!",
        },
        { status: 400 },
      );
    }

    // Converting ArrayBuffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Converting Buffer to Base64
    const base64Image = `data:${image.type};base64,${buffer.toString("base64")}`;

    const dbUser = await prisma.user.findUnique({
      where: { email: user?.email },
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

    if (dbUser.publicId) {
      //clodinary image destroy
      await cloudinary.uploader.destroy(dbUser?.publicId);
    }

    //cloudinary upload
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "geopulse",
      resource_type: "image",
    });

    const updated = await prisma.user.update({
      where: {
        email: user?.email,
      },
      data: {
        profilePic: result?.secure_url,
        publicId: result?.public_id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Profile Image updated successfully..!!",
        updated,
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
