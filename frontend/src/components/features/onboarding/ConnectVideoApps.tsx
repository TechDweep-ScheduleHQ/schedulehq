import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hook";
import {
  connectZoom,
  updateVideoConnection,
} from "../../../redux/slices/onboardSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";

interface ConnectVideoAppsProps {
  currentStep: number;
  onNext: () => void;
}

const ConnectVideoApps: React.FC<ConnectVideoAppsProps> = ({ onNext }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { onboardingSuccess, loading, error, isVideoConnected } =
    useAppSelector((state) => state.onboard);

  const handleZoomConnect = () => {
    dispatch(connectZoom());
  };

  useEffect(() => {
    const params = Object.fromEntries(new URLSearchParams(location.search));

    // Loop through each query param
    Object.entries(params).forEach(([key, value]) => {
      if (value === "true" && key in isVideoConnected) {
        // Only update if not already true
        if (!isVideoConnected[key as keyof typeof isVideoConnected]) {
          dispatch(
            updateVideoConnection({
              key: key as keyof typeof isVideoConnected,
              value: true,
            })
          );
        }
      }
      console.log(key);
    });
  }, [location.search, dispatch, isVideoConnected]);

  useEffect(() => {
    if (onboardingSuccess === true) {
      toast.success("Zoom Connected successfully!");
    }
    if (error) {
      toast.error(error || "Failed to connect zoom!");
    }
  }, [error, onboardingSuccess]);

  return (
    <>
      <div className="text-center p-6 rounded-lg">
        <ToastContainer />
        <div style={{ maxHeight: "80vh", overflow: "hidden" }}>
          <div
            className="space-y-4"
            style={{ maxHeight: "45vh", overflowY: "auto" }}
          >
            <div className="flex justify-between items-center p-4 bg-[var(--card-bg)] rounded">
              <div className="flex items-center">
                <span>Zoom Video</span>
              </div>
              <button
                className="border border-[var(--border-bg)] text-[var-(--primary-text)] p-2 rounded"
                onClick={handleZoomConnect}
                disabled={loading || isVideoConnected?.zoom}
              >
                {loading
                  ? "Connecting..."
                  : isVideoConnected?.zoom
                  ? "Connected"
                  : "Connect"}
              </button>
            </div>
            <div className="flex justify-between items-center p-4 bg-[var(--card-bg)] rounded">
              <div className="flex items-center">
                <span>Google Meet</span>
              </div>
              <button className="border border-[var(--border-bg)] text-[var-(--primary-text)] p-2 rounded">
                Connect
              </button>
            </div>
            <div className="flex justify-between items-center p-4 bg-[var(--card-bg)] rounded">
              <div className="flex items-center">
                <span>Microsoft 365/Teams</span>
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
          Set your availability →
        </Button>
      </div>
    </>
  );
};

export default ConnectVideoApps;
