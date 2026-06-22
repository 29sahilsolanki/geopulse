"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function AverageLoginChart({ shiftHistory }) {
  const recentShifts = shiftHistory.slice(0, 7).reverse();

  // Dates mapping for X-Axis labels
  const barLabels = recentShifts.map((shift, idx) =>
    shift.createdAt
      ? new Date(shift.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        })
      : `Shift ${idx + 1}`,
  );

  //Individual shifts hours extraction
  const barHoursData = recentShifts.map((shift) => {
    if (shift.clockIn && shift.clockOut) {
      const diffMs = new Date(shift.clockOut) - new Date(shift.clockIn);
      return Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10;
    }
    return shift.status === "CLOCKEDIN" ? 5.5 : 8;
  });

  //Calculate Average Login Hours for Last 7 Days
  const totalHours = barHoursData.reduce((sum, current) => sum + current, 0);
  const averageHours =
    barHoursData.length > 0
      ? (totalHours / barHoursData.length).toFixed(1)
      : "0.0";

  // Chart.js Configuration
  const data = {
    labels: barLabels,
    datasets: [
      {
        label: "Hours",
        data: barHoursData,
        backgroundColor: "#10b981",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#f1f5f9" } },
    },
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl flex items-center justify-between shadow-inner">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
            7-Day Average Active Login Time
          </span>
          <p className="text-xl font-black text-emerald-600 tracking-tight leading-tight">
            {averageHours}{" "}
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Hours / Day
            </span>
          </p>
        </div>
        <div className="text-xl bg-white border border-slate-200/50 p-2 rounded-xl shadow-sm">
          ⏱️
        </div>
      </div>

      {/* Bar Chart Grid Container */}
      <div className="w-full h-56 relative">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
