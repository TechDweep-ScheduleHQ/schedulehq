import React, { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import calender2 from '../../../assets/images/calender2.jpg'
import * as yup from 'yup';
import { useFormik } from 'formik';
import { emailValidation, passwordValidation } from '../../../utilis/validation';
import { useAppDispatch, useAppSelector } from '../../../redux/store/hook';
import { login, verifyEmail, googleLogin } from '../../../redux/slices/authSlice';
import type { LoginValues } from '../../../redux/types/auth';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import {toast , ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const LoginSchema = yup.object({
    email: emailValidation,
    password: passwordValidation
})

const EmailLoginForm: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { loading, error, success, isAuthenticated, verificationStatus, verificationMessage } = useAppSelector((state) => state.auth);


    // Handle email verification from url token
    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            dispatch(verifyEmail({ token }));
        }
    }, [dispatch, searchParams])


    // Show toast notifications for verification and login status
    useEffect(() => {
        if (verificationStatus === 'success') {
            toast.success(verificationMessage || 'Email verified successfully! Please log in.', {
                position: "top-right",
                autoClose: 3000,
            });
        }
        if (verificationStatus === 'failed') {
            toast.error(verificationMessage || 'Email verification failed.', {
                position: "top-right",
                autoClose: 3000,
            });
        }
        if (success && isAuthenticated) {
            toast.success('Login successful! Welcome back.', {
                position: "top-right",
                autoClose: 2000,
            });
        }
        if (error && verificationStatus !== 'failed') {
            toast.error(error, {
                position: "top-right",
                autoClose: 3000,
            });
        }
    }, [verificationStatus, verificationMessage, success, isAuthenticated, error]);


    // Redirect to dashboard after verification
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/getStarted')
        }
    }, [isAuthenticated, navigate])


    // formik 
    const formik = useFormik<LoginValues>({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: LoginSchema,
        onSubmit: (values, { setSubmitting }) => {
            dispatch(login(values))
                .unwrap()
                .then(() => {
                    setSubmitting(false)
                    navigate('/getStarted')
                })
                .catch(() => {
                    setSubmitting(false)
                })
        }
    })

    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID!;
    if (!googleClientId) {
        console.error('Google Client ID is missing. Please set REACT_APP_GOOGLE_CLIENT_ID in .env file.');
        toast.error('Google Sign-In is unavailable due to missing configuration.', {position: "top-right",
        autoClose: 3000});
    }

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <div className="flex min-h-screen bg-[var(--primary-bg)] text-[var(--primary-text)]">
                <ToastContainer />
                <div className="flex flex-col md:flex-row w-full">
                    <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
                        <div className="w-full max-w-md bg-[var(--darkGray-bg)] rounded-lg shadow-lg p-8">
                            <div className="items-center justify-center font-bold flex flex-col">
                                <h2 className="text-xl">ScheduleHQ</h2>
                                <p className="mb-6 text-2xl">Welcome Back</p>
                            </div>

                            {/* login part */}
                            <div className='space-y-4'>
                                <div style={{ pointerEvents: loading ? 'none' : 'auto', opacity: loading ? 0.6 : 1 }}>
                                <GoogleLogin
                                    onSuccess={(credentialResponse) => {
                                        if (credentialResponse.credential) {
                                            dispatch(googleLogin({ idToken: credentialResponse.credential }))
                                                .unwrap()
                                                .then(() => {
                                                    navigate('/getStarted')
                                                })
                                                .catch((err: any) => {
                                                    console.error('Gpogle signin error', err)
                                                      toast.error('Google login failed. Please try again!', {
                                                            position: "top-right",
                                                            autoClose: 3000,
                                                        });
                                                })
                                        }
                                    }}
                                    onError={() => {
                                        console.error('Google sign in failed!')
                                        toast.error('Google login failed. Please try again!', {
                                                position: "top-right",
                                                autoClose: 3000,
                                            });
                                        dispatch({
                                            type: 'auth/googleLogin/rejected',
                                            payload: 'Google login failed.Please try again!'
                                        })
                                    }}
                                    theme='filled_blue'
                                    size='large'
                                    text='signin_with'
                                    shape='rectangular'
                                    width='100%'
                                />
                                </div>

                                <div className="relative my-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-600"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 text-[var(--textGray-bg)]">or</span>
                                    </div>
                                </div>

                                <form onSubmit={formik.handleSubmit} className='space-y-4'>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-2">Email address</label>
                                        <input
                                            type="email"
                                            placeholder="john123@gmail.com"
                                            name='email'
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`w-full p-2 border rounded text-[var-(--primary-text)] placeholder-gray-400
                                  ${formik.errors.email && formik.touched.email ? "border-red-400" : "border-gray-700"}
                                `}
                                        />
                                        {formik.errors.email && formik.touched.email && (
                                            <div className='text-red-400 text-xs mt-1'>
                                                {formik.errors.email}
                                            </div>
                                        )}
                                    </div>


                                    <div className="relative mb-2">
                                        <label htmlFor="password" className="block text-sm font-medium">
                                            Password
                                        </label>
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formik.values.password}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="••••••••"
                                            className={`mt-1 w-full p-2 border rounded-lg text-[var-(--primary-text)] placeholder-gray-400
                                    ${formik.errors.password && formik.touched.password ? "border-red-400" : "border-gray-600"} 
                                `}
                                        />

                                        {formik.errors.password && formik.touched.password && (
                                            <div className='text-red-400 mt-1 text-xs'>
                                                {formik.errors.password}
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400" />
                                            )}
                                        </button>
                                    </div>

                                    <div className="text-right mb-4">
                                        <Link to="/forgotPassword" className="text-sm text-blue-400 hover:underline">
                                            Forgot Password?
                                        </Link>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={formik.isSubmitting || loading}
                                        className="w-full bg-gray-700 hover:bg-gray-800 text-[var-(--primary-text)] p-2 rounded-lg transition"
                                    >
                                        {formik.isSubmitting || loading ? "Submitting..." : "Log in"}
                                    </button>
                                </form>
                            </div>

                            <div className="flex justify-center mt-3 text-sm text-gray-400">
                                Don't have an account?{" "}
                                <Link to="/" className="ml-1 text-blue-400 hover:underline">
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right side: Image container */}
                    <div className="hidden md:block w-full md:w-1/2">
                        <img
                            src={calender2}
                            alt="Login illustration"
                            className="w-full h-full object-cover rounded-r-lg"
                        />
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default EmailLoginForm;


