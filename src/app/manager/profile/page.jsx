"use client";

import { useManager } from "@/context/ManagerContext";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";

export default function Profile() {
  const {
    manager,
    loadingManager,
    updateManagerDetails,
    isSavingDetails,
    updateProfileImage,
    isUploadingImage,
  } = useManager();
  const [editImage, setEditImage] = useState(false);
  const [image, setImage] = useState(null);
  const [editDetails, setEditDetails] = useState(false);
  const [details, setDetails] = useState({
    name: "",
    department: "",
    phone: "",
  });
  useEffect(() => {
    if (manager) {
      setDetails({
        name: manager.name || "",
        department: manager.department || "GENERAL",
        phone: manager.phone || "",
      });
    }
  }, [manager]);

  if (loadingManager) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
        <p className="text-slate-400 text-sm font-semibold tracking-wider uppercase animate-pulse">
          Loading profile...
        </p>
      </div>
    );
  }

  if (!manager) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-rose-500 text-sm font-bold uppercase tracking-wider">
          Unable to load profile
        </p>
      </div>
    );
  }

  const joinedDate = manager.createdAt
    ? new Date(manager.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "--";

  const handleSaveDetails = () => {
    updateManagerDetails(details, {
      onSuccess: () => {
        setEditDetails(false);
      },
    });
  };

  const handleSaveImage = () => {
    const formData = new FormData();
    formData.append("image", image);
    updateProfileImage(formData, {
      onSuccess: () => {
        setEditImage(false);
        setImage(null);
      },
    });
  };

  return (
    <div className="pt-24 pb-12 px-4 md:px-8 max-w-4xl mx-auto w-full min-h-screen flex flex-col gap-6 text-slate-900">
      {/* ==================== 🌟 TOP HERO BANNER & AVATAR FRAME ==================== */}
      <div className="w-full bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-5 truncate w-full">
            <div className="relative shrink-0">
              <Image
                src={
                  manager.profilePic || "https://cdn.auth0.com/avatars/29.png"
                }
                alt="Profile"
                width={112}
                height={112}
                unoptimized
                className="w-28 h-28 rounded-full object-cover border border-slate-200 shadow-sm bg-slate-50"
              />
              <span className="absolute bottom-1 right-2 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm animate-pulse" />
            </div>

            {editImage ? (
              /* 🟢 CHOOSE FILE STYLING FIXED */
              <div className="flex-1 w-full flex flex-col items-center sm:items-start gap-1">
                <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition shadow-sm active:scale-[0.98]">
                  Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="hidden"
                  />
                </label>
                {image && (
                  <p className="text-xs text-emerald-600 font-medium mt-1">
                    📸 Selected: <span className="font-mono">{image.name}</span>
                  </p>
                )}
              </div>
            ) : (
              <div className="flex-1 w-full truncate">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
                    {manager.name}
                  </h1>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] border border-slate-200/80 font-bold uppercase tracking-wider">
                    {manager.role}
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400 mt-1 truncate">
                  {manager.email}
                </p>
              </div>
            )}
          </div>

          {editImage ? (
            <div className="shrink-0 w-full sm:w-auto">
              <button
                onClick={handleSaveImage}
                disabled={isUploadingImage}
                className="cursor-pointer w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-sm transition active:scale-[0.98]"
              >
                {isUploadingImage ? "Uploading your image..." : "Save Changes"}
              </button>
            </div>
          ) : (
            <div className="shrink-0 w-full sm:w-auto">
              <button
                onClick={() => setEditImage(true)}
                className="cursor-pointer w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-sm transition active:scale-[0.98]"
              >
                Edit Profile Image
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ==================== 📑 CORE BODY CONTENT GRID ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side Status Metric Block */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm h-fit">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
            GeoPulse Software Access
          </span>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-medium text-slate-500">
                Access Permission
              </span>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border ${
                  manager.access === "GRANTED"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                    : "bg-rose-50 text-rose-700 border-rose-200/50"
                }`}
              >
                {manager.access}
              </span>
            </div>
            <div className="flex items-center justify-between pt-0.5">
              <span className="text-xs font-medium text-slate-500">
                Profile Details
              </span>
              <span className="text-xs font-bold text-slate-700">
                Verified ID
              </span>
            </div>
          </div>
        </div>

        {/* Right Dynamic Informational Form Target Grid */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Worker Additional Details
              </h3>
              {editDetails ? (
                <RxCross1
                  onClick={() => setEditDetails(false)}
                  className="text-slate-400 hover:text-slate-600 transition cursor-pointer text-sm"
                />
              ) : (
                <FiEdit
                  onClick={() => setEditDetails(true)}
                  className="text-blue-500 hover:text-blue-700 transition cursor-pointer text-sm"
                />
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 font-medium">
              {/* Field 1: Full Name */}
              {editDetails ? (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    👤 Update Name
                  </span>
                  <input
                    type="text"
                    value={details.name}
                    onChange={(e) =>
                      setDetails({ ...details, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-1.5 outline-none focus:border-indigo-500 text-xs font-semibold text-slate-700 bg-slate-50/50 shadow-inner"
                  />
                </div>
              ) : (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    👤 Full Name
                  </span>
                  <p className="text-xs font-bold text-slate-700">
                    {manager.name}
                  </p>
                </div>
              )}

              {/* Field 2: Static Email */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  ✉️ Communication Email Address
                </span>
                <p className="text-xs font-bold text-slate-700 truncate font-mono">
                  {manager.email}
                </p>
              </div>

              {/* Field 3: Allocated Department */}
              {editDetails ? (
                <div className="sm:border-t sm:border-slate-100/70 sm:pt-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    🏢 Allocated Department
                  </span>
                  <select
                    value={details.department}
                    onChange={(e) =>
                      setDetails({ ...details, department: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-1.5 outline-none focus:border-indigo-500 text-xs font-semibold text-slate-700 bg-slate-50/50 shadow-inner cursor-pointer"
                  >
                    <option value="SOFTWARE">Software</option>
                    <option value="MEDICAL">Medical</option>
                    <option value="TECHNICIAN">Technician</option>
                    <option value="LABORATORY">Laboratory</option>
                    <option value="GENERAL">General</option>
                  </select>
                </div>
              ) : (
                <div className="border-t border-slate-100/70 pt-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    🏢 Allocated Department
                  </span>
                  <p className="text-xs font-bold text-slate-700">
                    {manager.department || "Not Assigned"}
                  </p>
                </div>
              )}

              {/* Field 4: Contact Number */}
              {editDetails ? (
                <div className="sm:border-t sm:border-slate-100/70 sm:pt-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    📞 Update Contact Number
                  </span>
                  <input
                    type="text"
                    value={details.phone}
                    onChange={(e) =>
                      setDetails({ ...details, phone: e.target.value })
                    }
                    placeholder="Enter phone parameter..."
                    className="w-full rounded-xl border border-slate-200 px-3 py-1.5 outline-none focus:border-indigo-500 text-xs font-semibold text-slate-700 bg-slate-50/50 shadow-inner"
                  />
                </div>
              ) : (
                <div className="border-t border-slate-100/70 pt-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    📞 Contact Number
                  </span>
                  <p className="text-xs font-bold text-slate-700">
                    {manager.phone || "Not Available"}
                  </p>
                </div>
              )}

              {/* Field 5: Static Joining Matrix Date */}
              <div className="border-t border-slate-100/70 pt-3.5 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  📅 Company Joining Date
                </span>
                <p className="text-xs font-bold text-slate-700">{joinedDate}</p>
              </div>
            </div>

            {/* Action Save Submit Button inside the details box layer block layout */}
            {editDetails && (
              <div className="border-t border-slate-100 pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveDetails}
                  disabled={isSavingDetails}
                  className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl shadow-sm transition active:scale-[0.98]"
                >
                  {isSavingDetails ? "Saving Details..." : "Save Details"}
                </button>
              </div>
            )}
          </div>

          {/* Context Explanatory Board Section Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 mb-3">
              📝 Important Declaration
            </h3>
            <p className="text-slate-500 leading-relaxed text-xs">
              Your profile is currently active and linked to the live workspace
              tracking matrix. Any updates made to your name, contact wire, or
              department parameters will reflect immediately across management
              maps. Contact support if your assigned role requires adjustments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
