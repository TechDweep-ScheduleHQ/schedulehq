import React from "react";
import { useSearchParams } from "react-router-dom";
import TimeSlotsDisplay from "./TimeSlotsDisplay";

const TimeSlotPanel: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const clockFormate = searchParams.get("clockFormate") || "12";
  const selectedDate = new Date(searchParams.get("date") || new Date());

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    setSearchParams(params);
  };

  return (
    <div className="w-full md:w-1/4 p-6 flex flex-col gap-3">
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
            onClick={() => setParam("clockFormate", "12")}
            className={`px-2 py-1 text-sm rounded-md  cursor-pointer ${
              clockFormate === "12" && "bg-[var(--secondary-bg)]"
            }`}
          >
            12h
          </button>
          <button
            onClick={() => setParam("clockFormate", "24")}
            className={`px-2 py-1 text-sm rounded-md  cursor-pointer ${
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
  );
};

export default TimeSlotPanel;
