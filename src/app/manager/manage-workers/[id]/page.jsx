"use client";

import { useManager } from "@/context/ManagerContext";
import { use } from "react";
import Link from "next/link";

export default function WorkerDetails({ params }) {
  // 1. Dynamic route params se worker ki id nikalna
  const { id } = use(params);
  const { workers } = useManager();

  // 2. Array mein se matching worker find karna
  const worker = workers?.find((w) => w.id === id);

  if (!worker) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50/50 gap-4">
        <p className="text-slate-400 text-lg font-semibold">
          Worker not found...
        </p>
        <Link
          href="/manager/manage-workers"
          className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl"
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const isClockedIn = worker?.shifts?.[0]?.status === "CLOCKEDIN";
  const shiftHistory = worker?.shifts || [];

  return (
    <div className="pt-24 pb-12 px-4 md:px-8 max-w-5xl mx-auto w-full min-h-screen flex flex-col gap-6 text-slate-900">
      {/* Back Button Navigation Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-3">
        <Link
          href="/manager/manage-workers"
          className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1"
        >
          ← Back to Workers List
        </Link>

        <span
          className={`px-2.5 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
            isClockedIn
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-slate-100 text-slate-600 border-slate-200"
          }`}
        >
          {isClockedIn ? "Active Now" : "Off Duty"}
        </span>
      </div>

      {/* ==================== 👤 WORKER PROFILE CORE CARD ==================== */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="relative shrink-0">
          <img
            src={worker.profilePic || "https://cdn.auth0.com/avatars/29.png"}
            alt={worker.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-slate-200/60 shadow-sm"
          />
          <span
            className={`absolute bottom-0 right-1 w-4 h-4 border-2 border-white rounded-full ${
              isClockedIn ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
            }`}
          />
        </div>

        <div className="text-center sm:text-left flex-1 w-full truncate">
          <h1 className="text-xl font-black text-slate-800 tracking-tight leading-tight">
            {worker.name}
          </h1>
          <p className="text-sm text-slate-400 mt-0.5 truncate">
            {worker.email}
          </p>

          {/* Metadata Grid Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 bg-slate-50/60 border border-slate-200/40 rounded-2xl p-4 text-left shadow-inner">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Contact Number
              </span>
              <p className="text-xs font-bold text-slate-700">
                {worker.phone || "Not Provided"}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                System ID Node
              </span>
              <p className="text-xs font-bold text-slate-700 truncate">{id}</p>
            </div>

            {/* 🟢 Alignment Fix: Placed Access details natively inside the grid to match spacing exactly */}
            <div className="border-t border-slate-200/60 pt-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                System Access Level
              </span>
              <span
                className={`inline-block mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border ${
                  worker.access === "GRANTED"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                    : "bg-rose-50 text-rose-700 border-rose-200/50"
                }`}
              >
                {worker.access}
              </span>
            </div>

            {/* 🟢 Action Trigger aligned cleanly to the right side block box in the same row layout matrix */}
            <div className="border-t border-slate-200/60 pt-3 flex items-end sm:justify-start">
              <button
                type="button"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition active:scale-[0.98] cursor-pointer w-full sm:w-auto text-center"
                onClick={() => {
                  console.log(`Granting access to ${worker.name}`);
                }}
              >
                Grant Access
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== 📅 📍 FULL HISTORICAL SHIFT HISTORY LOG BLOCK ==================== */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col gap-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
            Historical Deployment Logs
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            Audit trail of all tracked entries, clock sync timings, and marked
            perimeter anchors.
          </p>
        </div>

        {shiftHistory.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs font-medium bg-slate-50 border border-dashed border-slate-200 rounded-xl">
            📋 No historical logs registered inside context files for this
            resource node.
          </div>
        ) : (
          <div className="w-full overflow-x-auto border border-slate-200/70 rounded-xl bg-white shadow-sm">
            <table className="w-full border-collapse text-left text-xs text-slate-600">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Clock In</th>
                  <th className="px-4 py-3">Clock Out</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {shiftHistory.map((shift, idx) => (
                  <tr
                    key={shift.id || idx}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      {shift.createdAt
                        ? new Date(shift.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "--/--/----"}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase border ${
                          shift.status === "CLOCKEDIN"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-slate-100 text-slate-600 border-slate-200/60"
                        }`}
                      >
                        {shift.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 max-w-[240px]">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-slate-800">
                          {shift.clockIn
                            ? new Date(shift.clockIn).toLocaleTimeString(
                                "en-IN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )
                            : "--:--"}
                        </span>
                        <span className="text-[11px] text-slate-400 truncate">
                          {shift.inLocation || "Perimeter missing"}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 max-w-[240px]">
                      {shift.status === "CLOCKEDIN" ? (
                        <span className="text-emerald-500 animate-pulse text-[10px] font-bold uppercase tracking-wide">
                          ● Session Active
                        </span>
                      ) : (
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-slate-700">
                            {shift.clockOut
                              ? new Date(shift.clockOut).toLocaleTimeString(
                                  "en-IN",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )
                              : "--:--"}
                          </span>
                          <span className="text-[11px] text-slate-400 truncate">
                            {shift.outLocation || "No exit point logged"}
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
