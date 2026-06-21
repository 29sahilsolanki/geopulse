import { auth0 } from "@/lib/auth0";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import ManagerNav from "../../components/manager/ManagerNav";

export default async function ManagerLayout({ children }) {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user || !user.email) {
    redirect("/auth/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    select: { role: true },
  });

  if (!dbUser) {
    redirect("/auth/login");
  }

  if (dbUser.role !== "MANAGER") {
    if (dbUser.role === "WORKER") {
      redirect("/worker");
    }
    redirect("/unauthorized");
  }

  return (
    <div className="w-full min-h-screen bg-slate-50/50 flex flex-col text-slate-900 antialiased">
      {/* Global Manager Navigation Bar */}
      <ManagerNav />

      {/* Manager Deck Canvas Area (Analytics, Team Approval, Logs, etc.) */}
      <main className="flex-1 flex flex-col items-center justify-start py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
