"use client";

import { useWorker } from "@/context/WorkerContext";
import { useState, useEffect } from "react";

export default function Punching() {
  const {
    punchClockIn,
    isClockingIn,
    punchClockOut,
    isClockingOut,
    shiftDetails,
  } = useWorker();
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [clockInNote, setClockInNote] = useState("");
  const [clockOutNote, setClockOutNote] = useState("");

  const latestShift = shiftDetails?.[0];
  const currentStatus = latestShift?.status ?? "CLOCKEDOUT";

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
      setCurrentDate(
        now.toLocaleDateString([], {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClockIn = async () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const payload = {
          clockIn: new Date().toISOString(),
          clockInNote: clockInNote,
          latitudeIn: position.coords.latitude,
          longitudeIn: position.coords.longitude,
          status: "CLOCKEDIN",
        };
        punchClockIn(payload, {
          onSuccess: () => {
            setClockInNote("");
          },
        });
      },
      (error) => console.error(error.message),
    );
  };

  const handleClockOut = async () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const payload = {
          clockOut: new Date().toISOString(),
          clockOutNote: clockOutNote,
          latitudeOut: position.coords.latitude,
          longitudeOut: position.coords.longitude,
          status: "CLOCKEDOUT",
        };
        punchClockOut(payload, {
          onSuccess: () => {
            setClockOutNote("");
          },
        });
      },
      (error) => console.error(error.message),
    );
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/50 pt-20 pb-5 px-6 md:px-8 flex items-start justify-center">
      <div className="max-w-7xl w-full bg-white border border-slate-200/80 rounded-3xl shadow-2xl p-8 flex flex-col lg:flex-row gap-8 items-stretch transition-all duration-300">
        {/*  CONTROLS & CLOCK  */}
        <div className="w-full lg:w-[42%] bg-slate-50/60 border border-slate-200/50 rounded-2xl p-6 flex flex-col justify-between items-center text-center">
          <div className="w-full py-4 border-b border-slate-200/40">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">
              {currentDate || "Loading System Node..."}
            </p>
            <h2 className="text-5xl font-black font-mono tracking-tight text-slate-800 mt-2">
              {currentTime || "00:00:00"}
            </h2>
          </div>

          {/* Action Trigger Buttons */}
          <div className="my-8 flex items-center justify-center w-full">
            {currentStatus === "CLOCKEDOUT" ? (
              <div
                onClick={handleClockIn}
                disabled={isClockingIn}
                className="w-56 h-56 rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-200 shadow-xl shadow-emerald-100/40 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:bg-emerald-100/60 active:scale-[0.97]"
              >
                <span className="text-4xl">⚡</span>
                <h3 className="font-bold text-xl uppercase tracking-wider">
                  {isClockingIn ? "Clocking In..." : "Clock In"}
                </h3>
                <p className="text-xs text-emerald-500/80 lowercase">
                  {isClockingIn ? "fetching status..." : "start shift"}
                </p>
              </div>
            ) : (
              <div
                onClick={handleClockOut}
                disabled={isClockingOut}
                className="w-56 h-56 rounded-full bg-rose-50 text-rose-600 border-2 border-rose-200 shadow-xl shadow-rose-100/40 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:bg-rose-100/60 active:scale-[0.97]"
              >
                <span className="text-4xl">🛑</span>
                <h3 className="font-bold text-xl uppercase tracking-wider">
                  {isClockingOut ? "Clocking Out..." : "Clock Out"}
                </h3>
                <p className="text-xs text-rose-500/80 lowercase">
                  {isClockingOut ? "saving data..." : "end shift"}
                </p>
              </div>
            )}
          </div>

          {/* Note Box */}
          <div className="w-full space-y-3">
            {currentStatus === "CLOCKEDOUT" ? (
              <div className="w-full">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 text-left mb-1.5 pl-1">
                  Session Clock-In Note
                </label>
                <input
                  type="text"
                  placeholder="Enter session start context..."
                  value={clockInNote}
                  onChange={(e) => setClockInNote(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-800 placeholder-slate-400 shadow-inner"
                />
              </div>
            ) : (
              <div className="w-full">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 text-left mb-1.5 pl-1">
                  Session Clock-Out Note
                </label>
                <input
                  type="text"
                  placeholder="Enter deployment session summary..."
                  value={clockOutNote}
                  onChange={(e) => setClockOutNote(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 text-slate-800 placeholder-slate-400 shadow-inner"
                />
              </div>
            )}

            {/* Current State Indicator Status */}
            <div className="pt-4 border-t border-slate-200/60 w-full mt-3">
              {currentStatus === "CLOCKEDIN" ? (
                <span className="inline-flex items-center gap-1 text-rose-600 font-bold bg-rose-50 px-4 py-1.5 rounded-full text-xs border border-rose-100 uppercase tracking-wider animate-pulse">
                  ● Active Duty
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-slate-500 font-bold bg-slate-100 px-4 py-1.5 rounded-full text-xs border border-slate-200 uppercase tracking-wider">
                  ○ Off Duty
                </span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TIMELINE & LOGS */}
        <div className="flex-1 flex flex-col justify-between gap-6 mt-4 lg:mt-0">
          {/* Top Panel: Recent Activity Log Stream */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 pl-0.5">
              Recent Activity Log
            </h3>

            {!latestShift ? (
              <div className="text-center py-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-400 text-sm font-medium">
                No punch logs registered for this session yet.
              </div>
            ) : (
              <div
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  currentStatus === "CLOCKEDIN"
                    ? "bg-emerald-50/40 border-emerald-100/60 text-emerald-700"
                    : "bg-rose-50/40 border-rose-100/60 text-rose-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${currentStatus === "CLOCKEDIN" ? "bg-emerald-500" : "bg-rose-500"}`}
                  />
                  <span className="font-bold tracking-wide uppercase text-sm">
                    {currentStatus === "CLOCKEDIN"
                      ? "Clocked In Session"
                      : "Clocked Out Session"}
                  </span>
                </div>
                <div className="text-right font-mono text-sm font-bold text-slate-500">
                  <span>
                    {currentStatus === "CLOCKEDIN"
                      ? latestShift.clockIn
                        ? new Date(latestShift.clockIn).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "--:--"
                      : latestShift.clockOut
                        ? new Date(latestShift.clockOut).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" },
                          )
                        : "--:--"}
                  </span>
                  <span className="text-slate-300 mx-2.5">|</span>
                  <span className="text-slate-400 font-sans font-normal">
                    {latestShift.clockIn
                      ? new Date(latestShift.clockIn).toLocaleDateString([], {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "--/--/----"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/*  Previous Attendance History */}
          <div className="flex-1 flex flex-col justify-end">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 pl-0.5">
              Previous Attendance Logs
            </h3>

            <div className="overflow-x-auto border border-slate-200/60 rounded-xl h-full max-h-105 min-h-80 overflow-y-auto shadow-inner bg-white">
              <table className="w-full text-left border-collapse min-w-125">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/60 text-slate-400 font-bold text-xs uppercase tracking-wider sticky top-0 z-10">
                    <th className="p-4 pl-5">Date</th>
                    <th className="p-4">Clock In</th>
                    <th className="p-4">Clock Out</th>
                    <th className="p-4">Duration</th>
                    <th className="p-4 pr-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                  {!shiftDetails || shiftDetails.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-14 text-slate-400 font-medium bg-slate-50/20"
                      >
                        No previous attendance history found for your node.
                      </td>
                    </tr>
                  ) : (
                    shiftDetails.slice(0, 8).map((history) => (
                      <tr
                        key={history.id}
                        className="hover:bg-slate-50/40 transition-colors"
                      >
                        <td className="p-3.5 pl-5 font-semibold text-slate-700">
                          {history.clockIn
                            ? new Date(history.clockIn).toLocaleDateString([], {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })
                            : "--/--/----"}
                        </td>
                        <td className="p-3.5 font-mono text-emerald-600 font-semibold">
                          {history.clockIn
                            ? new Date(history.clockIn).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "--:--"}
                        </td>
                        <td className="p-3.5 font-mono text-rose-600 font-semibold">
                          {history.clockOut
                            ? new Date(history.clockOut).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" },
                              )
                            : "--:--"}
                        </td>
                        <td className="p-3.5 font-mono text-slate-500 font-medium">
                          {history.clockIn && history.clockOut ? (
                            `${Math.floor((new Date(history.clockOut) - new Date(history.clockIn)) / (1000 * 60 * 60))}h ${Math.floor(((new Date(history.clockOut) - new Date(history.clockIn)) % (1000 * 60 * 60)) / (1000 * 60))}m`
                          ) : (
                            <span className="text-amber-500 font-semibold animate-pulse">
                              In Progress...
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 pr-5 text-right">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${
                              history.status === "CLOCKEDIN"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : "bg-rose-50 text-rose-700 border border-rose-100"
                            }`}
                          >
                            {history.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
