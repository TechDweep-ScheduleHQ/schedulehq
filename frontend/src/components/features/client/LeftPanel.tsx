import React, { useState } from "react";
import { Globe, Clock } from "lucide-react";
import { Autocomplete, TextField } from "@mui/material";
import { useAppSelector } from "../../../redux/store/hook";
import { useSearchParams } from "react-router-dom";

const LeftPanel: React.FC = () => {
  const { user, timezones } = useAppSelector((state) => state.auth);
  const [timezone, setTimezone] = useState<string | undefined>(user?.timezone);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDuration = Number(searchParams.get("duration") || "45");

  const durations: number[] = [10, 45, 50];

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    setSearchParams(params);
  };

  const handleSelectDuration = (duration: number) =>
    setParam("duration", duration.toString());

  return (
    <div className="w-full md:w-1/3 px-10 py-6 flex flex-col gap-4 bg-[var(--card-bg)] border-r border-[var(--borderGray-bg)]">
      {/* Profile Section */}
      <div className="flex flex-col gap-2">
        <div className="w-12 h-12 rounded-full bg-gray-500" />
        <p className="text-sm text-[var(--lightGray-text)]">
          {user?.username || "User"}
        </p>
        <p className="text-xl font-semibold">Secret Meeting</p>
      </div>

      {/* Duration Selector */}
      <div className="flex items-center gap-4 text-[var(--lightGray-text)]">
        <Clock size={18} />
        <div className="flex gap-2 justify-center border px-2 py-1 rounded-xl">
          {durations.map((duration) => (
            <button
              key={duration}
              onClick={() => handleSelectDuration(duration)}
              className={`px-3 py-1 text-sm rounded-md transition ${
                selectedDuration === duration
                  ? "bg-[var(--button-bg)] text-[var(--button-text)]"
                  : "text-[var(--lightGray-text)] cursor-pointer"
              }`}
            >
              {duration}m
            </button>
          ))}
        </div>
      </div>

      {/* Meeting Platform */}
      <div className="flex items-center gap-2 text-[var(--lightGray-text)]">
        <img className="h-6" src="/zoom.png" alt="zoom" />
        <span>Zoom</span>
      </div>

      {/* Timezone Selector */}
      <div className="flex items-center gap-2 text-[var(--lightGray-text)] w-full">
        <Globe size={18} />
        <div className="w-2/3">
          <Autocomplete
            options={timezones.length > 0 ? timezones : ["Asia/Kolkata"]}
            value={timezone}
            onChange={(_, newValue) => setTimezone(newValue || "Asia/Kolkata")}
            disableClearable
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
  );
};

export default LeftPanel;
