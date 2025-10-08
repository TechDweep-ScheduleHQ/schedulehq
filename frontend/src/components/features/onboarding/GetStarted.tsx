import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../redux/store/hook';
import Welcome from './Welcome';
import ConnectCalendar from './ConnectCalendar';
import ConnectVideoApps from './ConnectVideoApps';
import SetAvailability from './SetAvailability';
import UserProfile from './UserProfile';
import ProgressBar from './ProgressBar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { OnboardingPayload, TimeSlot, Availability } from '../../../redux/types/onboard';
import { completeOnboarding, resetOnboardingSuccess } from '../../../redux/slices/onboardSlice'; 

type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

// Define interface for StepConfig
interface StepConfig {
  path: string;
  title: string;
  description: string;
  component: React.FC<any>;
}

const steps: StepConfig[] = [
  {
    path: '',
    title: 'Welcome to ScheduleHQ!',
    description: 'We just need some basic info to get your profile setup.',
    component: Welcome,
  },
  {
    path: 'calender',
    title: 'Connect your calendar',
    description: 'Connect your calendar to automatically check for busy times and new events as they’re scheduled.',
    component: ConnectCalendar,
  },
  {
    path: 'video',
    title: 'Connect your video apps',
    description: 'Connect your preferred video conferencing app to use it for your meetings.',
    component: ConnectVideoApps,
  },
  {
    path: 'availability',
    title: 'Set your availability',
    description: 'Set your available times for meetings.',
    component: SetAvailability,
  },
  {
    path: 'profile',
    title: 'Complete your profile',
    description: 'Add your details to complete your profile setup.',
    component: UserProfile,
  },
];

const GetStarted: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
// const { user } = useAppSelector((state) => state.auth);  
  
  const { error, onboardingSuccess } = useAppSelector((state) => state.onboard); 
  const [stepIndex, setStepIndex] = useState<number>(0);

  // Initialize state for onboarding data
  const [timezone, setTimezone] = useState<string>('Asia/Kolkata');
  const [availability, setAvailability] = useState<Record<Day, TimeSlot[]>>({
    Monday: [{ start: '09:00', end: '17:00' }],
    Tuesday: [{ start: '09:00', end: '17:00' }],
    Wednesday: [{ start: '09:00', end: '17:00' }],
    Thursday: [{ start: '09:00', end: '17:00' }],
    Friday: [{ start: '09:00', end: '17:00' }],
    Saturday: [],
    Sunday: [],
  });
  const [enabledDays, setEnabledDays] = useState<Record<Day, boolean>>({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: false,
    Sunday: false,
  });
  const [bio, setBio] = useState<string>('');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>('');

  // Sync stepIndex with URL
  useEffect(() => {
    const currentPath = location.pathname.split('/').pop() || '';
    const index = steps.findIndex((s) => s.path === currentPath);
    if (index !== -1) setStepIndex(index);
  }, [location.pathname]);

  // Handle onboarding success or error
  useEffect(() => {
    if (onboardingSuccess) {
      toast.success('Onboarding completed successfully!');
      navigate('/dashboard');
      dispatch(resetOnboardingSuccess()); 
    }
    if (error && stepIndex === steps.length - 1) {
      toast.error(error || 'Failed to complete onboarding');
    }
  }, [onboardingSuccess, error, navigate, dispatch, stepIndex]);

  const handleNext = async () => {
    if (stepIndex < steps.length - 1) {
      const nextStep = steps[stepIndex + 1];
      navigate(`/getStarted/${nextStep.path}`);
    } else {
      // Prepare API payload
      const daysList: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const availabilityData: Availability[] = daysList.map((day) => ({
        day: day.toLowerCase(),
        enabled: enabledDays[day],
        timeSlots: availability[day],
      }));

      const payload: OnboardingPayload = {
        // username: user?.username || "jhondoe",
        // email: user?.email || "jhondoe123@gmail.com",
        timezone,
        availability: availabilityData,
        bio,
        profilePhotoUrl,
      };

      // Dispatch onboarding thunk
      await dispatch(completeOnboarding(payload));
    }
  };

  const currentStep = steps[stepIndex];
  const CurrentComponent = currentStep.component;
  const progressValue = ((stepIndex + 1) / steps.length) * 100;

  // Pass appropriate props to each component
  const componentProps = {
    currentStep: stepIndex + 1,
    onNext: handleNext,
    ...(stepIndex === 0 && { timezone, onTimezoneChange: setTimezone }),
    ...(stepIndex === 3 && { availability, setAvailability, enabledDays, setEnabledDays }),
    ...(stepIndex === 4 && { bio, setBio, profilePhotoUrl, setProfilePhotoUrl }),
  };

  return (
    <div className="bg-[var(--primary-bg)] text-[var(--primary-text)] min-h-screen flex items-center justify-center">
      <ToastContainer />
      <div className="w-2/4">
        <h1 className="text-3xl mt-5 font-bold mb-2">{currentStep.title}</h1>
        <p className="mb-4">{currentStep.description}</p>
        <div className="mb-3">
          Step {stepIndex + 1} of {steps.length}
        </div>
        <ProgressBar value={progressValue} />
        <div className="bg-[var(--darkGray-bg)] p-6 rounded-lg">
          <CurrentComponent {...componentProps} />
        </div>
      </div>
    </div>
  );
};

export default GetStarted;

