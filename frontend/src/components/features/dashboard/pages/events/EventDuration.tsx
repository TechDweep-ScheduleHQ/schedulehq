import React from "react";

interface EventDurationProps {
  duration: string;
}

const EventDuration: React.FC<EventDurationProps> = ({ duration }) => {
  return (
    <span className="flex items-center gap-1 bg-[var(--input-bg)] px-2 py-1 rounded-md text-xs">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      {duration}m
    </span>
  );
};

export default EventDuration;