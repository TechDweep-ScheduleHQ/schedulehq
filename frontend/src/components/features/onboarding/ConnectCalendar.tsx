import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hook";
import {
  connectGoogleCalendar,
  updateCalendarConnection,
} from "../../../redux/slices/onboardSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";

interface ConnectCalendarProps {
  currentStep: number;
  onNext: () => void;
}

const ConnectCalendar: React.FC<ConnectCalendarProps> = ({ onNext }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { loading, error, isCalenderConnected } = useAppSelector(
    (state) => state.onboard
  );

  useEffect(() => {
    const params = Object.fromEntries(new URLSearchParams(location.search));

    // Loop through each query param
    Object.entries(params).forEach(([key, value]) => {
      if (value === "true" && key in isCalenderConnected) { // Only update if not already true
        if (!isCalenderConnected[key as keyof typeof isCalenderConnected]) {
          dispatch(
            updateCalendarConnection({
              key: key as keyof typeof isCalenderConnected,
              value: true,
            })
          );
        }
      }
      console.log(key);
    });
  }, [location.search, dispatch, isCalenderConnected]);

  console.log(isCalenderConnected, );

  const handleGoogleCalenderConnect = async () => {
    await dispatch(connectGoogleCalendar());
  };

  useEffect(() => {
    if (error) {
      toast.error(error || "Failed to connect calender!");
    }
  }, [error]);

  return (
    <>
      <div className="text-center p-2 rounded-lg">
        <ToastContainer />
        <div style={{ maxHeight: "80vh", overflow: "hidden" }}>
          <div
            className="space-y-4"
            style={{ maxHeight: "45vh", overflowY: "auto" }}
          >
            <div className="flex justify-between items-center p-4 bg-[var(--card-bg)] rounded">
              <div className="flex items-center">
                <span className="text-[var-(--primary-text)]">
                  Google Calendar
                </span>
              </div>
              <button
                className="border border-[var(--border-bg)] text-[var-(--primary-text)] p-2 rounded"
                onClick={handleGoogleCalenderConnect}
                disabled={loading || isCalenderConnected?.googleCalender}
              >
                {loading
                  ? "Connecting..."
                  : isCalenderConnected?.googleCalender
                  ? "Connected"
                  : "Connect"}
              </button>
            </div>

            <div className="flex justify-between items-center p-4 bg-[var(--card-bg)] rounded">
              <div className="flex items-center">
                <span className="text-[var-(--primary-text)]">
                  Outlook Calendar
                </span>
              </div>
              <button className="border border-[var(--border-bg)] text-[var-(--primary-text)] p-2 rounded">
                Connect
              </button>
            </div>
            <div className="flex justify-between items-center p-4 bg-[var(--card-bg)] rounded">
              <div className="flex items-center">
                <span className="text-[var-(--primary-text)]">
                  Apple Calendar
                </span>
              </div>
              <button className="border border-[var(--border-bg)] text-[var-(--primary-text)] p-2 rounded">
                Connect
              </button>
            </div>
          </div>
        </div>

        <Button
          variant="contained"
          onClick={onNext}
          fullWidth
          sx={{
            mt: 4,
            py: 2,
            backgroundColor: "var(--primary-text)",
            color: "var(--primary-bg)",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "var(--button-hover-bg)",
            },
          }}
        >
          Connect your calender first →
        </Button>
      </div>
    </>
  );
};

export default ConnectCalendar;
