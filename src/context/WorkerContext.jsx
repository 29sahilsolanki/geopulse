"use client";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const WorkerContext = createContext();
export const WorkerProvider = ({ children }) => {
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

  const punchClockIn = async (clockInInput) => {
    const url = "/api/clock-in";
    try {
      const locationName = await getAddressFromCoords(
        parseFloat(clockInInput.latitudeIn),
        parseFloat(clockInInput.longitudeIn),
      );
      console.log(locationName);
      const res = await axios.post(url, { ...clockInInput, locationName });
      console.log(res?.data);
      getUserDetails();
    } catch (error) {
      console.log(error?.response?.data);
    }
  };

  const punchClockOut = async (clockOutInput) => {
    const url = "/api/clock-out";
    try {
      const locationName = await getAddressFromCoords(
        parseFloat(clockOutInput.latitudeOut),
        parseFloat(clockOutInput.longitudeOut),
      );
      console.log(locationName);
      const res = await axios.post(url, { ...clockOutInput, locationName });
      console.log(res?.data);
      getUserDetails();
    } catch (error) {
      console.log(error?.response?.data);
    }
  };

  //shift details of workers
  const [shiftDetails, setShiftDetails] = useState([]);
  const [userData, setUserData] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const getUserDetails = async () => {
    const url = "/api/worker-details";
    try {
      setUserLoading(true);
      const res = await axios.get(url);
      setUserData(res?.data?.dbUser);
      setShiftDetails(res?.data?.shiftDetails);
      console.log(res?.data);
    } catch (error) {
      console.log(error?.response?.data);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <WorkerContext.Provider
      value={{
        punchClockIn,
        punchClockOut,
        shiftDetails,
        userData,
        userLoading,
        setUserLoading,
      }}
    >
      {children}
    </WorkerContext.Provider>
  );
};

export const useWorker = () => useContext(WorkerContext);
