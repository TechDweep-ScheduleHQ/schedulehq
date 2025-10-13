import React, { useState, useEffect, useRef } from "react";
import AddEventTypeModal from "./AddEventTypeModal";
import {
  MoreHorizontal,
  Edit,
  Copy,
  Code,
  Trash2,
  Search,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from "../../../../../redux/store/hook";
import { toast } from "react-toastify";

interface EventType {
  id: number;
  title: string;
  slug: string;
  duration: number;
  hidden?: boolean;
  active: boolean;
}

const EventTypesPage: React.FC = () => {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useAppSelector((state) => state.auth);

  const handleCopy = async (slug: string) => {
    try {
      await navigator.clipboard.writeText(
        `${import.meta.env.VITE_FRONTEND_URL}/${user?.username}/${slug}`
      );
      toast.success("Link Copied!")
    } catch (error) {console.log(error);}
  };

  const handleOpen = (slug: string) => {
    const url = `${import.meta.env.VITE_FRONTEND_URL}/${
      user?.username
    }/${slug}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    setTimeout(() => {
      setEventTypes([
        {
          id: 1,
          title: "15 Min Meeting",
          slug: "15min",
          duration: 15,
          active: true,
        },
        {
          id: 2,
          title: "30 Min Meeting",
          slug: "30min",
          duration: 30,
          active: true,
        },
        { id: 3, title: "Hello", slug: "hello", duration: 15, active: true },
        {
          id: 4,
          title: "Secret Meeting",
          slug: "secret",
          duration: 15,
          hidden: true,
          active: false,
        },
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  const handleSubmit = (values: any) => {
    setEventTypes((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        title: values.title,
        slug: values.url.split("/").pop() || "new",
        duration: values.duration,
        active: true,
      },
    ]);
  };

  return (
    <div className="text-[var(--primary-text)]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Event Types</h1>
            <p className="text-[var(--lightGray-text)] text-sm mt-1">
              Create events to share for people to book on your calendar.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1 bg-[var(--button-bg)] text-[var(--button-text)] rounded-lg hover:bg-[var(--button-hover-bg)] transition flex items-center gap-2 cursor-pointer"
          >
            <span className="text-lg font-semibold">+</span> New
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6 w-[80%] max-w-sm">
          <Search
            size={18}
            className="absolute left-3 top-2.5 text-[var(--lightGray-text)] pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 rounded-md bg-[var(--input-bg)] border border-[var(--borderGray-bg)] text-white placeholder-[var(--lightGray-text)] focus:border-[var(--border-bg)] outline-none"
          />
        </div>

        {/* Event List or Skeleton */}
        <div className="bg-[var(--secondary-bg)] rounded-xl border border-[var(--borderGray-bg)] overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-4 animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-[var(--input-bg)] rounded-md"
                ></div>
              ))}
            </div>
          ) : eventTypes.length > 0 ? (
            eventTypes.map((event) => (
              <div
                key={event.id}
                className="flex justify-between items-center border-b border-[var(--borderGray-bg)] last:border-none px-5 py-4 hover:bg-[var(--card-bg)] transition"
              >
                <div>
                  <h2 className="font-medium">
                    {event.title}{" "}
                    {event.hidden && (
                      <span className="text-xs bg-[var(--borderGray-bg)] text-[var(--lightGray-text)] px-2 py-[2px] rounded ml-2">
                        Hidden
                      </span>
                    )}
                  </h2>
                  <p className="text-[var(--lightGray-text)] text-sm">
                    /akash-bhaumik-ca1alf/{event.slug}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-sm text-[var(--lightGray-text)]">
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
                      {event.duration}m
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {!event?.active && (
                    <span className="px-2 py-1 rounded-lg bg-[var(--primary-bg)] text-[var(--primary-text)] text-sm">
                      Hidden
                    </span>
                  )}
                  {/* Toggle */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={event.active}
                      onChange={() =>
                        setEventTypes((prev) =>
                          prev.map((e) =>
                            e.id === event.id ? { ...e, active: !e.active } : e
                          )
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:bg-white transition-all"></div>
                    <div className="absolute left-0.5 top-0.5 bg-black w-4 h-4 rounded-full peer-checked:translate-x-5 transition-transform"></div>
                  </label>

                  {/* Action Buttons */}
                  <div className="flex gap-2 relative cursor-pointer">
                    <button
                      onClick={() => handleOpen(event.slug)}
                      className="p-2 rounded-md hover:bg-[var(--input-bg)]"
                    >
                      <ExternalLink size={18} />
                    </button>
                    <button
                      onClick={() => handleCopy(event.slug)}
                      className="p-2 rounded-md hover:bg-[var(--input-bg)] cursor-pointer"
                    >
                      <Copy size={18} />
                    </button>

                    {/* Menu Button */}
                    <EventMenu
                      onEdit={() => alert(`Edit ${event.title}`)}
                      onDuplicate={() => alert(`Duplicate ${event.title}`)}
                      onEmbed={() => alert(`Embed ${event.title}`)}
                      onDelete={() => alert(`Delete ${event.title}`)}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-[var(--lightGray-text)]">
              No more results
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <AddEventTypeModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default EventTypesPage;

/* -------------------- Event Menu -------------------- */
const EventMenu = ({
  onEdit,
  onDuplicate,
  onEmbed,
  onDelete,
}: {
  onEdit: () => void;
  onDuplicate: () => void;
  onEmbed: () => void;
  onDelete: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-md hover:bg-[var(--input-bg)]"
      >
        <MoreHorizontal size={18} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-44 bg-[var(--secondary-bg)] border border-[var(--borderGray-bg)] rounded-xl shadow-lg overflow-hidden z-50"
          >
            <MenuItem icon={<Edit size={16} />} label="Edit" onClick={onEdit} />
            <MenuItem
              icon={<Copy size={16} />}
              label="Duplicate"
              onClick={onDuplicate}
            />
            <MenuItem
              icon={<Code size={16} />}
              label="Embed"
              onClick={onEmbed}
            />
            <MenuItem
              icon={<Trash2 size={16} className="text-red-400" />}
              label="Delete"
              onClick={onDelete}
              danger
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MenuItem = ({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 w-full text-left text-sm transition ${
      danger
        ? "text-red-400 hover:bg-red-950/40"
        : "text-zinc-300 hover:bg-[var(--input-bg)]"
    }`}
  >
    {icon}
    {label}
  </button>
);
