import React from "react";

interface EventToggleProps {
  checked: boolean;
  onChange: () => void;
}

const EventToggle: React.FC<EventToggleProps> = ({ checked, onChange }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-10 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:bg-white transition-all"></div>
      <div className="absolute left-0.5 top-0.5 bg-black w-4 h-4 rounded-full peer-checked:translate-x-5 transition-transform"></div>
    </label>
  );
};

export default EventToggle;