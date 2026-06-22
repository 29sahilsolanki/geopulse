"use client";

import { useManager } from "@/context/ManagerContext";
import {
  FiUsers,
  FiLogIn,
  FiLogOut,
  FiAlertCircle,
  FiMapPin,
  FiCompass,
} from "react-icons/fi";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Image from "next/image";
import Link from "next/link";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ManagerDashboard() {
  const { workers, loadingWorkers, manager, locationPerimeter } = useManager();

  if (loadingWorkers) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
        <p className="text-slate-400 text-sm font-semibold tracking-wider uppercase animate-pulse">
          Loading Manager Dashboard...
        </p>
      </div>
    );
  }

  const totalWorkersCount = workers.length;
  let clockedInCount = 0;
  let clockedOutCount = 0;

  workers.forEach((worker) => {
    if (worker.shifts && worker.shifts.length > 0) {
      const latestShift = worker.shifts[0];

      if (latestShift.status === "CLOCKEDIN") {
        clockedInCount++;
      } else if (latestShift.status === "CLOCKEDOUT") {
        clockedOutCount++;
      }
    }
  });

  const offDutyCount = totalWorkersCount - (clockedInCount + clockedOutCount);

  // Chart.js Data Configuration
  const chartData = {
    labels: ["Clocked In", "Clocked Out", "Off Duty"],
    datasets: [
      {
        data: [clockedInCount, clockedOutCount, offDutyCount],
        backgroundColor: ["#10b981", "#3b82f6", "#94a3b8"],
        borderColor: ["#ffffff", "#ffffff", "#ffffff"],
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          font: { size: 11, weight: "600" },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: "#0f172a",
        padding: 10,
        cornerRadius: 8,
        titleFont: { size: 12 },
        bodyFont: { size: 12 },
      },
    },
  };

  return (
    <div className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full min-h-screen flex flex-col gap-8 text-slate-900 bg-slate-50/50">
      {/* TOP WELCOME HEADER */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black tracking-tight text-slate-800">
          Welcome Back, {manager?.name || "Manager"} 👋
        </h1>
        <p className="text-xs font-medium text-slate-400">
          GeoPulse Centralised Manager Dashboard.
        </p>
      </div>

      {/* COUNTER DASHBOARD CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Workers
            </span>
            <h3 className="text-2xl font-black text-slate-800">
              {totalWorkersCount}
            </h3>
          </div>
          <div className="p-3 bg-slate-100 rounded-xl text-slate-600">
            <FiUsers size={20} />
          </div>
        </div>

        {/* Card 2: Active Clocked In */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Clocked In Now
            </span>
            <h3 className="text-2xl font-black text-emerald-600">
              {clockedInCount}
            </h3>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <FiLogIn size={20} />
          </div>
        </div>

        {/* Clocked Out Workers */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Clocked Out Today
            </span>
            <h3 className="text-2xl font-black text-blue-600">
              {clockedOutCount}
            </h3>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <FiLogOut size={20} />
          </div>
        </div>
      </div>

      {/* ==================== CHART AND LIVE WORKER LOGS ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Doughnut Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-95">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Shift Details
            </h3>
          </div>

          <div className="flex-1 w-full relative flex items-center justify-center p-2">
            {totalWorkersCount > 0 ? (
              <Doughnut data={chartData} options={chartOptions} />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                <FiAlertCircle size={28} className="stroke-1" />
                <p className="text-xs font-medium">
                  No active shift data available
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Live Worker Logs */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-95 justify-between">
          <div className="border-b border-slate-100 pb-3 mb-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Live Worker Logs Details
              </h3>
              <span className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
            </div>
          </div>

          <div className="overflow-y-auto flex-1 pr-1 flex flex-col gap-3 custom-scrollbar mb-3">
            {workers.length > 0 ? (
              workers.map((worker) => {
                const hasShifts = worker.shifts && worker.shifts.length > 0;
                const currentStatus = hasShifts
                  ? worker.shifts[0].status
                  : "OFF DUTY";

                return (
                  <div
                    key={worker.id}
                    className="flex items-center justify-between p-3 border border-slate-100 bg-slate-50/40 rounded-xl hover:border-slate-200 transition"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Image
                        src={
                          worker.profilePic ||
                          "https://cdn.auth0.com/avatars/29.png"
                        }
                        alt={`${worker.name || "Worker"}'s profile picture`}
                        width={36}
                        height={36}
                        unoptimized
                        className="w-9 h-9 rounded-full bg-slate-100 object-cover border border-slate-200"
                      />
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-700 truncate">
                          {worker.name}
                        </p>
                        <p className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                          {worker.email}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase border tracking-wider shrink-0 ${
                        currentStatus === "CLOCKEDIN"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                          : currentStatus === "CLOCKEDOUT"
                            ? "bg-blue-50 text-blue-700 border-blue-200/50"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                    >
                      {currentStatus}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 text-center my-auto">
                No workers marked their logs yet.
              </p>
            )}
          </div>

          {/*  List view  */}
          <div className="flex justify-end pt-2 border-t border-slate-100 shrink-0">
            <Link
              href="/manager/manage-workers"
              className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 hover:bg-emerald-100/80 px-3 py-1.5 rounded-xl border border-emerald-200/40 transition active:scale-[0.97]"
            >
              View All Logs →
            </Link>
          </div>
        </div>
      </div>

      {/* ====================  GEOFENCE LIVE PANEL ==================== */}
      <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
        <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
          <FiMapPin className="text-indigo-500" size={16} />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Currently Active GeoFence Perimeter
          </h3>
        </div>

        {locationPerimeter ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
            {/* Location Name Info Box */}
            <div className="flex flex-col gap-1.5 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                📍 Location Name
              </span>
              <p className="text-xs font-bold text-slate-700 leading-tight">
                {locationPerimeter.locationName || "Default Assigned Work Zone"}
              </p>
            </div>

            {/* Coordinates */}
            <div className="flex flex-col gap-1.5 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                🧭 Location Coordinates
              </span>
              <p className="text-xs font-mono font-bold text-slate-600">
                Lat:{" "}
                <span className="text-indigo-600">
                  {Number(locationPerimeter.latitude).toFixed(4)}
                </span>
                , Lng:{" "}
                <span className="text-indigo-600">
                  {Number(locationPerimeter.longitude).toFixed(4)}
                </span>
              </p>
            </div>

            {/* Lock Radius */}
            <div className="flex flex-col gap-1.5 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                🛡️ Allowed Security Radius
              </span>
              <p className="text-xs font-bold text-emerald-600">
                {locationPerimeter.radiusMetre || "500"} Meters
                <span className="text-[10px] text-slate-400 font-normal ml-1">
                  (Operational Lock)
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-400 font-medium">
            <FiCompass size={18} className="animate-spin" />
            <p>Searching for current GeoFence zone...</p>
          </div>
        )}
      </div>
    </div>
  );
}
