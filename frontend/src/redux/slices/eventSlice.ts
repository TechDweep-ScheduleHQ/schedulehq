import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../constants/axiosInstane";
import type {
  EventCreatePayload,
  EventEditPayload,
  Event,
  EventResponse,
  EventGetResponse,
  EventGetAndSearchPayload,
} from "../types/event";
import { EVENT_URL } from "../../constants/api";

interface EventState {
  loading: boolean;
  error: string | null;
  success: boolean;
  events: Event[];
  totalEvents: number;
  totalPages: number;
  currentPage: number;
}

const initialState: EventState = {
  loading: false,
  error: null,
  success: false,
  events: [],
  totalEvents: 0,
  totalPages: 0,
  currentPage: 0,
};

// Create Event
export const createEvent = createAsyncThunk<
  EventResponse,
  EventCreatePayload,
  { rejectValue: string }
>("/event/create", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<EventResponse>(
      EVENT_URL.CREATE,
      payload
    );
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Failed to create event!"
    );
  }
});

// Get And Search Events
export const getEvents = createAsyncThunk<
  EventGetResponse,
  EventGetAndSearchPayload,
  { rejectValue: string }
>("/event/getEvents", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get<EventGetResponse>(
      `${EVENT_URL.GET_EVENTS}/${payload.userId}?search=${
        payload.search || ""
      }&page=${payload.page || 1}&limit=${payload.limit || 20}`
    );
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Failed to fetch event!"
    );
  }
});

// Edit event
export const editEvent = createAsyncThunk<
  EventResponse,
  EventEditPayload,
  { rejectValue: string }
>("/event/edit", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.patch<EventResponse>(
      `${EVENT_URL.EDIT}/${payload.userId}/${payload.eventId}`,
      payload.eventPayload
    );
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Failed to edit event!"
    );
  }
});

// Delete Event
export const deleteEvent = createAsyncThunk<
  EventResponse,
  { userId: number; eventId: number },
  { rejectValue: string }
>("/event/delete", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.delete<EventResponse>(
      `${EVENT_URL.DELETE}/${payload.userId}/${payload.eventId}`
    );
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Failed to delete event!"
    );
  }
});

// Hide Event
export const hideEvent = createAsyncThunk<
  EventResponse,
  { eventId: number; userId: number; hidden: boolean },
  { rejectValue: string }
>("/event/hide", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.patch<EventResponse>(
      `${EVENT_URL.HIDE}/${payload.userId}/${payload.eventId}`,
      { hidden: payload.hidden }
    );
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Failed to delete event!"
    );
  }
});

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Create Event Case
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.events = [action.payload.event, ...state.events];
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      //Edit Event Case
      .addCase(editEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(editEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.events = state.events.map((event) =>
          event.id === action.payload.event.id ? action.payload.event : event
        );
      })
      .addCase(editEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      //Hide Event Case
      .addCase(hideEvent.pending, (state) => {
        // state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(hideEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.events = state.events.map((event) =>
          event.id === action.payload.event.id ? action.payload.event : event
        );
      })
      .addCase(hideEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      //Delete Event Case
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.events = state.events.filter(
          (event) => event.id !== action.payload.event.id
        );
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      //Get Events Case
      .addCase(getEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.events = action.payload.data.events;
        state.totalEvents = action.payload.data.totalEvents;
        state.totalPages = action.payload.data.totalPages;
        state.currentPage = action.payload.data.currentPage;
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export default eventSlice.reducer;
