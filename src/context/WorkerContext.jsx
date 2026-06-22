"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const WorkerContext = createContext();

export const WorkerProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const getAddressFromCoords = async (lat, lng) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      );
      return res?.data?.display_name;
    } catch (error) {
      console.log(error?.response?.data);
      return null;
    }
  };

  //--------------------Punch Clock In Mutation-------------------//
  const clockInMutation = useMutation({
    mutationFn: async (clockInInput) => {
      const url = "/api/worker/clock-in";
      const locationName = await getAddressFromCoords(
        parseFloat(clockInInput.latitudeIn),
        parseFloat(clockInInput.longitudeIn),
      );
      const res = await axios.post(url, { ...clockInInput, locationName });
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

  // wrapper function of clockout
  const punchClockIn = (clockInInput, options) => {
    clockInMutation.mutate(clockInInput, options);
  };

  //------------------Punch Clock Out Mutation--------------------//
  const clockOutMutation = useMutation({
    mutationFn: async (clockOutInput) => {
      const url = "/api/worker/clock-out";
      const locationName = await getAddressFromCoords(
        parseFloat(clockOutInput.latitudeOut),
        parseFloat(clockOutInput.longitudeOut),
      );
      const res = await axios.post(url, { ...clockOutInput, locationName });
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

  // wrapper function of clockout
  const punchClockOut = (clockOutInput, options) => {
    clockOutMutation.mutate(clockOutInput, options);
  };

  //------------------Fetch worker details---------------------//
  const { data: workerData, isLoading: workerLoading } = useQuery({
    queryKey: ["worker-details"],
    queryFn: async () => {
      const url = "/api/worker/worker-details";
      const res = await axios.get(url);
      return res.data;
    },
  });
  //variable extraction
  const userData = workerData?.dbUser || null;
  const shiftDetails = workerData?.shiftDetails || [];

  //---------------------Update worker details-------------------//
  const updateDetailsMutation = useMutation({
    mutationFn: async (details) => {
      const url = "/api/worker/update-details";
      const res = await axios.post(url, details);
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

  // wrapper function of worker details
  const updateWorkerDetails = (details, options) => {
    updateDetailsMutation.mutate(details, options);
  };

  //----------------------worker image update-----------------------//
  const updateImageMutation = useMutation({
    mutationFn: async (formData) => {
      const url = "/api/worker/update-image";
      const res = await axios.put(url, formData);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Profile Image updated successfully..!!");

      queryClient.invalidateQueries({ queryKey: ["worker-details"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Image upload failed..!!");
      console.log(error);
    },
  });

  // wrapper function of worker details
  const updateProfileImage = (formData, options) => {
    updateImageMutation.mutate(formData, options);
  };

  //----------------------end file----------------------//
  return (
    <WorkerContext.Provider
      value={{
        punchClockIn,
        isClockingIn: clockInMutation.isPending,
        punchClockOut,
        isClockingOut: clockOutMutation.isPending,
        shiftDetails,
        userData,
        workerLoading,
        updateWorkerDetails,
        isSavingDetails: updateDetailsMutation.isPending,
        updateProfileImage,
        isUploadingImage: updateImageMutation.isPending,
      }}
    >
      {children}
    </WorkerContext.Provider>
  );
};

export const useWorker = () => useContext(WorkerContext);
