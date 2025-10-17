import React from "react";
import { Search } from "lucide-react";

interface EventTypesSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const EventTypesSearch: React.FC<EventTypesSearchProps> = ({ value, onChange }) => {
  return (
    <div className="relative mb-6 w-[80%] max-w-sm">
      <Search
        size={18}
        className="absolute left-3 top-2.5 text-[var(--lightGray-text)] pointer-events-none"
      />
      <input
        type="text"
        placeholder="Search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-md bg-[var(--input-bg)] border border-[var(--borderGray-bg)] text-white placeholder-[var(--lightGray-text)] focus:border-[var(--border-bg)] outline-none"
      />
    </div>
  );
};

export default EventTypesSearch;