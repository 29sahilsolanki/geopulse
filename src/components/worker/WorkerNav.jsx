"use client";

import { useWorker } from "@/context/WorkerContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  FiWatch,
  FiMapPin,
  FiActivity,
  FiClock,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

export default function WorkerNav() {
  const { userData } = useWorker();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    router.push("/auth/logout");
  };

  return (
    <nav className="bg-[#05060A]/95 backdrop-blur-xl border-b border-zinc-900/80 fixed top-0 w-full z-50 text-[#F3F4F6] shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* LEFT SIDE: Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.08)]">
              <FiMapPin size={20} />
            </div>
            <Link
              href="/worker/dashboard"
              className="text-xl font-black tracking-tight text-white group"
            >
              GeoPulse{" "}
              <span className="text-emerald-500 font-medium font-mono text-sm tracking-normal">
                EMS
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1.5">
            {/* 1. Dashboard Link */}
            <Link
              href="/worker/dashboard"
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition-all duration-300 ${
                pathname === "/worker/dashboard"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "text-zinc-500 hover:text-white border border-transparent hover:bg-zinc-900/50"
              }`}
            >
              <FiActivity size={16} />
              Dashboard
            </Link>

            {/* 2. Clock In/Out Link */}
            <Link
              href="/worker/punch-timings"
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition-all duration-300 ${
                pathname === "/worker/punch-timings"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "text-zinc-500 hover:text-white border border-transparent hover:bg-zinc-900/50"
              }`}
            >
              <FiWatch size={16} />
              Clock In/Out
            </Link>

            {/* 3. Shift History Link */}
            <Link
              href="/worker/shift-history"
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition-all duration-300 ${
                pathname === "/worker/shift-history"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "text-zinc-500 hover:text-white border border-transparent hover:bg-zinc-900/50"
              }`}
            >
              <FiClock size={16} />
              Shift History
            </Link>

            {/* 4. Profile Link */}
            <Link
              href="/worker/profile"
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition-all duration-300 ${
                pathname === "/worker/profile"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "text-zinc-500 hover:text-white border border-transparent hover:bg-zinc-900/50"
              }`}
            >
              <FiUser size={16} />
              Profile
            </Link>
          </div>

          {/* RIGHT SIDE: System Tags & Logout Console */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 bg-zinc-950 border border-emerald-500/20 text-emerald-400 rounded-md shadow-inner">
              {`Hello: ${userData?.name || "Loading..."}`}
            </span>

            <button
              onClick={handleLogout}
              className="p-2.5 bg-zinc-950 border border-zinc-900 hover:border-red-500/30 text-zinc-500 hover:text-red-400 rounded-lg transition-all active:scale-95 cursor-pointer"
            >
              <FiLogOut size={16} />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-500 hover:text-white p-2 cursor-pointer"
            >
              {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE COLLAPSIBLE PANEL (Direct Links) */}
      {isOpen && (
        <div className="md:hidden bg-[#05060A]/98 backdrop-blur-2xl border-b border-zinc-900 px-4 pt-2 pb-6 space-y-2">
          <Link
            href="/worker/dashboard"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm font-bold font-mono uppercase tracking-wide ${
              pathname === "/worker/dashboard"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "text-zinc-500 hover:text-white hover:bg-zinc-900/50"
            }`}
          >
            <FiActivity size={16} /> Dashboard
          </Link>

          <Link
            href="/worker/punch-timings"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm font-bold font-mono uppercase tracking-wide ${
              pathname === "/worker/punch-timings"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "text-zinc-500 hover:text-white hover:bg-zinc-900/50"
            }`}
          >
            <FiWatch size={16} /> Clock In/Out
          </Link>

          <Link
            href="/worker/shift-history"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm font-bold font-mono uppercase tracking-wide ${
              pathname === "/worker/shift-history"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "text-zinc-500 hover:text-white hover:bg-zinc-900/50"
            }`}
          >
            <FiClock size={16} /> Shift History
          </Link>

          <Link
            href="/worker/profile"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm font-bold font-mono uppercase tracking-wide ${
              pathname === "/worker/profile"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "text-zinc-500 hover:text-white hover:bg-zinc-900/50"
            }`}
          >
            <FiUser size={16} /> Profile
          </Link>

          <div className="pt-4 border-t border-zinc-900/60 flex items-center justify-between px-4">
            <span className="text-[9px] font-mono tracking-widest text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/10">
              {`Hello: ${userData.name || "Loading..."}`}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-bold uppercase font-mono text-red-400 tracking-wider hover:underline"
            >
              <FiLogOut size={14} /> Session Exit
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
