import React from "react";

const EventListSkeleton: React.FC = () => {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-16 bg-[var(--input-bg)] rounded-md"></div>
      ))}
    </div>
  );
};

export default EventListSkeleton;