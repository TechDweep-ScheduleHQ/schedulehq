import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Copy, Code, Trash2, MoreHorizontal } from "lucide-react";
import { createPortal } from "react-dom";
import DeleteConfirmModal from "./modal/DeleteConfirmModal";

const EventMenu = ({
  onEdit,
  onDuplicate,
  onEmbed,
  onDelete
}: {
  onEdit: () => void;
  onDuplicate: () => void;
  onEmbed: () => void;
  onDelete: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node) &&
        open
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleToggle = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuWidth = 176;
      let left = rect.right - menuWidth;
      if (left < 0) left = 4; // prevent off-screen
      setMenuPosition({
        top: rect.bottom + window.scrollY,
        left,
      });
      setOpen((prev) => !prev);
    }
  };

  const menu = (
    <AnimatePresence>
      {open && (
        <motion.div
          key="menu"
          initial={{ opacity: 0, scale: 0.95, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -5 }}
          transition={{ duration: 0.15 }}
          style={{
            position: "absolute",
            top: menuPosition.top,
            left: menuPosition.left,
            width: 176,
          }}
          className="bg-[var(--secondary-bg)] border border-[var(--borderGray-bg)] rounded-xl shadow-lg overflow-hidden z-[9999]"
        >
          <MenuItem icon={<Edit size={16} />} label="Edit" onClick={onEdit} />
          <MenuItem
            icon={<Copy size={16} />}
            label="Duplicate"
            onClick={onDuplicate}
          />
          <MenuItem icon={<Code size={16} />} label="Embed" onClick={onEmbed} />
          <MenuItem
            icon={<Trash2 size={16} className="text-red-400" />}
            label="Delete"
            onClick={() => setIsDeleteOpen(true)}
            danger
          />
        </motion.div>
      )}
      <DeleteConfirmModal
        key="delete-modal"
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={onDelete}
      />
    </AnimatePresence>
  );

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="p-2 rounded-md hover:bg-[var(--primary-bg)]"
      >
        <MoreHorizontal size={18} />
      </button>
      {createPortal(menu, document.body)}
    </>
  );
};

export default EventMenu;

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
