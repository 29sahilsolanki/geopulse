"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const getAddressFromCoords = async (lat, lng) => {
  try {
    const res = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    );
    return res?.data?.display_name;
  } catch (error) {
    console.log("Geocoding Error:", error?.response?.data);
    return null;
  }
};

// -------------------------------------------------------------
// 1️⃣ HOOK: Worker Details aur Shift History fetch karne ke liye
// -------------------------------------------------------------
export const useWorkerDetails = () => {
  return useQuery({
    queryKey: ["worker-details"],
    queryFn: async () => {
      const res = await axios.get("/api/worker/worker-details");
      return res.data;
    },
    // select function se data ko pehle hi extract kar lete hain
    select: (data) => ({
      userData: data?.dbUser || null,
      shiftDetails: data?.shiftDetails || [],
    }),
  });
};

// -------------------------------------------------------------
// 2️⃣ MUTATION HOOK: Clock In (Shift Start) karne ke liye
// -------------------------------------------------------------
export const useClockIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clockInInput) => {
      const locationName = await getAddressFromCoords(
        parseFloat(clockInInput.latitudeIn),
        parseFloat(clockInInput.longitudeIn),
      );
      const res = await axios.post("/api/worker/clock-in", {
        ...clockInInput,
        locationName,
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Clocked In successfully!");
      // 🔥 Cache refresh trigger: Shifts list instantly update hogi
      queryClient.invalidateQueries({ queryKey: ["worker-details"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Clock In failed");
    },
  });
};

// -------------------------------------------------------------
// 3️⃣ MUTATION HOOK: Clock Out (Shift End) karne ke liye
// -------------------------------------------------------------
export const useClockOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clockOutInput) => {
      const locationName = await getAddressFromCoords(
        parseFloat(clockOutInput.latitudeOut),
        parseFloat(clockOutInput.longitudeOut),
      );
      const res = await axios.post("/api/worker/clock-out", {
        ...clockOutInput,
        locationName,
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Clocked Out successfully!");
      queryClient.invalidateQueries({ queryKey: ["worker-details"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Clock Out failed");
    },
  });
};

// -------------------------------------------------------------
// 4️⃣ MUTATION HOOK: Worker profile details update karne ke liye
// -------------------------------------------------------------
export const useUpdateWorkerDetails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (details) => {
      const res = await axios.post("/api/worker/update-details", details);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Details updated successfully..!!");
      queryClient.invalidateQueries({ queryKey: ["worker-details"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Update failed..!!");
    },
  });
};

// -------------------------------------------------------------
// 5️⃣ MUTATION HOOK: Profile Image avatar update karne ke liye
// -------------------------------------------------------------
export const useUpdateProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const res = await axios.put("/api/worker/update-image", formData);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Profile Image updated successfully..!!");
      queryClient.invalidateQueries({ queryKey: ["worker-details"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Image upload failed..!!");
    },
  });
};

// -------------------------------------------------------------
// 6️⃣ HOOK: Active Geofencing Zone fetch karne ke liye
// -------------------------------------------------------------
export const useActiveZone = () => {
  return useQuery({
    queryKey: ["active-zone"],
    queryFn: async () => {
      const res = await axios.get("/api/worker/active-zone");
      return res.data;
    },
    // fallback filter logic: jo bhi key backend se aaye, safely bind ho jaye
    select: (data) => data?.locationPerimeter || data?.activeLocation || null,
  });
};
