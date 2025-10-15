import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const CalendarPanel: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const today = new Date();
  const selectedDate = new Date(searchParams.get("date") || new Date());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

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

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    setSearchParams(params);
  };

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  const handleSelectDay = (date: Date) => {
    if (date <= today || [0, 6].includes(date.getDay())) return;
    setParam("date", date.toISOString());
  };

  const getMonthName = (m: number) =>
    new Date(currentYear, m).toLocaleString("default", { month: "long" });

  return (
    <div className="w-full md:w-2/5 p-6 flex flex-col border-r border-[var(--borderGray-bg)]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {getMonthName(currentMonth)} {currentYear}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() =>
              currentMonth === 0
                ? (setCurrentMonth(11), setCurrentYear((y) => y - 1))
                : setCurrentMonth((m) => m - 1)
            }
            disabled={
              currentYear === today.getFullYear() &&
              currentMonth === today.getMonth()
            }
            className="p-2 rounded-md hover:bg-[var(--darkGray-bg)] disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() =>
              currentMonth === 11
                ? (setCurrentMonth(0), setCurrentYear((y) => y + 1))
                : setCurrentMonth((m) => m + 1)
            }
            className="p-2 rounded-md hover:bg-[var(--darkGray-bg)]"
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
        {Array.from({
          length: new Date(currentYear, currentMonth, 1).getDay(),
        }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((date) => {
          const isToday = isSameDay(date, today);
          const isSelected = isSameDay(date, selectedDate);
          const isWeekend = [0, 6].includes(date.getDay());
          const isPast =
            date <=
            new Date(today.getFullYear(), today.getMonth(), today.getDate());

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
                  ? "bg-[var(--secondary-bg)] cursor-not-allowed"
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
  );
};

export default CalendarPanel;
