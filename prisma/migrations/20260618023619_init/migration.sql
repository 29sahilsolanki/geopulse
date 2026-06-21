-- CreateEnum
CREATE TYPE "Access" AS ENUM ('DENIED', 'GRANTED');

-- CreateEnum
CREATE TYPE "Department" AS ENUM ('SOFTWARE', 'MEDICAL', 'TECHNICIAN', 'LABORATORY', 'GENERAL');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MANAGER', 'WORKER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "profilePic" TEXT,
    "publicId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "auth0Id" TEXT NOT NULL,
    "phone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'WORKER',
    "department" "Department",
    "access" "Access" NOT NULL DEFAULT 'DENIED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shift" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clockIn" TIMESTAMP(3) NOT NULL,
    "clockOut" TIMESTAMP(3),
    "note" TEXT,
    "locationIn" JSONB NOT NULL,
    "locationOut" JSONB,

    CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocationPerimeter" (
    "id" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "radiusKm" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "LocationPerimeter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_auth0Id_key" ON "User"("auth0Id");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "LocationPerimeter_managerId_key" ON "LocationPerimeter"("managerId");

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationPerimeter" ADD CONSTRAINT "LocationPerimeter_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
