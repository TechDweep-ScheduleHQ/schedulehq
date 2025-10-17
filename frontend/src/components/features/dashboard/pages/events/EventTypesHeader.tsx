import React from "react";

interface EventTypesHeaderProps {
  onNewClick: () => void;
}

const EventTypesHeader: React.FC<EventTypesHeaderProps> = ({ onNewClick }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-semibold">Event Types</h1>
        <p className="text-[var(--lightGray-text)] text-sm mt-1">
          Create events to share for people to book on your calendar.
        </p>
      </div>
      <button
        onClick={onNewClick}
        className="px-3 py-1 bg-[var(--button-bg)] text-[var(--button-text)] rounded-lg hover:bg-[var(--button-hover-bg)] transition flex items-center gap-2 cursor-pointer"
      >
        <span className="text-lg font-semibold">+</span> New
      </button>
    </div>
  );
};

export default EventTypesHeader;