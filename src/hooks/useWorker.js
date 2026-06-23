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

// Fetch worker details
export const useWorkerDetails = () => {
  return useQuery({
    queryKey: ["worker-details"],
    queryFn: async () => {
      const res = await axios.get("/api/worker/worker-details");
      return res.data;
    },
    select: (data) => ({
      userData: data?.dbUser || null,
      shiftDetails: data?.shiftDetails || [],
    }),
  });
};

//punch clockin
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
      queryClient.invalidateQueries({ queryKey: ["worker-details"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Clock In failed");
    },
  });
};

// punch clock out
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

// update worker details
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

//update worker profile image
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

//fetch geo fencing zone
export const useActiveZone = () => {
  return useQuery({
    queryKey: ["active-zone"],
    queryFn: async () => {
      const res = await axios.get("/api/worker/active-zone");
      return res.data;
    },
    select: (data) => data?.locationPerimeter || data?.activeLocation || null,
  });
};
