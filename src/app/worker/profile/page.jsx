"use client";

import { useWorker } from "@/context/WorkerContext";

export default function Profile() {
  const { userData, userLoading } = useWorker();

  if (userLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-100">
        <p className="text-slate-500 animate-pulse">Loading profile...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-red-500 font-semibold">Unable to load profile</p>
      </div>
    );
  }

  const joinedDate = userData.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "--";

  return (
    <div className="pt-24 pb-12 px-4 md:px-8 w-full bg-slate-50/50 min-h-screen flex items-start justify-center">
      {/* 🎯 Master Frame container with premium subtle borders */}
      <div className="max-w-5xl w-full shadow-2xl rounded-3xl overflow-hidden bg-white border border-slate-200/60">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr]">
          {/* ==================== LEFT PANEL: BRANDING & HEAD DATA ==================== */}
          <div className="bg-[#0f172a] p-8 text-white flex flex-col justify-between items-center text-center border-r border-slate-800 min-h-[400px] lg:min-h-full">
            <div className="flex flex-col items-center w-full">
              {/* Image Border Accent Container */}
              <div className="relative p-1 rounded-full bg-slate-800 border border-slate-700/60 shadow-inner">
                <img
                  src={
                    userData.profilePic ||
                    "https://cdn.auth0.com/avatars/29.png"
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-2 border-slate-900 object-cover shadow-md"
                />
                <span className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 border-2 border-[#0f172a] rounded-full shadow-sm animate-pulse" />
              </div>

              {/* Original font: text-2xl font-bold */}
              <h1 className="mt-5 text-2xl font-bold tracking-tight text-white">
                {userData.name}
              </h1>

              {/* Original font: text-sm break-all */}
              <p className="text-slate-400 text-sm mt-1.5 break-all max-w-[240px] font-mono opacity-90">
                {userData.email}
              </p>

              {/* Status Badges with crisp borders */}
              <div className="flex flex-wrap justify-center gap-2 mt-5">
                <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-sm border border-slate-700 font-medium uppercase tracking-wider">
                  {userData.role}
                </span>

                <span
                  className={`px-3 py-1 rounded-lg text-sm font-bold border tracking-wider ${
                    userData.access === "GRANTED"
                      ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30"
                      : "bg-rose-950/40 text-rose-400 border-rose-500/30"
                  }`}
                >
                  {userData.access}
                </span>
              </div>
            </div>

            {/* Action Edit button styled seamlessly with your dark context */}
            <button className="cursor-pointer mt-8 w-full bg-slate-800 hover:bg-slate-700/90 text-white border border-slate-700 py-3 rounded-xl font-semibold transition shadow-md active:scale-[0.99]">
              Edit Profile
            </button>
          </div>

          {/* ==================== RIGHT PANEL: MODULAR DASHBOARD CARDS ==================== */}
          <div className="p-6 md:p-8 flex flex-col justify-between bg-white">
            <div>
              {/* Original font: text-2xl font-bold */}
              <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-3 flex items-center gap-2 tracking-tight">
                Profile Information
              </h2>

              {/* Grid changed to structured left-bordered cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Field 1: Full Name */}
                <div className="bg-slate-50/50 border-l-4 border-indigo-500 rounded-r-xl rounded-l-md p-4 flex items-start gap-3 shadow-sm hover:bg-slate-50 transition-colors">
                  <span className="text-lg mt-0.5">👤</span>
                  <div className="truncate">
                    <p className="text-sm text-slate-400 uppercase tracking-wider font-medium text-[10px]">
                      Full Name
                    </p>
                    <p className="mt-1 font-semibold text-slate-900 text-sm">
                      {userData.name}
                    </p>
                  </div>
                </div>

                {/* Field 2: Email */}
                <div className="bg-slate-50/50 border-l-4 border-sky-500 rounded-r-xl rounded-l-md p-4 flex items-start gap-3 shadow-sm hover:bg-slate-50 transition-colors">
                  <span className="text-lg mt-0.5">✉️</span>
                  <div className="truncate">
                    <p className="text-sm text-slate-400 uppercase tracking-wider font-medium text-[10px]">
                      Email Address
                    </p>
                    <p className="mt-1 font-semibold text-slate-900 text-sm break-all">
                      {userData.email}
                    </p>
                  </div>
                </div>

                {/* Field 3: Department */}
                <div className="bg-slate-50/50 border-l-4 border-amber-500 rounded-r-xl rounded-l-md p-4 flex items-start gap-3 shadow-sm hover:bg-slate-50 transition-colors">
                  <span className="text-lg mt-0.5">🏢</span>
                  <div className="truncate">
                    <p className="text-sm text-slate-400 uppercase tracking-wider font-medium text-[10px]">
                      Department
                    </p>
                    <p className="mt-1 font-semibold text-slate-900 text-sm">
                      {userData.department || "Not Assigned"}
                    </p>
                  </div>
                </div>

                {/* Field 4: Phone */}
                <div className="bg-slate-50/50 border-l-4 border-emerald-500 rounded-r-xl rounded-l-md p-4 flex items-start gap-3 shadow-sm hover:bg-slate-50 transition-colors">
                  <span className="text-lg mt-0.5">📞</span>
                  <div className="truncate">
                    <p className="text-sm text-slate-400 uppercase tracking-wider font-medium text-[10px]">
                      Phone Number
                    </p>
                    <p className="mt-1 font-semibold text-slate-900 text-sm">
                      {userData.phone || "Not Available"}
                    </p>
                  </div>
                </div>

                {/* Field 5: Role */}
                <div className="bg-slate-50/50 border-l-4 border-purple-500 rounded-r-xl rounded-l-md p-4 flex items-start gap-3 shadow-sm hover:bg-slate-50 transition-colors">
                  <span className="text-lg mt-0.5">🛡️</span>
                  <div className="truncate">
                    <p className="text-sm text-slate-400 uppercase tracking-wider font-medium text-[10px]">
                      Security Role
                    </p>
                    <p className="mt-1 font-semibold text-slate-900 text-sm">
                      {userData.role}
                    </p>
                  </div>
                </div>

                {/* Field 6: Joined Date */}
                <div className="bg-slate-50/50 border-l-4 border-rose-500 rounded-r-xl rounded-l-md p-4 flex items-start gap-3 shadow-sm hover:bg-slate-50 transition-colors">
                  <span className="text-lg mt-0.5">📅</span>
                  <div className="truncate">
                    <p className="text-sm text-slate-400 uppercase tracking-wider font-medium text-[10px]">
                      Joined On
                    </p>
                    <p className="mt-1 font-semibold text-slate-900 text-sm">
                      {joinedDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium About Card Section Box */}
            <div className="mt-6 bg-slate-50 border border-slate-200/60 rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2 text-base">
                <span>📝</span> About Session Context
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {userData.name} is currently working as a{" "}
                <span className="text-slate-900 font-semibold">
                  {userData.role.toLowerCase()}
                </span>{" "}
                in the organization. Current access status is recognized as{" "}
                <span className="text-slate-900 font-semibold">
                  {userData.access.toLowerCase()}
                </span>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
