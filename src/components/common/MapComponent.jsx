"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

import { useManager } from "@/context/ManagerContext";

// Leaflet Default Icon Configuration
const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// View Port Smooth Navigation Agent
function ChangeView({ coords }) {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.setView(coords);
    }
  }, [coords, map]);

  return null;
}

// Map Event Click Handler
function LocationClick({ setClickCoords, setLocaton }) {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;

      setClickCoords([lat, lng]);

      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        );

        setLocaton(res.data);
      } catch (error) {
        console.error("Reverse Geocoding Error:", error);
      }
    },
  });

  return null;
}

export default function MapComponent() {
  const [query, setQuery] = useState("");

  const {
    location,
    setLocaton,
    searchCoords,
    setSearchCoords,
    clickCoords,
    setClickCoords,
  } = useManager();

  const handleQuery = async (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`,
      );

      if (res.data.length > 0) {
        const result = res.data[0];

        setLocaton(result);
        setSearchCoords([parseFloat(result.lat), parseFloat(result.lon)]);

        // Search karne par click marker ko clear karenge
        setClickCoords(null);
      }
    } catch (error) {
      console.log(error?.response?.data);
    }
  };

  return (
    <div className="w-full block">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-md flex flex-col gap-4">
        {/* 🟢 RESTORED: Main Header Metadata block wapas aa gaya hai */}
        <div>
          <h1 className="text-xl font-bold text-slate-900">Geo Fencing</h1>
          <p className="mt-1 text-sm text-slate-500">
            Search a location or click anywhere on the map to select
            coordinates.
          </p>
        </div>

        {/* ==================== SEARCH BAR CONTAINER ==================== */}
        <form onSubmit={handleQuery} className="w-full">
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search target operational area..."
              className="w-full sm:flex-1 rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-emerald-500 text-xs text-slate-700 bg-slate-50/50 shadow-inner"
            />
            <button
              type="submit"
              className="w-full sm:w-auto rounded-xl bg-emerald-500 px-6 py-2.5 font-bold text-xs uppercase tracking-wider text-white hover:bg-emerald-600 transition-colors cursor-pointer shadow-sm shrink-0"
            >
              Search
            </button>
          </div>
        </form>

        {/* ==================== 🗺️ INTERACTIVE MAP CANVAS ==================== */}
        <div className="overflow-hidden rounded-xl border border-slate-200 shadow-inner relative w-full h-80 sm:h-96 lg:h-[450px] z-10 bg-slate-100">
          <MapContainer
            center={searchCoords || [28.6139, 77.209]}
            zoom={15}
            className="h-full w-full"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {searchCoords && <ChangeView coords={searchCoords} />}

            {clickCoords && (
              <Marker position={clickCoords}>
                <Popup>
                  <div className="text-xs font-medium text-slate-700 max-w-xs leading-normal">
                    {location?.display_name || "Selected Location Anchor"}
                  </div>
                </Popup>
              </Marker>
            )}

            <LocationClick
              setClickCoords={setClickCoords}
              setLocaton={setLocaton}
            />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
