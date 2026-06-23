"use client";

import { useWorker } from "@/context/WorkerContext";
import Image from "next/image";
import Link from "next/link";

export default function WorkerDashboard() {
  const { userData, shiftDetails, activeLocation, activeZoneLoading } =
    useWorker();

  const latestShift = shiftDetails?.[0];
  const currentStatus = latestShift?.status ?? "CLOCKEDOUT";

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

  return (
    <div className="pt-24 pb-8 px-4 md:px-8 max-w-7xl mx-auto w-full min-h-screen flex flex-col gap-6 text-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Welcome back, {userData?.name || "Loading..."}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Get a quick update on your recent activities with GeoPulse
          </p>
        </div>

        {/* ==================== 🌟 FIXED PROFILE WIDGET FOR LAPTOPS ==================== */}
        <div className="flex items-center gap-3 lg:gap-4 bg-white border border-slate-200 rounded-2xl p-3 lg:p-4 shadow-sm w-fit sm:max-w-xs md:max-w-sm shrink-0 transition-all duration-200 hover:border-slate-300">
          <Image
            src={userData?.profilePic || "No image available"}
            alt="User Node"
            width={44} // Laptop standard size optimized
            height={44}
            unoptimized
            className="w-11 h-11 rounded-full border border-slate-200 object-cover shrink-0 shadow-sm"
          />
          <div className="min-w-0 flex-1 pr-1">
            <p className="text-sm font-black text-slate-800 leading-tight truncate">
              {userData?.name || "System Core"}
            </p>
            <p className="text-[10px] font-bold text-slate-400 font-mono mt-1 uppercase tracking-wider truncate">
              Role: {userData?.role || "Worker"}
            </p>
          </div>
        </div>
      </div>

      {/* CORE PERFORMANCE CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        {/* Card A: Weekly Performance Activity */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <span className="text-2xl bg-slate-50 p-2.5 rounded-xl border border-slate-100 shadow-inner">
            📊
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Weekly Avg Login Hours
            </p>
            <p className="text-xl font-bold text-emerald-600 mt-0.5">
              {weeklyAverage}
            </p>
          </div>
        </div>

        {/* Card B: Shift Status Node Context */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <span className="text-2xl bg-slate-50 p-2.5 rounded-xl border border-slate-100 shadow-inner">
            ⏱️
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Current Attendance Status
            </p>
            <p
              className={`text-xl font-bold mt-0.5 ${currentStatus === "CLOCKEDIN" ? "text-rose-600" : "text-slate-700"}`}
            >
              {currentStatus === "CLOCKEDIN"
                ? "Clocked In (Active)"
                : "Clocked Out (Off-Duty)"}
            </p>
          </div>
        </div>

        {/* Total Attendance Maked */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center gap-4 sm:col-span-2 lg:col-span-1">
          <span className="text-2xl bg-slate-50 p-2.5 rounded-xl border border-slate-100 shadow-inner">
            📅
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Attendances Marked
            </p>
            <p className="text-xl font-bold text-slate-800 mt-0.5">
              {shiftDetails ? shiftDetails.length : 0} Attendances
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links & Attendance Split Section */}
      <div className="flex flex-col md:mt-5 lg:flex-row gap-6 items-stretch w-full">
        <div className="w-full lg:w-[42%] bg-slate-50/60 border border-slate-200/50 rounded-2xl p-5 flex flex-col justify-between gap-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200/40 pb-2 mb-4">
              Quick Links
            </h3>

            <div className="space-y-3">
              {/* Punch Attendance Link */}
              <Link
                href="/worker/punch-timings"
                className="block bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-500/40 hover:shadow-md transition-all border-l-4 border-l-emerald-500"
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">
                      Punch Your Attendance
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      Mark your daily clock-in and clock-out status parameters.
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg shrink-0">
                    Punch →
                  </span>
                </div>
              </Link>

              {/* View Profile Link */}
              <Link
                href="/worker/profile"
                className="block bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-slate-400 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">
                      View Your Profile
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      View and update necessary details in profile.
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg shrink-0">
                    View →
                  </span>
                </div>
              </Link>

              {/* View Shift History Link */}
              <Link
                href="/worker/shift-history"
                className="block bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-indigo-500/40 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">
                      View Shift History
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      View all your shift history and keep a track.
                    </span>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-lg shrink-0">
                    History →
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Timeline Activity Log Summary */}
        <div className="flex-1 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between min-h-80">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 mb-4">
              Latest Attendance Record
            </h3>

            {!latestShift ? (
              <div className="text-center py-14 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-400 text-sm font-medium">
                <span className="text-2xl block mb-1">📋</span>
                No active attendance registered...
              </div>
            ) : (
              <div className="space-y-4">
                {/* Latest Shift Status */}
                <div
                  className={`p-4 rounded-xl border flex flex-col gap-2.5 ${
                    currentStatus === "CLOCKEDIN"
                      ? "bg-emerald-50/20 border-emerald-100"
                      : "bg-slate-50 border-slate-200/60"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      CLOCK IN / CLOCK OUT
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        currentStatus === "CLOCKEDIN"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {currentStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-600 border-t border-slate-100 pt-2.5">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Clocked In At
                      </p>
                      <p className="font-mono mt-0.5 text-emerald-600">
                        {new Date(latestShift.clockIn).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Clocked Out At
                      </p>
                      <p className="font-mono mt-0.5 text-rose-600">
                        {latestShift.clockOut
                          ? new Date(latestShift.clockOut).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" },
                            )
                          : "--:--"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl">
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    📍 Last Location Marked:{" "}
                    <span className="font-mono font-bold text-slate-700">
                      {currentStatus === "CLOCKEDIN" && latestShift.inLocation}
                      {currentStatus === "CLOCKEDOUT" &&
                        latestShift.outLocation}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Detailed shift history link */}
          <div className="text-right mt-4 border-t border-slate-50 pt-3">
            <Link
              href="/worker/shift-history"
              className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 transition-colors"
            >
              View Detailed Shift History →
            </Link>
          </div>
        </div>
      </div>

      {/*-------------------- CURRENT ACTIVE ZONE SECTION -------------------- */}
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm w-full">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 mb-4">
          📍 Assigned Active Work Zone
        </h3>

        {activeZoneLoading ? (
          <div className="text-center py-8 text-sm font-medium text-slate-400 animate-pulse">
            Loading active zone parameters...
          </div>
        ) : !activeLocation ? (
          <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-400 text-sm font-medium">
            <span className="text-2xl block mb-1">🗺️</span>
            No active work zone or perimeter has been assigned by management.
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 border border-slate-100 p-4 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-xl bg-emerald-50 text-emerald-600 p-2 rounded-lg border border-emerald-100 shrink-0">
                🛡️
              </span>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  {activeLocation.name || "Main Site Perimeter"}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 max-w-xl">
                  {activeLocation.address ||
                    "Authorized operational boundaries active for your profile."}
                </p>
              </div>
            </div>

            <div className="flex gap-4 sm:gap-6 border-t sm:border-t-0 border-slate-200/60 pt-3 sm:pt-0 shrink-0 font-mono text-xs text-slate-600">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Allowed Radius
                </span>
                <span className="font-bold text-slate-800">
                  {activeLocation.radius
                    ? `${activeLocation.radius} meters`
                    : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Status
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  Active Secure
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
