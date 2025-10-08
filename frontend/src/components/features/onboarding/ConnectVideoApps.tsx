import React, { useEffect } from 'react';
import { Button } from '@mui/material';
import { useAppDispatch , useAppSelector } from '../../../redux/store/hook';
import { connectZoom } from '../../../redux/slices/onboardSlice';
import {toast , ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ConnectVideoAppsProps {
    currentStep: number;
    onNext: () => void;
}

const ConnectVideoApps: React.FC<ConnectVideoAppsProps> = ({ onNext }) => {
    const dispatch = useAppDispatch()
    const {onboardingSuccess , loading , error } = useAppSelector((state) => state.onboard);

    const handleZoomConnect = () => {
        dispatch(connectZoom())
    }

    useEffect(() =>{
        if(onboardingSuccess === true){
            toast.success("Zoom Connected successfully!")
        }
        if(error){
            toast.error(error || "Failed to connect zoom!")
        }
    },[error,onboardingSuccess])

    return (
        <>
            <div className="text-center p-6 rounded-lg" >
                <ToastContainer/>
                <div style={{ maxHeight: '80vh', overflow: 'hidden' }}>
                    <div className="space-y-4" style={{ maxHeight: '45vh', overflowY: 'auto' }}>
                        <div className="flex justify-between items-center p-4 bg-[var(--card-bg)] rounded">
                            <div className="flex items-center">
                                <span>Zoom Video</span>
                            </div>
                            <button className="border border-[var(--border-bg)] text-[var-(--primary-text)] p-2 rounded"
                            onClick={handleZoomConnect}
                            disabled={loading}
                            >{loading ? "Connecting..." : "Connect"}</button>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-[var(--card-bg)] rounded">
                            <div className="flex items-center">
                                <span>Google Meet</span>
                            </div>
                            <button className="border border-[var(--border-bg)] text-[var-(--primary-text)] p-2 rounded">Connect</button>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-[var(--card-bg)] rounded">
                            <div className="flex items-center">
                                <span>Microsoft 365/Teams</span>
                            </div>
                            <button className="border border-[var(--border-bg)] text-[var-(--primary-text)] p-2 rounded">Connect</button>
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
                        backgroundColor: 'var(--primary-text)',
                        color: 'var(--primary-bg)',
                        fontWeight: 'bold',
                        '&:hover': {
                            backgroundColor: 'var(--button-hover-bg)'
                        }
                    }}
                >
                    Set your availability →
                </Button>
            </div>

        </>
    );

};


export default ConnectVideoApps;