import React, { useEffect } from 'react';
import { Button } from '@mui/material';
import { useAppDispatch , useAppSelector } from '../../../redux/store/hook';
import {connectGoogleCalendar } from '../../../redux/slices/onboardSlice'; 
import {toast , ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ConnectCalendarProps {
  currentStep: number;
  onNext: () => void;
}

const ConnectCalendar: React.FC<ConnectCalendarProps> = ({ onNext }) => {
  const dispatch = useAppDispatch();
  const {loading , error } = useAppSelector((state) => state.onboard);

  const handleGoogleCalenderConnect = () => {
      dispatch(connectGoogleCalendar())
  }

  useEffect(() => {
    if(error){
      toast.error(error || "Failed to connect calender!")
    }
  },[error])

  return (
    <>
      <div className="text-center p-2 rounded-lg" >
        <ToastContainer/>
        <div style={{ maxHeight: '80vh', overflow: 'hidden' }}>
          <div className="space-y-4" style={{ maxHeight: '45vh', overflowY: 'auto' }}>
            <div className="flex justify-between items-center p-4 bg-[var(--card-bg)] rounded">
              <div className="flex items-center">
                <span className="text-[var-(--primary-text)]">Google Calendar</span>
              </div>
              <button className="border border-[var(--border-bg)] text-[var-(--primary-text)] p-2 rounded"
              onClick={handleGoogleCalenderConnect}
              disabled={loading}
              >{loading ? 'Connecting...' : 'Connect'}</button>
            </div>

            <div className="flex justify-between items-center p-4 bg-[var(--card-bg)] rounded">
              <div className="flex items-center">
                <span className="text-[var-(--primary-text)]">Outlook Calendar</span>
              </div>
              <button className="border border-[var(--border-bg)] text-[var-(--primary-text)] p-2 rounded">Connect</button>
            </div>
            <div className="flex justify-between items-center p-4 bg-[var(--card-bg)] rounded">
              <div className="flex items-center">
                <span className="text-[var-(--primary-text)]">Apple Calendar</span>
              </div>
              <button className="border border-[var(--border-bg)] text-[var-(--primary-text)] p-2 rounded">Connect</button>
            </div>

          </div>
        </div>

        <Button variant="contained" onClick={onNext} fullWidth
          sx={{
            mt: 4,
            py: 2,
            backgroundColor: 'var(--primary-text)',
            color: 'var(--primary-bg)',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: 'var(--button-hover-bg)'
            }
          }}
        >
          Connect your calender first →
        </Button>
      </div>

    </>
  );
};

export default ConnectCalendar;




