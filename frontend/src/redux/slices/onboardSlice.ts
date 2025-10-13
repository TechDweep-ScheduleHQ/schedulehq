import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../constants/axiosInstane";
import type {
  CalenderAuthResponse,
  ZoomAuthResponse,
  OnboardingPayload,
  OnboardingResponse,
} from "../types/onboard";
import { ONBOARD_URL } from "../../constants/api";

// Define state interface
interface OnboardState {
  loading: boolean;
  error: string | null;
  authUrl: string | null;
  onboardingSuccess: boolean;
  isCalenderConnected: {
    googleCalender: boolean;
  };
  isVideoConnected: {
    zoom: boolean;
  };
}

const initialState: OnboardState = {
  loading: false,
  error: null,
  authUrl: null,
  onboardingSuccess: false,
  isCalenderConnected: {
    googleCalender: false,
  },
  isVideoConnected: {
    zoom: false,
  },
};

// Async thunk for Google Calendar connection
export const connectGoogleCalendar = createAsyncThunk<
  CalenderAuthResponse,
  void,
  { rejectValue: string }
>("calendar/connectGoogleCalendar", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<CalenderAuthResponse>(
      ONBOARD_URL.GOOGLE_CALENDAR
    );
    window.location.href = response.data.authUrl;
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to connect google calender!"
    );
  }
});

// Async thunk for Zoom connection
export const connectZoom = createAsyncThunk<
  ZoomAuthResponse,
  void,
  { rejectValue: string }
>("video/connectZoom", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ZoomAuthResponse>(
      ONBOARD_URL.ZOOM
    );
    window.location.href = response.data.authUrl;
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to connect zoom!"
    );
  }
});

// Async thunk for onboarding setup
export const completeOnboarding = createAsyncThunk<
  OnboardingResponse,
  OnboardingPayload,
  { rejectValue: string }
>("onboard/completeOnboarding", async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<OnboardingResponse>(
      ONBOARD_URL.COMPLETE_ONBOARDING,
      payload
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to complete onboarding!"
    );
  }
});

// Create onboard slice
const onboardSlice = createSlice({
  name: "onboard",
  initialState,
  reducers: {
    resetOnboardingSuccess: (state) => {
      state.onboardingSuccess = false;
    },
    updateCalendarConnection: (
      state,
      action: {
        payload: {
          key: keyof OnboardState["isCalenderConnected"];
          value: boolean;
        };
      }
    ) => {
      state.isCalenderConnected = {
        ...state.isCalenderConnected,
        [action.payload.key]: action.payload.value,
      };
    },
    updateVideoConnection: (
      state,
      action: {
        payload: {
          key: keyof OnboardState["isVideoConnected"];
          value: boolean;
        };
      }
    ) => {
      state.isVideoConnected = {
        ...state.isVideoConnected,
        [action.payload.key]: action.payload.value,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Google Calendar
      .addCase(connectGoogleCalendar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(connectGoogleCalendar.fulfilled, (state, action) => {
        state.loading = false;
        state.authUrl = action.payload.authUrl;
        if (action.payload.authUrl) {
          window.location.href = action.payload.authUrl;
        }
      })
      .addCase(connectGoogleCalendar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error!";
      })
      // Zoom
      .addCase(connectZoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(connectZoom.fulfilled, (state, action) => {
        state.loading = false;
        state.authUrl = action.payload.authUrl || null;
        state.isVideoConnected.zoom = true;
        if (action.payload.authUrl) {
          window.location.href = action.payload.authUrl;
        }
      })
      .addCase(connectZoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      })
      // Onboarding
      .addCase(completeOnboarding.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.onboardingSuccess = false;
      })
      .addCase(completeOnboarding.fulfilled, (state, action) => {
        state.loading = false;
        state.onboardingSuccess = action.payload.status;
      })
      .addCase(completeOnboarding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error!";
        state.onboardingSuccess = false;
      });
  },
});

export const { resetOnboardingSuccess, updateVideoConnection, updateCalendarConnection } = onboardSlice.actions;
export default onboardSlice.reducer;
