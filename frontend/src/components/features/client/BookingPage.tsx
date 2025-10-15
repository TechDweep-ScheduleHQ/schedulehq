import React, { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../../../redux/store/hook";
import { fetchTimezones } from "../../../redux/slices/authSlice";
import { useAppSelector } from "../../../redux/store/hook";
import { toast } from "react-toastify";

import LeftPanel from "./LeftPanel";
import CalendarPanel from "./CalendarPanel";
import TimeSlotPanel from "./TimeSlotPanel";

export const BookingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { timezoneStatus, error } = useAppSelector((state) => state.auth);
  const { username, event } = useParams<{ username: string; event: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // ---------- Fetch Timezones ----------
  useEffect(() => {
    if (timezoneStatus === "idle") dispatch(fetchTimezones());
  }, [dispatch, timezoneStatus]);

  // ---------- Error Toast ----------
  useEffect(() => {
    if (timezoneStatus === "failed") {
      toast.error(error || "Failed to fetch Timezones!");
    }
  }, [timezoneStatus, error]);

  // ---------- Set default date ----------
  useEffect(() => {
    const today = new Date();
    const next = new Date(today);
    next.setDate(today.getDate() + 1);
    while ([0, 6].includes(next.getDay())) next.setDate(next.getDate() + 1);

    const params = new URLSearchParams(searchParams);
    params.set("date", next.toISOString());
    setSearchParams(params);
  }, [username, event]);

  return (
    <div className="min-h-screen bg-[var(--primary-bg)] text-[var(--primary-text)] flex flex-col">
      <div className="flex flex-col md:flex-row flex-1 w-full lg:max-w-[70%] md:max-w-[90%] h-full md:max-h-[70vh] lg:max-h-[65vh] mx-auto mt-10 rounded-2xl overflow-hidden bg-[var(--secondary-bg)] shadow-lg">
        <LeftPanel />
        <CalendarPanel />
        <TimeSlotPanel />
      </div>
    </div>
  );
};

export default BookingPage;
