import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Event",
  message = "Are you sure you want to delete this event? This action cannot be undone.",
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-[var(--secondary-bg)] border border-[var(--borderGray-bg)] rounded-2xl shadow-xl w-full max-w-md p-6 relative text-center"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-200"
            >
              <X size={18} />
            </button>

            {/* Title */}
            <h2 className="text-lg font-semibold text-[var(--primary-text)] mb-2">{title}</h2>

            {/* Message */}
            <p className="text-sm text-gray-400 mb-6">{message}</p>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;
