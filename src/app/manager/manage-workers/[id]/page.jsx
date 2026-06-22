"use client";

import { useManager } from "@/context/ManagerContext";
import { use, useState } from "react";
import Link from "next/link";
import AverageLoginChart from "@/components/manager/AverageLoginChart";
import Image from "next/image";

export default function WorkerDetails({ params }) {
  const { id } = use(params);
  const { workers } = useManager();
  const worker = workers?.find((w) => w.id === id);

  //worker shift status
  const shiftHistory = worker?.shifts || [];

  //pagination work
  const [startIndex, setStartIndex] = useState(0);
  const currentRecords = shiftHistory.slice(startIndex, startIndex + 10);

  //clockin or clockout status
  const isClockedIn = worker?.shifts?.[0]?.status === "CLOCKEDIN";

  //loading screen
  if (!worker) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50/50 gap-4">
        <p className="text-slate-400 text-lg font-semibold">
          Loading worker details...
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

  return (
    <div className="pt-24 pb-12 px-4 md:px-8 max-w-5xl mx-auto w-full min-h-screen flex flex-col gap-6 text-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-3">
        {/* back button to worker list */}
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

      {/* worker profile card */}

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="relative shrink-0">
          <Image
            src={worker.profilePic || "no profile pic"}
            alt={worker.name}
            width={80}
            height={80}
            unoptimized
            className="rounded-full object-cover border-2 border-slate-200/60 shadow-sm"
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
                Worker Id
              </span>
              <p className="text-xs font-bold text-slate-700 truncate">{id}</p>
            </div>

            <div className="border-t border-slate-200/60 pt-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Access Permission
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

      {/* Average login hours 7 days cycle */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col gap-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
            Average Working Hours
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            Daily working hours breakdown (Last 7 Shifts).
          </p>
        </div>
        <div className="w-full pt-1">
          <AverageLoginChart shiftHistory={shiftHistory} />
        </div>
      </div>

      {/*  SHIFT HISTORY LOGS */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col gap-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
            Shift History Logs
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            Shift history being displayed of recent 10 days click next for more
            logs
          </p>
        </div>

        {shiftHistory.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs font-medium bg-slate-50 border border-dashed border-slate-200 rounded-xl">
            📋 No historical logs registered inside context files for this
            resource node.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
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
                  {currentRecords.map((shift, idx) => (
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

                      <td className="px-4 py-3 max-w-60">
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

                      <td className="px-4 py-3 max-w-60">
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

            {/* Pagination using indexes 10 per page */}
            {shiftHistory.length > 10 && (
              <div className="flex items-center justify-end gap-4 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  disabled={startIndex === 0} // Pehle page par disabled
                  onClick={() => setStartIndex((prev) => prev - 10)} // Seede -10 index backend shift
                  className="px-3 py-1.5 border border-slate-200 rounded-xl font-bold bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white cursor-pointer transition active:scale-[0.97]"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={startIndex + 10 >= shiftHistory.length} // Aakhri page par disabled
                  onClick={() => setStartIndex((prev) => prev + 10)} // Seede +10 index forward shift
                  className="px-3 py-1.5 border border-slate-200 rounded-xl font-bold bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white cursor-pointer transition active:scale-[0.97]"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
