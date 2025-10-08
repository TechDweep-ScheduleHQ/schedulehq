import React, { useEffect } from 'react';
import { Button, TextField, Autocomplete } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../redux/store/hook';
import { fetchTimezones } from '../../../redux/slices/authSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface WelcomeProps {
    currentStep: number;
    timezone:string;
    onTimezoneChange: (tz: string) => void;
    onNext: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onNext ,timezone ,onTimezoneChange }) => {
    const dispatch = useAppDispatch();
    const { timezoneStatus, timezones, error , user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (timezoneStatus === 'idle') {
            dispatch(fetchTimezones());
        }
    }, [dispatch, timezoneStatus]);

    // toaster notification
    useEffect(() => {
        if (timezoneStatus === "failed") {
            toast.error(error || "Failed to fetch Timezones!")
        }
    },[timezoneStatus,error])

    return (
        <div className="px-4 p-2 rounded-lg">
            <ToastContainer />
            <form>
                <div className="mb-4">
                    <label className="block mb-2">Username</label>
                    <input
                        type="text"
                        value={user?.username || ""}
                        disabled
                        placeholder="john_doe"
                        className="w-full p-2 bg-[var(--card-bg)] rounded"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Email</label>
                    <input
                        type="text"
                        value={user?.email || ""}
                        disabled
                        placeholder="JohnDoe123@gmail.com"
                        className="w-full p-2 bg-[var(--card-bg)] rounded"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Timezone</label>
                    <Autocomplete
                        options={timezones.length > 0 ? timezones : ['Asia/Kolkata']}
                        value={timezone}
                        onChange={(_, newValue) => onTimezoneChange(newValue || 'Asia/Kolkata')}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Search or select timezone"
                                variant="outlined"
                                fullWidth
                                sx={{
                                    backgroundColor: 'var(--card-bg)',
                                    borderRadius: '0.25rem',
                                    input: { color: 'white' },
                                    "& .MuiOutlinedInput-root": {
                                        "&.Mui-focused fieldset": { borderColor: "white" },
                                    },
                                    "& .MuiAutocomplete-clearIndicator": {
                                        color: "white",
                                    },
                                    "& .MuiAutocomplete-popupIndicator": {
                                        color: "white",
                                    },
                                }}
                            />
                        )}
                    />
                </div>

                <Button
                    variant="contained"
                    onClick={onNext}
                    fullWidth
                    sx={{
                        mt: 3,
                        py: 2,
                        backgroundColor: 'var(--primary-text)',
                        color: 'var(--primary-bg)',
                        fontWeight: 'bold',
                        '&:hover': {
                            backgroundColor: 'var(--button-hover-bg)',
                        },
                    }}
                >
                    Connect your calendar →
                </Button>
            </form>
        </div>
    );
};

export default Welcome;

