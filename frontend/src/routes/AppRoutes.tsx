import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '../components/layout/home';
import EmailSignupForm from '../components/features/auth/emailSignupForm';
import EmailLoginForm from '../components/features/auth/emailLoginForm';
import ForgotPassword from '../components/features/auth/forgotPassword';
import ResetPassword from '../components/features/auth/resetPassword';
import GetStarted from '../components/features/onboarding/GetStarted';
import Sidebar from '../components/features/dashboard/sidebar';
import Events from '../components/features/dashboard/pages/events';
import Meeting from '../components/features/dashboard/pages/meeting';
import Availability from '../components/features/dashboard/pages/availability';
// import PrivateRoute from './PrivateRoutes';
// import { useAppSelector } from '../redux/store/hook';


const AppRoutes: React.FC = () => {
  // const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  return (
    <div className="flex flex-col bg-black min-h-screen">
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/emailSignup' element={<EmailSignupForm />} />
        <Route path='/emailLogin' element={<EmailLoginForm />} />
        <Route path='/forgotPassword' element={<ForgotPassword />} />
        <Route path='/resetPassword' element={<ResetPassword />} />
        <Route path='/getStarted/*' element={<GetStarted />} />
        <Route path='/dashboard' element={<Sidebar />} />
        <Route path='/events' element={<Events />} />
        <Route path='/meetings' element={<Meeting />} />
        <Route path='/availability' element={<Availability />} />
      </Routes>

    </div>
  );
};

export default AppRoutes;




 {/* for protected route 
    <Route element={<PrivateRoute isAuthenticated={isAuthenticated}><div /></PrivateRoute>}>
    <Route path="/dashboard" element={<Sidebar />} />
    <Route path="/events" element={<Events />} />
    <Route path="/meetings" element={<Meeting />} />
    <Route path="/availability" element={<Availability />} />
    </Route> 
*/}

