import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import calender2 from '../../../assets/images/calender2.jpg';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { emailValidation } from "../../../utilis/validation";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hook";
import { forgotPassword } from "../../../redux/slices/authSlice";
import type { ForgotPasswordValues } from "../../../redux/types/auth";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ForgotPasswordSchema = yup.object({
    email: emailValidation
})


const ForgotPassword: React.FC = () => {
    const dispatch = useAppDispatch();
    const { loading, error, forgotPasswordStatus, forgotPasswordMessage } = useAppSelector((state) => state.auth);


    // toaster notification
    useEffect(() => {
        if (forgotPasswordStatus === "success") {
            toast.success(forgotPasswordMessage || "Check your email for reset password!")
        }
        if (forgotPasswordStatus === "failed") {
            toast.error(error || forgotPasswordMessage)
        }
    }, [error, forgotPasswordStatus, forgotPasswordMessage])


    // formik
    const formik = useFormik<ForgotPasswordValues>({
        initialValues: {
            email: "",
        },
        validationSchema: ForgotPasswordSchema,
        onSubmit: (values, { setSubmitting }) => {
            dispatch(forgotPassword(values))
                .unwrap()
                .then(() => {
                    setSubmitting(false)
                })
                .catch(() => {
                    setSubmitting(false)
                })
        }
    })

    return (
        <div className="flex min-h-screen bg-black text-white">
            <ToastContainer />
            <div className="flex flex-col md:flex-row w-full">
                <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
                    <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-lg p-8">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Forgot Password</h2>
                            <p className="mt-2 text-sm text-white">
                                Enter your email to receive a password reset link
                            </p>
                        </div>


                        <form
                            onSubmit={formik.handleSubmit}
                            className="space-y-4" >
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="john123@gmail.com"
                                    className={`w-full p-3 border rounded-lg text-white placeholder-gray-400
                                    ${formik.errors.email && formik.touched.email ? "border-red-400" : "border gray-600"} 
                                `}
                                />

                                {formik.errors.email && formik.touched.email && (
                                    <div className="text-red-400 text-xs mt-1">
                                        {formik.errors.email}
                                    </div>
                                )}

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
};

export default ForgotPassword;