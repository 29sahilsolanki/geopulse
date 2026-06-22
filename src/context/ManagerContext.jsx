"use client";

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
const ManagerContext = createContext();
export const ManagerProvider = ({ children }) => {
  //--------------------fetch manager--------------------//
  const [loadingManager, setLoadingManager] = useState(false);
  const [manager, setManager] = useState(null);
  const [locationPerimeter, setLocationPerimeter] = useState(null);
  const fetchManger = async () => {
    const url = "/api/fetch-manager";
    try {
      setLoadingManager(true);
      const res = await axios.get(url);
      setManager(res?.data?.dbUser);
      console.log(res?.data);
      setLocationPerimeter(res?.data?.locationPerimeter);
    } catch (error) {
      console.log(error?.response?.data);
    } finally {
      setLoadingManager(false);
    }
  };

  useEffect(() => {
    fetchManger();
  }, []);

  //--------------------fetch workers--------------------//
  const [loadingWorkers, setLoadingWorkers] = useState(false);
  const [workers, setWorkers] = useState([]);
  const fetchWorkers = async () => {
    const url = "/api/fetch-workers";
    try {
      setLoadingWorkers(true);
      const res = await axios.get(url);
      setWorkers(res?.data?.workers.filter((p) => p.role !== "MANAGER"));
    } catch (error) {
      console.log(error?.response?.data);
    } finally {
      setLoadingWorkers(false);
    }
  };

  useEffect(() => {
    if (manager) {
      fetchWorkers();
    }
  }, [manager]);

  //------------------coordinates------------------//
  const [location, setLocaton] = useState(null);
  const [searchCoords, setSearchCoords] = useState([28.7041, 77.1025]); // Delhi
  const [clickCoords, setClickCoords] = useState(null);

  //--------------------manage fencing-------------------//
  const setGeoFencing = async (parameter) => {
    const url = "/api/set-geofence";
    try {
      const res = await axios.put(url, parameter);
      console.log(res?.data);
    } catch (error) {
      console.log(error?.response?.data);
    }
  };

  return (
    <ManagerContext.Provider
      value={{
        manager,
        fetchWorkers,
        workers,
        loadingWorkers,
        locationPerimeter,
        setLoadingWorkers,
        location,
        setLocaton,
        searchCoords,
        setSearchCoords,
        clickCoords,
        setClickCoords,
        setGeoFencing,
      }}
    >
      {children}
    </ManagerContext.Provider>
  );
};

export const useManager = () => useContext(ManagerContext);
