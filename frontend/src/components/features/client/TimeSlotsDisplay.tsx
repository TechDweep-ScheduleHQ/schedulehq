import { useState } from "react";
import type { Availability } from "../../../redux/types/auth";
import { useAppSelector } from "../../../redux/store/hook";
import { useSearchParams } from "react-router-dom";

const TimeSlotsDisplay: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const clockFormate = searchParams.get("clockFormate") || "12";
  const selectedDay =
    new Date(searchParams.get("date") || new Date()) || new Date();

  const durationMinutes = Number(searchParams.get("duration") || "45");

  // Find the availability for the selected day
  const availability = user?.availabilities?.find(
    (a: Availability) =>
      a.day.toLowerCase() === selectedDay.toISOString().toLowerCase() &&
      a.enabled
  );

  if (!availability) return <div>No slots available</div>;

  // Helper: convert "HH:mm" string to minutes
  const timeStrToMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  // Helper: format time string
  const formatTime = (minutes: number) => {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    if (clockFormate === "12") {
      const ampm = hour >= 12 ? "pm" : "am";
      const hour12 = hour % 12 === 0 ? 12 : hour % 12;
      return `${hour12}:${minute.toString().padStart(2, "0")}${ampm}`;
    } else {
      return `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
    }
  };

  // Generate all time slots based on duration
  const slots: string[] = [];
  availability.timeSlots.forEach((slot) => {
    const start = timeStrToMinutes(slot.start);
    const end = timeStrToMinutes(slot.end);
    for (let t = start; t + durationMinutes <= end; t += durationMinutes) {
      slots.push(formatTime(t));
    }
  });

  return (
    <div className="overflow-y-auto flex-1 space-y-2">
      {slots.map((time) => (
        <button
          key={time}
          onClick={() => setSelectedTime(time)}
          className={`flex items-center justify-center gap-2 px-3 py-2 w-full max-w-[90%] rounded-lg text-sm transition cursor-pointer
            ${
              selectedTime === time
                ? "bg-blue-600 text-white"
                : "bg-[var(--darkGray-bg)] hover:bg-[var(--input-bg)]"
            }`}
        >
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          <span>{time}</span>
        </button>
      ))}
    </div>
  );
};

export default TimeSlotsDisplay;
