import React from "react";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "react-toastify";
import EventMenu from "./EventMenu";
import EventToggle from "./EventToggle";
import EventDuration from "./EventDuration";
import { useAppDispatch, useAppSelector } from "../../../../../redux/store/hook";
import { deleteEvent, hideEvent } from "../../../../../redux/slices/eventSlice";
import type { Event } from "../../../../../redux/types/event";

interface EventListItemProps {
  event: Event;
  onEdit: () => void;
  onDuplicate: () => void;
}

const EventListItem: React.FC<EventListItemProps> = ({ event, onEdit, onDuplicate }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link Copied!");
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpen = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleToggle = () => {
    if (user) {
      dispatch(
        hideEvent({
          userId: user.id,
          eventId: event.id,
          hidden: !event.hidden,
        })
      );
    }
  };

  const handleDelete = () => {
    if (user) {
      dispatch(deleteEvent({ userId: user.id, eventId: event.id }));
    }
  };

  return (
    <div className="flex justify-between items-center border-b border-[var(--borderGray-bg)] last:border-none px-5 py-4 hover:bg-[var(--card-bg)] transition">
      <div>
        <h2 className="font-medium">
          {event.title}{" "}
          {event.hidden && (
            <span className="text-xs bg-[var(--borderGray-bg)] text-[var(--lightGray-text)] px-2 py-[2px] rounded ml-2">
              Hidden
            </span>
          )}
        </h2>
        <p className="text-[var(--lightGray-text)] text-sm">{event.url}</p>
        <div className="flex items-center gap-2 mt-1 text-sm text-[var(--lightGray-text)]">
          <EventDuration duration={event.duration} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {event?.hidden && (
          <span className="px-2 py-1 rounded-lg bg-[var(--primary-bg)] text-[var(--primary-text)] text-sm">
            Hidden
          </span>
        )}
        
        <EventToggle checked={event.hidden} onChange={handleToggle} />

        <div className="flex gap-2 relative cursor-pointer">
          <button
            onClick={() => handleOpen(event.url)}
            className="p-2 rounded-md cursor-pointer hover:bg-[var(--input-bg)]"
          >
            <ExternalLink size={18} />
          </button>
          <button
            onClick={() => handleCopy(event.url)}
            className="p-2 rounded-md cursor-pointer hover:bg-[var(--input-bg)]"
          >
            <Copy size={18} />
          </button>

          <EventMenu
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onEmbed={() => alert(`embed ${event.title}`)}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default EventListItem;