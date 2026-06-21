"use client";

import Link from "next/link";
import { FiMapPin, FiTwitter, FiGithub, FiLinkedin } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-[#05060A]/95 backdrop-blur-xl border-t border-zinc-900/80 text-zinc-400 py-8 relative z-10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* PURE FLEXBOX LAYOUT CONTAINER */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* LEFT SIDE: Identity & Brand Layout */}
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              <FiMapPin size={16} />
            </span>
            <span className="text-sm font-black text-white tracking-tight">
              GeoPulse{" "}
              <span className="text-emerald-500 font-medium font-mono text-xs tracking-normal">
                EMS
              </span>
            </span>
          </div>

          {/* MIDDLE SIDE: Manual Static Navigation Links (No Loops) */}
          <div className="flex items-center gap-6 text-xs font-medium tracking-wide">
            <Link
              href="/privacy"
              className="text-zinc-500 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-zinc-500 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/support"
              className="text-zinc-500 hover:text-white transition-colors"
            >
              Support Desk
            </Link>
          </div>

          {/* RIGHT SIDE: Interactive Social Icons Matrix & Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
            {/* Social Icons Container (Pure Manual Layout) */}
            <div className="flex items-center gap-4 text-zinc-500">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-400 transition-colors p-1"
                aria-label="Twitter Node Link"
              >
                <FiTwitter size={16} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-400 transition-colors p-1"
                aria-label="Github Repo Repository Link"
              >
                <FiGithub size={16} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-400 transition-colors p-1"
                aria-label="LinkedIn Network Link"
              >
                <FiLinkedin size={16} />
              </a>
            </div>

            {/* System Copyright Stamp */}
            <div className="text-xs text-zinc-600 font-mono tracking-wider">
              &copy; {new Date().getFullYear()} GeoPulse Net.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
