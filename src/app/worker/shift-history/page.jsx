"use client";

import { useWorkerDetails } from "@/hooks/useWorker";
import { useState } from "react";

export default function ShiftHistory() {
  const { data: workerData, isLoading: workerLoading } = useWorkerDetails();
  const [startIndex, setStartIndex] = useState(0);

  const shiftDetails = workerData?.shiftDetails || [];

  // Weekly Average Login Duration Calculation
  const getWeeklyAverage = () => {
    if (!shiftDetails || shiftDetails.length === 0) return "0h 0m";

    const completedShifts = shiftDetails
      .filter((shift) => shift.clockIn && shift.clockOut)
      .slice(0, 7);

    if (completedShifts.length === 0) return "0h 0m";

    const totalMs = completedShifts.reduce((acc, shift) => {
      const duration = new Date(shift.clockOut) - new Date(shift.clockIn);
      return acc + duration;
    }, 0);

    const avgMs = totalMs / completedShifts.length;
    const totalMinutes = Math.floor(avgMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  const weeklyAverage = getWeeklyAverage();
  const shiftHistory = shiftDetails || [];
  const currentRecords = shiftHistory.slice(startIndex, startIndex + 10);

  if (workerLoading) {
    return (
      <div className="w-full max-w-6xl mt-20 flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mt-20 flex flex-col gap-6">
      {/* WEEKLY PERFORMANCE MATRIX */}
      <div className="w-full bg-slate-50/80 border border-slate-200/60 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-inner">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Weekly Activity Insight
          </h4>
          <p className="text-slate-500 text-xs mt-0.5">
            Average deployment active window based on your last 7 active
            sessions.
          </p>
        </div>

        {/* Stats Visual Display  */}
        <div className="bg-white border border-slate-200/80 rounded-2xl px-5 py-3 shadow-sm flex items-center gap-3">
          <span className="text-xl">📊</span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Avg. Login Duration
            </p>
            <p className="font-mono text-lg font-bold text-emerald-600 mt-0.5">
              {weeklyAverage}
            </p>
          </div>
        </div>
      </div>

      {/* ATTENDANCE LOGS HISTORY  */}
      <div className="w-full bg-white border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-200/50 text-slate-900 p-6 transition-all duration-300">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Previous Attendance Logs
          </h3>
          <span className="text-xs font-semibold bg-slate-100 text-slate-660 px-2.5 py-1 rounded-full border border-slate-200/40">
            Total Sessions: {shiftHistory.length}
          </span>
        </div>

        {shiftHistory.length === 0 ? (
          <div className="text-center py-10 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm font-medium">
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="text-2xl">📅</span>
              <span>
                No shift records registered in the database matrix yet.
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="overflow-x-auto border border-slate-200/60 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/60 text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                    <th className="p-3 pl-4">Date</th>
                    <th className="p-3">Clock In</th>
                    <th className="p-3">Clock Out</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Location (In/Out)</th>
                    <th className="p-3 pr-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                  {currentRecords.map((shift) => (
                    <tr
                      key={shift.id}
                      className="hover:bg-slate-50/50 transition-colors font-medium"
                    >
                      <td className="p-3.5 pl-4 font-semibold text-slate-700">
                        {shift.clockIn
                          ? new Date(shift.clockIn).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              },
                            )
                          : "--/--/----"}
                      </td>

                      <td className="p-3.5 font-mono text-emerald-600 font-semibold">
                        {shift.clockIn
                          ? new Date(shift.clockIn).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "--:--"}
                      </td>

                      <td
                        className={`p-3.5 font-mono font-semibold ${shift.clockOut ? "text-rose-600" : "text-slate-400"}`}
                      >
                        {shift.clockOut
                          ? new Date(shift.clockOut).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "--:--"}
                      </td>

                      <td className="p-3.5 font-mono text-slate-500">
                        {shift.clockIn && shift.clockOut ? (
                          `${Math.floor((new Date(shift.clockOut) - new Date(shift.clockIn)) / (1000 * 60 * 60))}h ${Math.floor(((new Date(shift.clockOut) - new Date(shift.clockIn)) % (1000 * 60 * 60)) / (1000 * 60))}m`
                        ) : (
                          <span className="text-amber-500 font-semibold animate-pulse">
                            On-Duty...
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-slate-400 font-mono text-[10px]">
                        In:{" "}
                        {shift.latitudeIn
                          ? Number(shift.latitudeIn).toFixed(4)
                          : "0.0000"}
                        ,{" "}
                        {shift.longitudeIn
                          ? Number(shift.longitudeIn).toFixed(4)
                          : "0.0000"}
                        {shift.clockOut ? (
                          ` | Out: ${shift.latitudeOut ? Number(shift.latitudeOut).toFixed(4) : "0.0000"}, ${shift.longitudeOut ? Number(shift.longitudeOut).toFixed(4) : "0.0000"}`
                        ) : (
                          <span className="text-amber-500 italic ml-1">
                            (Tracking...)
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 pr-4 text-right">
                        {shift.status === "CLOCKEDOUT" || shift.clockOut ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Completed
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100 animate-pulse">
                            On-Duty
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {shiftHistory.length > 10 && (
              <div className="flex items-center justify-end gap-4 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  disabled={startIndex === 0}
                  onClick={() => setStartIndex((prev) => prev - 10)}
                  className="px-3 py-1.5 border border-slate-200 rounded-xl font-bold bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white cursor-pointer transition active:scale-[0.97]"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={startIndex + 10 >= shiftHistory.length}
                  onClick={() => setStartIndex((prev) => prev + 10)}
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
