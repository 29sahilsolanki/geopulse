"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";

const ManagerContext = createContext();

export const ManagerProvider = ({ children }) => {
  const queryClient = useQueryClient();

  // -------------------- Fetch Manager Details --------------------
  const { data: managerServerData, isLoading: loadingManager } = useQuery({
    queryKey: ["manager-profile"],
    queryFn: async () => {
      const url = "/api/manager/fetch-manager";
      const res = await axios.get(url);
      return res.data;
    },
  });

  // Safely extract manager fields
  const manager = managerServerData?.dbUser || null;
  const locationPerimeter = managerServerData?.locationPerimeter || null;

  // -------------------- Fetch Workers --------------------//
  const { data: workersList = [], isLoading: loadingWorkers } = useQuery({
    queryKey: ["manager-workers"],
    queryFn: async () => {
      const url = "/api/manager/fetch-workers";
      const res = await axios.get(url);
      return res?.data?.workers.filter((p) => p.role !== "MANAGER") || [];
    },
    enabled: !!manager,
  });

  // -------------------- manager geofencing --------------------//
  const geoFencingMutation = useMutation({
    mutationFn: async (parameter) => {
      const url = "/api/manager/set-geofence";
      const res = await axios.put(url, parameter);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(
        data?.message || "Geofence perimeter updated successfully!",
      );

      queryClient.invalidateQueries({ queryKey: ["manager-profile"] });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update fencing setup",
      );
      console.log(error);
    },
  });

  // Wrapper function for geofence
  const setGeoFencing = (parameter, options) => {
    geoFencingMutation.mutate(parameter, options);
  };

  //---------------------Grant permission---------------------//
  const grantAccessMutation = useMutation({
    mutationFn: async (id) => {
      const url = `/api/manager/access-handler/${id}`;
      const res = await axios.delete(url);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Access parameter updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["manager-workers"] });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to change worker permission",
      );
      console.log(error);
    },
  });

  // Wrapper Function Of Grant Access
  const handleAccessChange = (id) => {
    grantAccessMutation.mutate(id);
  };

  //update manager details
  const updateDetailsMutation = useMutation({
    mutationFn: async (details) => {
      const url = "/api/manager/update-details";
      const res = await axios.post(url, details);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Details updated successfully..!!");

      queryClient.invalidateQueries({ queryKey: ["manager-profile"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Update failed..!!");
    },
  });

  // wrapper function of manager details
  const updateManagerDetails = (details, options) => {
    updateDetailsMutation.mutate(details, options);
  };

  //----------------------worker image update-----------------------//
  const updateImageMutation = useMutation({
    mutationFn: async (formData) => {
      const url = "/api/manager/update-image";
      const res = await axios.put(url, formData);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Profile Image updated successfully..!!");

      queryClient.invalidateQueries({ queryKey: ["manager-profile"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Image upload failed..!!");
      console.log(error);
    },
  });

  // wrapper function of manager image
  const updateProfileImage = (formData, options) => {
    updateImageMutation.mutate(formData, options);
  };

  // -------------------- 3. Map State Coordinates --------------------//
  const [location, setLocaton] = useState(null);
  const [searchCoords, setSearchCoords] = useState([28.7041, 77.1025]); // Default: Delhi
  const [clickCoords, setClickCoords] = useState(null);

  //-----------------------end page-----------------------//
  return (
    <ManagerContext.Provider
      value={{
        manager,
        loadingManager,
        workers: workersList,
        loadingWorkers,
        locationPerimeter,
        location,
        setLocaton,
        searchCoords,
        setSearchCoords,
        clickCoords,
        setClickCoords,
        setGeoFencing,
        isSettingGeofence: geoFencingMutation.isPending,
        handleAccessChange,
        isProcessingAccess: grantAccessMutation.isPending,
        updateManagerDetails,
        isSavingDetails: updateDetailsMutation.isPending,
        updateProfileImage,
        isUploadingImage: updateImageMutation.isPending,
      }}
    >
      {children}
    </ManagerContext.Provider>
  );
};

export const useManager = () => useContext(ManagerContext);
