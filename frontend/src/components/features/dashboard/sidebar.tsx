import type React from "react";
import { CalendarCheck, CalendarDays, Settings, X, LogOut, BadgeDollarSign, ChevronsRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Event from "./pages/events";
import Meeting from "./pages/meeting";
import Availability from "./pages/availability";
import Setting from "./pages/setting";

type NavKey = "events" | "mettings" | "availability" |"settings";

const navItems: { key: NavKey; label: string; icon: React.ReactNode }[] = [
  { key: "events", label: "Events", icon: <CalendarCheck size={20} aria-hidden="true" className="shrink-0" /> },
  { key: "mettings", label: "Meetings", icon: <CalendarDays size={20} aria-hidden="true" className="shrink-0" /> },
  { key: "availability", label: "Availability", icon: <CalendarDays size={20} aria-hidden="true" className="shrink-0" /> },
  { key: "settings", label: "Setting", icon: <Settings size={20} aria-hidden="true" className="shrink-0" /> },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState<NavKey>("events");

  return (
    <div className="min-h-screen w-full bg-primary-bg text-primary-text">
      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          aria-label="Sidebar"
          animate={{ width: collapsed ? 72 : 280 }}
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative z-10 flex h-screen shrink-0 flex-col border-r text-primary-text border-[color:var(--borderGray-bg)] bg-[color:var(--secondary-bg)]"
        >
          {/* Header */}
          <div className="sticky top-0 z-30 flex h-16 items-center justify-between px-2 bg-[color:var(--secondary-bg)]">
            <button
              aria-label="Navigate"
              className="rounded-md p-2 text-white hover:text-primary-text flex"
            >
              <BadgeDollarSign size={30} aria-hidden="true" /> 
            </button>
            <button
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => {
                const newCollapsed = !collapsed;
                setCollapsed(newCollapsed);
              }}
              className="rounded-md p-2  hover:text-primary-text"
              style={{ position: "relative", zIndex: 40 }}
            >
              {collapsed ? <ChevronsRight size={28} className="ml-3" aria-hidden="true" /> : <X size={20} aria-hidden="true" className="text-white"/>}
            </button>
          </div>

          <nav className="px-2">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = active === item.key;
                return (
                  <li key={item.key}>
                    <button
                      onClick={() => setActive(item.key)}
                      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors text-[color:var(--lightGray-text)] hover:text-primary-text ${
                        isActive
                          ? "bg-[color:var(--borderGray-bg)] text-primary-text"
                          : "hover:bg-[color:var(--darkGray-bg)]"
                      }`}
                    >
                      <span className="text-primary-text">{item.icon}</span>
                      <span className={`text-sm ${collapsed ? "hidden" : ""}`}>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-auto border-t border-[color:var(--borderGray-bg)] p-4">
            <button
              aria-label="Logout"
              className={`${
                collapsed
                  ? "mx-auto flex h-9 w-9 items-center justify-center rounded-md bg-[var(--white-bg)]"
                  : "w-full rounded-lg px-4 py-2 text-sm font-medium flex items-center bg-[var(--white-bg)] justify-center gap-2"
              } transition-colors bg-button-bg text-button-text hover:bg-button-hover-bg disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              <LogOut size={18} aria-hidden="true" />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </motion.aside>

        {/* Main content */}
        <main className="relative flex-1 min-h-screen bg-[var(--white-bg)]  p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-5xl"
            >
              {active === "events" && <Event />}
              {active === "mettings" && <Meeting />}
              {active === "availability" && <Availability />}
              {active === "settings" && <Setting />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}