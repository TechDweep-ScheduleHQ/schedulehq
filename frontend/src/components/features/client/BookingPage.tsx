import React, { useEffect, useState } from "react";
import { Globe, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";
import { Autocomplete, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hook";
import { fetchTimezones } from "../../../redux/slices/authSlice";
import { toast } from "react-toastify";
import TimeSlotsDisplay from "./TimeSlotsDisplay";

export const BookingPage: React.FC = () => {
  // ---------- STATE ----------
  const { timezoneStatus, timezones, error, user } = useAppSelector(
    (state) => state.auth
  );
  const today = new Date();
  console.log(user);
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );
  // const [selectedDuration, setSelectedDuration] = useState<string>("45m");
  const [timezone, setTimezone] = useState<string | undefined>(user?.timezone);
  const { username, event } = useParams<{ username: string; event: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const clockFormate = searchParams.get("clockFormate") || "12";
  const selectedDuration = Number(searchParams.get("duration") || "45");
  const selectedDate = new Date(searchParams.get("date") || new Date()) || new Date();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (timezoneStatus === "idle") {
      dispatch(fetchTimezones());
    }
  }, [dispatch, timezoneStatus]);

  // toaster notification
  useEffect(() => {
    if (timezoneStatus === "failed") {
      toast.error(error || "Failed to fetch Timezones!");
    }
  }, [timezoneStatus, error]);

  const durations: number[] = [10, 45, 50];

  // ---------- EFFECT ----------
  useEffect(() => {
    // Default select: next working day (not Sat/Sun)
    const next = new Date(today);
    next.setDate(today.getDate() + 1);
    while ([0, 6].includes(next.getDay())) next.setDate(next.getDate() + 1);
    setSearchParams({ date: next.toString() });
  }, [username, event]);

  // ---------- HELPERS ----------
  const getDaysInMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  };

  const days = getDaysInMonth(currentMonth, currentYear);

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  const getMonthName = (m: number) =>
    new Date(currentYear, m).toLocaleString("default", { month: "long" });

  // ---------- HANDLERS ----------
  const handleSelectDay = (date: Date) => {
    // disable past days
    const isPast =
      date <= new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isWeekend = [0, 6].includes(date.getDay());
    if (isPast || isWeekend) return;
    console.log(date);
    setSearchParams({ date: date.toString() });
  };

  const handleSelectDuration = (duration: number) =>
    setSearchParams({ duration: duration.toString() });

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handlePrevMonth = () => {
    // prevent navigating before current month
    if (
      currentYear === today.getFullYear() &&
      currentMonth === today.getMonth()
    )
      return;

    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  // ---------- RENDER ----------
  return (
    <div className="min-h-screen bg-[var(--primary-bg)] text-[var(--primary-text)] flex flex-col">
      <div className="flex flex-1 w-full max-h-[65vh] max-w-[70%] mx-auto mt-10 rounded-2xl overflow-hidden bg-[var(--secondary-bg)] shadow-lg">
        {/* ---------------- LEFT PANEL ---------------- */}
        <div className="w-1/3 px-10 py-6 flex flex-col gap-4 bg-[var(--card-bg)] border-r border-[var(--borderGray-bg)]">
          <div className="flex flex-col gap-2">
            <div className="w-12 h-12 rounded-full bg-gray-500" />
            <p className="text-sm text-[var(--lightGray-text)]">
              Rohit Chhabra
            </p>
            <p className="text-xl font-semibold">Secret Meeting</p>
          </div>

          {/* Duration Selector */}
          <div className="flex items-center gap-4 border-[var(--borderGray-bg)] text-[var(--lightGray-text)]">
            <Clock size={18} />
            <div className="flex gap-2 justify-center border px-2 py-1 rounded-xl">
              {durations.map((duration) => (
                <button
                  key={duration.toString()}
                  onClick={() => handleSelectDuration(duration)}
                  className={`px-3 py-1 text-sm cursor-pointer rounded-md transition ${
                    selectedDuration === duration
                      ? "bg-[var(--button-bg)] text-[var(--button-text)]"
                      : "text-[var(--lightGray-text)]"
                  }`}
                >
                  {`${duration}m`}
                </button>
              ))}
            </div>
          </div>

          {/* Meeting Platform */}
          <div className="flex items-center gap-2 text-[var(--lightGray-text)]">
            <img className="h-6" src="/zoom.png" alt="" />
            <span>Zoom</span>
          </div>

          {/* Timezone */}
          <div className="flex items-center gap-2 text-[var(--lightGray-text)] w-full">
            <Globe size={18} />
            <div className="w-2/3">
              <Autocomplete
                options={timezones.length > 0 ? timezones : ["Asia/Kolkata"]}
                value={timezone}
                onChange={(_, newValue) =>
                  setTimezone(newValue || "Asia/Kolkata")
                }
                // disableClearable
                ListboxProps={{
                  sx: {
                    backgroundColor: "var(--primary-bg)",
                    color: "var(--primary-text)",
                  },
                }}
                renderOption={(props, option) => (
                  <li {...props} style={{ whiteSpace: "normal" }}>
                    {" "}
                    {option}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Timezone"
                    variant="outlined"
                    fullWidth
                    sx={{
                      backgroundColor: "var(--card-bg)",
                      borderRadius: "0.25rem",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { border: "none" },
                        "&.Mui-focused fieldset": { border: "none" },
                      },
                      input: {
                        color: "white",
                        whiteSpace: "normal",
                      },
                      "& .MuiAutocomplete-clearIndicator": {
                        color: "var(--primary-text)",
                      },
                      "& .MuiAutocomplete-popupIndicator": {
                        color: "white",
                      },
                    }}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* ---------------- MIDDLE PANEL (Calendar) ---------------- */}
        <div className="w-2/5 p-6 flex flex-col border-r border-[var(--borderGray-bg)]">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {getMonthName(currentMonth)} {currentYear}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handlePrevMonth}
                disabled={
                  currentYear === today.getFullYear() &&
                  currentMonth === today.getMonth()
                }
                className={`p-2 rounded-md transition ${
                  currentYear === today.getFullYear() &&
                  currentMonth === today.getMonth()
                    ? "cursor-not-allowed opacity-40"
                    : "hover:bg-[var(--darkGray-bg)]  cursor-pointer"
                }`}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-md hover:bg-[var(--darkGray-bg)] cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
              <div
                key={d}
                className="text-center text-sm text-[var(--lightGray-text)]"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {/* Empty placeholders for starting weekday */}
            {Array.from({
              length: new Date(currentYear, currentMonth, 1).getDay(),
            }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {days.map((date) => {
              const isToday = isSameDay(date, today);
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              const isWeekend = [0, 6].includes(date.getDay());
              const isPast =
                date <=
                new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate()
                );

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => handleSelectDay(date)}
                  disabled={isPast}
                  className={`relative rounded-lg py-3 text-sm font-medium transition ${
                    isSelected
                      ? "bg-[var(--button-bg)] text-[var(--button-text)]"
                      : "bg-[var(--darkGray-bg)] hover:bg-[var(--input-bg)]"
                  } ${
                    isToday
                      ? "bg-[var(--secondary-bg)]  cursor-not-allowed"
                      : isPast
                      ? "opacity-40 cursor-not-allowed"
                      : isWeekend
                      ? "text-red-400 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  {date.getDate()}
                  {isToday && (
                    <span className="absolute left-1/2 -bottom-0 transform -translate-x-1/2 w-1.5 h-1.5 bg-[var(--lightGray-text)] rounded-full"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ---------------- RIGHT PANEL (Time Slots) ---------------- */}
        <div className="w-1/4 p-6 flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold">
              {selectedDate
                ? `${
                    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                      selectedDate.getDay()
                    ]
                  } ${selectedDate.getDate()}`
                : "Select a day"}
            </p>
            <div className="flex gap-2 p-1 bg-[var(--primary-bg)] rounded-xl">
              <button
                onClick={() => setSearchParams({ clockFormate: "12" })}
                className={`px-2 py-1 text-sm rounded-md text-[var(--primary-text)] cursor-pointer ${
                  clockFormate === "12" && "bg-[var(--secondary-bg)]"
                }`}
              >
                12h
              </button>
              <button
                onClick={() => setSearchParams({ clockFormate: "24" })}
                className={`px-2 py-1 text-sm rounded-md text-[var(--primary-text)] cursor-pointer ${
                  clockFormate === "24" && "bg-[var(--secondary-bg)]"
                }`}
              >
                24h
              </button>
            </div>
          </div>

          {/* Time Slots */}
          <div className="overflow-y-auto flex-1 space-y-2">
            <TimeSlotsDisplay />
          </div>
        </div>
      </div>
    </div>
  );
};
