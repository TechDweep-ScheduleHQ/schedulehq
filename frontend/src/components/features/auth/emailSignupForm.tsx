import React, { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import calender2 from '../../../assets/images/calender2.jpg';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { emailValidation , passwordValidation , usernameValidation } from '../../../utilis/validation';
import { useAppDispatch , useAppSelector } from '../../../redux/store/hook';
import { signup } from '../../../redux/slices/authSlice';
import type { SignupValues } from '../../../redux/types/auth';
import {toast , ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const SignupSchema = yup.object({
   username:usernameValidation,
   email:emailValidation,
   password:passwordValidation
})

// for formik only
// interface SignupValues{
//   username:string,
//   email:string,
//   password:string
// }

const EmailSignupForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const {loading,error,success} = useAppSelector((state) => state.auth);

  // toast notification 
  useEffect(()=>{
    if(success){
      toast.success("User created. Check your email for verification!",{position:'top-right',autoClose:3000})
    }
    if(error){
      toast.error(error || "Email signup failed!",{position:'top-right',autoClose:3000})
    }
  },[success,error])

  const formik = useFormik<SignupValues>({
    initialValues:{
      username:"",
      email:"",
      password:""
    },
    validationSchema:SignupSchema,
    // validateOnChange:false,
    // validateOnBlur:false,
    onSubmit: (values , {setSubmitting}) => {
      // console.log("Form data", values);
      // setSubmitting(false);
      dispatch(signup(values))
         .unwrap()
         .then(()=> {
             setSubmitting(false)
         })
         .catch(() => {
             setSubmitting(false)
         })
    }
  })

  return (
    <div className="flex min-h-screen bg-black text-white">
      <ToastContainer/>
      <div className="flex flex-col w-full md:flex-row">
        {/* Left Side - Form */}
        <div className="w-full flex items-center justify-center p-4 md:w-1/2 md:p-8">
          <form onSubmit={formik.handleSubmit}
          className="w-full max-w-md bg-gray-900 rounded-lg shadow-lg p-6 sm:p-8">
            <div className="items-center justify-center font-bold flex flex-col">
              <h2 className="text-xl sm:text-2xl">Create your ScheduleHQ account</h2>
              <p className="mb-4 text-sm sm:mb-6 sm:text-base">Free for individuals. Team plans for collaborative features.</p>
            </div>

            <div className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">Username</label>
                <input
                  type="text"
                  placeholder="john_123"
                  name='username'
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  // className="w-full p-2 border border-gray-700 rounded text-white placeholder-gray-400 text-sm sm:text-base"
                  className={`w-full p-2 border rounded text-white placeholder-gray-400 text-sm sm:text-base
    ${formik.errors.username && formik.touched.username ? "border-red-500" : "border-gray-700"}`}
                />
                {formik.errors.username && formik.touched.username && (
                  <div className='text-red-400 text-xs mt-1'>
                    {formik.errors.username}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
                <input
                  type="email"
                  placeholder="john@yopmail.com"
                  name='email'
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full p-2 border rounded text-white placeholder-gray-400 text-sm sm:text-base
                ${formik.errors.email && formik.touched.email ? "border-red-500" : "border-gray-700"}`}
                />
                {formik.errors.email && formik.touched.email &&(
                  <div className='text-red-400 text-xs mt-1'>
                    {formik.errors.email}
                  </div>
                )}
              </div>

              <div className="relative mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
                <input
                  id="password"
                  name='password'
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full p-2 border rounded text-white placeholder-gray-400 text-sm sm:text-base
                   ${formik.errors.password && formik.touched.password ? "border-red-500" : "border-gray-700"}  
                  `}
                />

                {formik.errors.password && formik.touched.password && (
                  <div className='text-red-400 text-xs mt-1'>
                    {formik.errors.password}
                  </div>
                )}
              
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  // className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6"
                     className="absolute right-3 top-1/2 -translate-y-1/6"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>

              </div>
              <button
                type="submit"
                disabled={formik.isSubmitting || loading}
                className="w-full bg-gray-700 hover:bg-gray-800 text-white p-2 rounded-lg transition text-sm sm:text-base"
              >
                {formik.isSubmitting || loading ? "Creating..." :  "Create Account"}
              </button>
            </div>
            <div className="flex justify-center mt-3 text-sm text-gray-400">
              Already an account?{" "}
              <Link to="/emailLogin" className="ml-1 text-blue-400 hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </div>

        {/* Right Side - Image */}
        <div className="hidden md:block w-full h-64 md:w-1/2 md:h-auto">
          <img
            src={calender2}
            alt="Calendar Schedule"
            className="w-full h-full object-cover rounded-r-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default EmailSignupForm;