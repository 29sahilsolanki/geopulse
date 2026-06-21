import { auth0 } from "@/lib/auth0";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import WorkerNav from "../../components/worker/WorkerNav";

export default async function WorkerLayout({ children }) {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user || !user.email) {
    redirect("/auth/login");
  }

  let dbUser;

  try {
    dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) {
      console.log(`📡 Creating new user matrix node for: ${user.email}`);
      dbUser = await prisma.user.create({
        data: {
          auth0Id: user.sub || user.user_id,
          email: user.email,
          name: user.name || "Anonymous Worker",
          profilePic: user.picture || "",
          role: "WORKER",
        },
      });
    }
  } catch (error) {
    console.error("❌ Critical server layout database sync failed:", error);
    redirect("/unauthorized");
  }

  if (dbUser.role !== "WORKER") {
    if (dbUser.role === "MANAGER") {
      redirect("/manager");
    }
    redirect("/unauthorized");
  }

  return (
    <div className="w-full min-h-screen bg-slate-50/50 flex flex-col text-slate-900 antialiased">
      {/* Global Worker Navigation Bar */}
      <WorkerNav />

      {/* Dynamic Sub-Pages Canvas Area (Punching, Profile, etc.) */}
      <main className="flex-1 flex flex-col items-center justify-start py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
