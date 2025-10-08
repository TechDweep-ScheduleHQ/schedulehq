import React, { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import calender2 from '../../../assets/images/calender2.jpg';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { passwordValidation } from '../../../utilis/validation';
import type { ResetPasswordValues } from '../../../redux/types/auth';
import { resetPassword } from '../../../redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/store/hook';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ResetPasswordSchema = yup.object({
    password: passwordValidation,
    confirmPassword: passwordValidation
})

const ResetPassword: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const {loading, error, resetPasswordStatus, resetPasswordMessage} = useAppSelector((state) => state.auth);

    
    // toaster 
    useEffect(()=> {
        if(resetPasswordStatus === "success"){
            toast.success(resetPasswordMessage || 'Password reset successfully! Redirecting to login...')
        }
        if(resetPasswordStatus === "failed"){
            toast.error(resetPasswordMessage || 'Failed to reset password.')
        }
        if(error && resetPasswordStatus === "failed"){
            toast.error(error)
        }
    },[error,resetPasswordStatus,resetPasswordMessage])


    // formik
    const formik = useFormik<ResetPasswordValues>({
        initialValues: {
            password: "",
            confirmPassword: "",
            token: searchParams.get("token") || '',
        },
        validationSchema: ResetPasswordSchema,
        onSubmit: (values, { setSubmitting }) => {
            dispatch(resetPassword(values))
                .unwrap()
                .then(() => {
                    setSubmitting(false)
                    setTimeout(() => navigate('/emailLogin'), 3000);
                })
                .catch(() => {
                    setSubmitting(false)
                });
        }
    })

 // Redirect if token is missing
  useEffect(() => {
    if (!searchParams.get('token')) {
      navigate('/forgotPassword');
    }
  }, [searchParams, navigate]);

    return (
        <div className="flex min-h-screen bg-black text-white">
            <ToastContainer/>
            <div className="flex flex-col md:flex-row w-full">
                <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
                    <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-lg p-8">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Reset Password</h2>
                            <p className="mt-2 text-sm text-white">
                            </p>
                        </div>

                        <form
                            onSubmit={formik.handleSubmit}
                            className="space-y-4">
                            <div className="relative mb-4">
                                <label className="block text-sm font-medium mb-2">Password</label>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    name='password'
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`w-full p-2  border  rounded
                                    ${formik.errors.password && formik.touched.password ? "border-red-400" : "border-gray-700"}
                                `}
                                />

                                {formik.errors.password && formik.touched.password && (
                                    <div className='text-red-400 text-xs mt-1'>
                                        {formik.errors.password}
                                    </div>
                                )}

                                <button
                                    type='button'
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='absolute inset-y-0 right-0 flex items-center pr-3 mt-6'>
                                    {showPassword ? (
                                        <EyeOff className='h-5 w-5 text-gray-400' />
                                    ) : (
                                        <Eye className='h-5 w-5 text-gray-400' />
                                    )}
                                </button>
                            </div>

                            <div className="relative mb-4">
                                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                                <input
                                    id="password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    name='confirmPassword'
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`w-full p-2  border rounded
                                    ${formik.errors.confirmPassword && formik.touched.confirmPassword ? "border-red-400" : "border-gray-700"}
                                    `}
                                />

                                {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                                    <div className='text-red-400 mt-1 text-xs'>
                                        {formik.errors.confirmPassword}
                                    </div>
                                )}

                                <button
                                    type='button'
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className='absolute inset-y-0 right-0 flex items-center pr-3 mt-6'>
                                    {showConfirmPassword ? (
                                        <EyeOff className='h-5 w-5 text-gray-400' />
                                    ) : (
                                        <Eye className='h-5 w-5 text-gray-400' />
                                    )}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={formik.isSubmitting || loading}
                                className="w-full bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg font-semibold transition"
                            >
                                {formik.isSubmitting || loading ? "Submitting..." : "Submit"}
                            </button>
                        </form>

                        {/* Added Back to Sign In link */}
                        <div className="mt-4 text-center text-sm text-gray-400">
                            <Link to="/emailLogin" className="text-blue-400 hover:underline">
                                Back to Sign In
                            </Link>
                        </div>

                    </div>
                </div>

                {/* Right side: Image container, aligned with EmailLoginForm */}
                <div className="hidden md:block w-full md:w-1/2">
                    <img
                        src={calender2}
                        alt="Calendar schedule illustration"
                        className="w-full h-full object-cover rounded-r-lg"
                    />
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;