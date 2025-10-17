import React, { useState, useEffect, useRef, useCallback } from "react";
import AddEventTypeModal from "./modal/AddEventTypeModal";
import EventTypesHeader from "./EventTypesHeader";
import EventTypesSearch from "./EventTypesSearch";
import EventTypesList from "./EventTypesList";
import { useAppDispatch, useAppSelector } from "../../../../../redux/store/hook";
import { getEvents } from "../../../../../redux/slices/eventSlice";
import type { Event } from "../../../../../redux/types/event";

const EventTypesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [eventType, setEventType] = useState<"create" | "edit" | "copy">("create");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [search, setSearch] = useState("");
  
  const dispatch = useAppDispatch();
  const { loading, events, currentPage, totalPages } = useAppSelector((state) => state.event);
  const { user } = useAppSelector((state) => state.auth);
  
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastApiCall = useRef<number>(0);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleModalOpen = (type: "create" | "edit" | "copy" = "create", event: Event | null = null) => {
    setEventType(type);
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEventType("create");
    setSelectedEvent(null);
  };

  const fetchEvents = useCallback((page = 1) => {
    if (!user?.id) return;

    const now = Date.now();
    const throttleDelay = 500;
    if (now - lastApiCall.current < throttleDelay) return;

    lastApiCall.current = now;
    dispatch(getEvents({ userId: user.id, search, page }));
  }, [dispatch, search, user?.id]);

  useEffect(() => {
    user?.id && dispatch(getEvents({ userId: user?.id }));
  }, [dispatch, user]);

  useEffect(() => {
    if (!user?.id) return;

    const debounceDelay = 1000;
    const throttleDelay = 1500;

    const now = Date.now();
    if (now - lastApiCall.current < throttleDelay) return;

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      lastApiCall.current = Date.now();
      dispatch(getEvents({ userId: user.id, search }));
    }, debounceDelay);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [search, dispatch, user?.id]);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && currentPage < totalPages) {
          fetchEvents(currentPage + 1);
        }
      },
      { root: null, rootMargin: "0px", threshold: 1.0 }
    );

    observer.current.observe(loadMoreRef.current);

    return () => observer.current?.disconnect();
  }, [currentPage, totalPages, loading, fetchEvents]);

  return (
    <div className="text-[var(--primary-text)]">
      <div>
        <EventTypesHeader onNewClick={() => handleModalOpen("create")} />
        <EventTypesSearch value={search} onChange={setSearch} />
        <EventTypesList
          events={events}
          loading={loading}
          onEventAction={handleModalOpen}
          loadMoreRef={loadMoreRef}
        />
      </div>

      {isModalOpen && (
        <AddEventTypeModal
          eventType={eventType}
          onClose={handleModalClose}
          event={selectedEvent}
        />
      )}
    </div>
  );
};

export default EventTypesPage;