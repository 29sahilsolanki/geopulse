"use client";

import Link from "next/link";
import { useManager } from "@/context/ManagerContext";

export default function ManageWorkers() {
  const { workers, loadingWorkers } = useManager();

  if (loadingWorkers) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50/50">
        <p className="text-slate-500 animate-pulse text-lg font-semibold">
          Loading workers...
        </p>
      </div>
    );
  }
  if (!workers || workers.length === 0) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50/50">
        <p className="text-slate-400 text-lg font-semibold">No data found...</p>
      </div>
    );
  }

  // 1. Live Counters Engine Tracker
  const totalWorkers = workers.length;
  const clockedInCount = workers.filter(
    (w) => w?.shifts?.[0]?.status === "CLOCKEDIN",
  ).length;
  const clockedOutCount = totalWorkers - clockedInCount;

  return (
    <div className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full min-h-screen flex flex-col gap-6 text-slate-900">
      {/* ==================== 📊 1. LIVE PLATFORM METRICS GRID COUNTERS ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full">
        {/* Box A: Total Registered Workers */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <span className="text-2xl bg-slate-50 p-2.5 rounded-xl border border-slate-100 shadow-inner">
            👤
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Workers
            </p>
            <p className="text-xl font-bold text-slate-800 mt-0.5">
              {totalWorkers} Registered
            </p>
          </div>
        </div>

        {/* Box B: Active Workers (Clocked In) */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <span className="text-2xl bg-emerald-50 text-emerald-600 p-2.5 rounded-xl border border-emerald-100/50 shadow-inner">
            ⚡
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Now
            </p>
            <p className="text-xl font-bold text-emerald-600 mt-0.5">
              {clockedInCount} Clocked In
            </p>
          </div>
        </div>

        {/* Box C: Off Duty Workers (Clocked Out) */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <span className="text-2xl bg-slate-50 p-2.5 rounded-xl border border-slate-100 shadow-inner">
            🛑
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Off Duty
            </p>
            <p className="text-xl font-bold text-slate-500 mt-0.5">
              {clockedOutCount} Clocked Out
            </p>
          </div>
        </div>
      </div>

      {/* ==================== 👤 2. WORKER GRID CONTAINER MATRIX ==================== */}
      <div className="mt-2">
        <h1 className="text-2xl font-black tracking-tight text-slate-800 mb-5 flex items-center gap-2">
          Worker Details
        </h1>

        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
          {workers?.map((p) => {
            const isClockedIn = p?.shifts?.[0]?.status === "CLOCKEDIN";

            return (
              <div
                key={p.id}
                /* 🟢 CARD LOOK ENHANCED: Added shadow refinement and crisp slate borders */
                className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between ${
                  isClockedIn
                    ? "border-slate-200/90 border-l-4 border-l-emerald-500"
                    : "border-slate-200/90 border-l-4 border-l-slate-400"
                }`}
              >
                <div>
                  {/* Top Block Details Info row */}
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-3 mb-3.5">
                    <div className="relative shrink-0">
                      <img
                        src={
                          p.profilePic || "https://cdn.auth0.com/avatars/29.png"
                        }
                        alt={p.name}
                        className="w-14 h-14 rounded-full object-cover border border-slate-200/80 shadow-sm"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full ${
                          isClockedIn
                            ? "bg-emerald-500 animate-pulse"
                            : "bg-slate-400"
                        }`}
                      />
                    </div>

                    <div className="truncate flex-1">
                      <h2 className="text-base font-bold text-slate-800 tracking-tight leading-tight truncate">
                        {p.name}
                      </h2>
                      <p className="text-xs text-slate-400 truncate mt-0.5 font-normal">
                        {p.email}
                      </p>
                      <p className="text-[11px] font-mono font-bold text-slate-500 mt-1 flex items-center gap-1.5 bg-slate-50 w-fit px-2 py-0.5 rounded border border-slate-100">
                        <span className="text-[10px]">📞</span>{" "}
                        {p.phone || "Not Available"}
                      </p>
                    </div>
                  </div>

                  {/* Inside Log Metric Parameters */}
                  {/* 🟢 CARDS SPACE POLISHED: Spacings inside metadata rows made cleanly aligned */}
                  <div className="space-y-2.5 text-xs text-slate-600 font-medium mb-5 bg-slate-50/60 border border-slate-200/40 rounded-xl p-3 shadow-inner">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Registry Date
                      </span>
                      <span className="text-slate-700 font-semibold font-mono">
                        {p?.shifts?.[0]?.createdAt
                          ? new Date(p.shifts[0].createdAt).toLocaleString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "--/--/----"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        System Access
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border ${
                          p.access === "GRANTED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                            : "bg-rose-50 text-rose-700 border-rose-200/50"
                        }`}
                      >
                        {p.access}
                      </span>
                    </div>

                    <div className="border-t border-slate-200/50 my-1" />

                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {isClockedIn
                          ? "📍 Active Position Anchor"
                          : "🛑 Last Exit Perimeter"}
                      </span>
                      <p className="text-[11px] text-slate-600 truncate font-mono bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/60 mt-0.5 shadow-sm">
                        {isClockedIn
                          ? p?.shifts?.[0]?.inLocation || "Location missing"
                          : p?.shifts?.[0]?.outLocation ||
                            "No recent exit point"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Dynamic Operations CTA Block Links */}
                {/* 🟢 ACTIONS BUTTONS POLISHED: Better text layout and clean padding configurations */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm shadow-emerald-100 transition active:scale-[0.98] cursor-pointer"
                    onClick={() => {
                      console.log(`Granting access to ${p.name}`);
                    }}
                  >
                    Grant Access
                  </button>
                  <Link
                    href={`/manager/manage-workers/${p.id}`}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-center border border-slate-200/60 transition active:scale-[0.98]"
                  >
                    View More
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
