"use client";

import { useManager } from "@/context/ManagerContext";
import { useState } from "react";
// Next.js ka dynamic import agent use kar rahe hain
import dynamic from "next/dynamic";

// MapComponent ko dynamically import kiya aur server-side rendering band kar di
const MapComponent = dynamic(() => import("@/components/common/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 sm:h-96 lg:h-112 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center text-xs font-semibold text-slate-400 animate-pulse">
      ⏳ Loading Map Context...
    </div>
  ),
});

export default function GeoFencing() {
  const { location, clickCoords, setGeoFencing } = useManager();
  const [radius, setRadius] = useState(1);

  const handleSave = async () => {
    if (!clickCoords)
      return alert("Please select a location on the map first!");

    const parameter = {
      latitude: clickCoords[0],
      longitude: clickCoords[1],
      radiusKm: radius,
      locationName: location?.display_name,
    };

    setGeoFencing(parameter);
  };

  return (
    /* 🟢 Outer framework limits */
    <div className="pt-20 lg:pt-24 pb-6 px-4 md:px-6 w-full min-h-screen bg-slate-50/50 flex items-start justify-center">
      {/* 🎯 Master Horizontal Dashboard Box Frame */}
      <div className="max-w-7xl w-full bg-white border border-slate-200/80 rounded-3xl shadow-xl p-5 md:p-6 flex flex-col lg:flex-row gap-6 items-stretch transition-all duration-300">
        {/* ==================== LEFT COLUMN: MAP VIEWPORT WIDGET ==================== */}
        <div className="w-full lg:w-[64%] flex rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm min-h-87 sm:min-h-100 lg:min-h-0">
          {/* Dynamically imported MapComponent */}
          <MapComponent />
        </div>

        {/* ==================== RIGHT COLUMN: PARAMETERS & SYSTEM LOGS ==================== */}
        <div className="w-full lg:w-[36%] flex flex-col gap-4 shrink-0">
          {/* Sub-Card 1: Input Parameter Configuration Form */}
          <div className="bg-slate-50/60 border border-slate-200/50 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 shadow-inner">
            <div>
              <h2 className="text-base font-bold text-slate-800 tracking-tight border-b border-slate-200/60 pb-2 mb-3">
                Geofence Parameters
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 pl-0.5">
                Target Anchor Location
              </p>
              <p className="font-medium text-xs text-slate-600 bg-white border border-slate-200 rounded-xl p-3 leading-relaxed max-h-23 overflow-y-auto shadow-inner">
                {location?.display_name ||
                  "Click anywhere on the spatial map to lock coordinates or search specific area."}
              </p>
            </div>

            {/* Coordinates Lat/Lng Row Stacks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              <div className="bg-white border border-slate-200 px-3 py-2.5 rounded-xl flex items-center justify-between shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Latitude
                </span>
                <span className="font-mono text-xs font-bold text-slate-800">
                  {clickCoords ? clickCoords[0].toFixed(6) : "0.000000"}
                </span>
              </div>

              <div className="bg-white border border-slate-200 px-3 py-2.5 rounded-xl flex items-center justify-between shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Longitude
                </span>
                <span className="font-mono text-xs font-bold text-slate-800">
                  {clickCoords ? clickCoords[1].toFixed(6) : "0.000000"}
                </span>
              </div>
            </div>

            {/* Perimeter Radius Input Parameter Field Controller */}
            <div className="flex flex-col gap-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 pl-0.5">
                Boundary Radius
              </label>
              <div className="relative flex items-center shadow-sm rounded-xl w-full">
                <input
                  type="number"
                  min="1"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded-xl pl-3 pr-12 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 bg-white shadow-inner"
                  placeholder="Set bounds..."
                />
                <span className="absolute right-4 font-mono text-[10px] text-slate-400 font-bold pointer-events-none">
                  KM
                </span>
              </div>
            </div>

            {/* Save Button Action Trigger */}
            <div className="pt-1">
              <button
                onClick={handleSave}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-100/50 transition-all duration-200 active:scale-[0.99] cursor-pointer"
              >
                Save Configuration
              </button>
            </div>
          </div>

          {/* ==================== 🟢 CURRENT GEOFENCE ZONE (Unnecessary Footer Removed) ==================== */}
          <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between min-h-38">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 mb-3">
                Current Geofence Zone
              </h3>

              {/* Check Condition Status parameters block info stack */}
              {location?.display_name ? (
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-xs font-medium text-slate-700">
                    <span className="text-emerald-500 mt-0.5 shrink-0">●</span>
                    <span className="wrap-break font-semibold text-slate-800 leading-tight">
                      {location.display_name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-normal pl-3">
                    Active GeoFence radius set to{" "}
                    <span className="font-mono font-bold text-slate-600">
                      {radius} KM
                    </span>{" "}
                    .
                  </p>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs font-medium bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                  <span className="block text-lg mb-1">🗺️</span>
                  No active zone locked in context.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
