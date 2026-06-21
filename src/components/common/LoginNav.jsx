"use client";

import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMapPin } from "react-icons/fi";
export default function LoginNav() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  return (
    <nav className="bg-[#05060A]/95 backdrop-blur-xl border-b border-zinc-900/80 fixed top-0 w-full z-50 text-[#F3F4F6] shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* LEFT SIDE: Brand Identity / App Name */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.08)]">
              <FiMapPin size={20} />
            </div>
            <Link
              href="/"
              className="text-xl font-black tracking-tight text-white group"
            >
              GeoPulse{" "}
              <span className="text-emerald-500 font-medium font-mono text-sm tracking-normal">
                EMS
              </span>
            </Link>
          </div>

          {/* RIGHT SIDE: Action Login Button (Clean & Simple) */}
          <div className="flex items-center gap-4">
            {isLoading ? (
              <span>Loading...</span>
            ) : user ? (
              <button
                onClick={() => router.push("/auth/logout")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all active:scale-95 cursor-pointer"
              >
                {/* Green Pulse Indicator Dot */}
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                {/* Actual Button Text */}
                <span>Logout User</span>
              </button>
            ) : (
              <button
                onClick={() => router.push("/auth/login")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all active:scale-95 cursor-pointer"
              >
                {/* Green Pulse Indicator Dot */}
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {/* Actual Button Text */}
                <span>Login User</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
