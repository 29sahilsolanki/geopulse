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
  iconUrl: iconUrl.src || iconUrl,
  iconRetinaUrl: iconRetinaUrl.src || iconRetinaUrl,
  shadowUrl: shadowUrl.src || shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// View Port Smooth Navigation Agent
function ChangeView({ coords }) {
  const map = useMap();

  useEffect(() => {
    if (coords && coords[0] && coords[1]) {
      map.setView(coords, map.getZoom());
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

  // 🟢 State to handle initial render checks and stable re-mount key keys
  const [isMounted, setIsMounted] = useState(false);
  const [mapKey, setMapKey] = useState("initial-map");

  // 🟢 Core Center Tracking Engine
  const [mapCenter, setMapCenter] = useState([28.6139, 77.209]); // Default Delhi Fallback

  const {
    location,
    setLocaton,
    searchCoords,
    setSearchCoords,
    clickCoords,
    setClickCoords,
    locationPerimeter,
  } = useManager();

  // 🟢 Hook 1: Safely handles Browser Mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 🟢 Hook 2: Sync locationPerimeter as soon as Context Database loads
  useEffect(() => {
    if (locationPerimeter?.latitude && locationPerimeter?.longitude) {
      const dbCoords = [
        parseFloat(locationPerimeter.latitude),
        parseFloat(locationPerimeter.longitude),
      ];
      setMapCenter(dbCoords);
      // Map wrapper ko ek baar force refresh key dete hain backend loads par alignment ke liye
      setMapKey(`map-db-${locationPerimeter.latitude}`);
    }
  }, [locationPerimeter]);

  // 🟢 Hook 3: Listen explicitly to search changes and fly viewport
  useEffect(() => {
    if (searchCoords) {
      setMapCenter(searchCoords);
    }
  }, [searchCoords]);

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
        const nextCoords = [parseFloat(result.lat), parseFloat(result.lon)];

        setSearchCoords(nextCoords);
        setClickCoords(null);

        // Update key on submit to safely append instances without typing crashes
        setMapKey(`map-search-${Date.now()}`);
      }
    } catch (error) {
      console.log(error?.response?.data);
    }
  };

  return (
    <div className="w-full block">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-md flex flex-col gap-4">
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
        <div className="overflow-hidden rounded-xl border border-slate-200 shadow-inner relative w-full h-80 sm:h-96 lg:h-113 z-10 bg-slate-100 flex items-center justify-center">
          {!isMounted ? (
            <div className="text-xs font-semibold text-slate-400 animate-pulse">
              ⏳ Initializing Map Elements safely...
            </div>
          ) : (
            <MapContainer
              key={mapKey}
              center={mapCenter} // Stable dynamic state connection
              zoom={15}
              className="h-full w-full"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* 🟢 Fly viewport tracking trigger hooks */}
              <ChangeView coords={mapCenter} />

              {clickCoords && (
                <Marker position={clickCoords}>
                  <Popup>
                    <div className="text-xs font-medium text-slate-700 max-w-xs leading-normal">
                      {location?.display_name || "Selected Location Anchor"}
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* 🟢 DB content fallback marker representation on first load */}
              {!clickCoords && locationPerimeter?.latitude && (
                <Marker
                  position={[
                    parseFloat(locationPerimeter.latitude),
                    parseFloat(locationPerimeter.longitude),
                  ]}
                >
                  <Popup>
                    <div className="text-xs font-semibold text-emerald-600 max-w-xs leading-normal">
                      📍 Operational Perimeter:{" "}
                      {locationPerimeter.locationName || "Saved Hub Node"}
                    </div>
                  </Popup>
                </Marker>
              )}

              <LocationClick
                setClickCoords={setClickCoords}
                setLocaton={setLocaton}
              />
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
}
