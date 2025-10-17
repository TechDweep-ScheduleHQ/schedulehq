import React from "react";
import EventListItem from "./EventListItem";
import EventListSkeleton from "./EventListSkeleton";
import type { Event } from "../../../../../redux/types/event";

interface EventTypesListProps {
  events: Event[];
  loading: boolean;
  onEventAction: (type: "create" | "edit" | "copy", event: Event | null) => void;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
}

const EventTypesList: React.FC<EventTypesListProps> = ({
  events,
  loading,
  onEventAction,
  loadMoreRef,
}) => {
  return (
    <div className="bg-[var(--secondary-bg)] rounded-xl border border-[var(--borderGray-bg)] overflow-hidden">
      {loading ? (
        <EventListSkeleton />
      ) : events?.length > 0 ? (
        <>
          {events.map((event) => (
            <EventListItem
              key={event.id}
              event={event}
              onEdit={() => onEventAction("edit", event)}
              onDuplicate={() => onEventAction("copy", event)}
            />
          ))}
          <div ref={loadMoreRef} className="h-4" />
        </>
      ) : (
        <div className="p-6 text-center text-[var(--lightGray-text)]">
          No more results
        </div>
      )}
    </div>
  );
};

export default EventTypesList;