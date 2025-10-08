import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../constants/axiosInstane";
import type {SignupValues , LoginValues , SignupResponse , LoginResponse , VerifyEmailResponse , ForgotPasswordValues , ForgotPasswordResponse , ResetPasswordValues ,ResetPasswordResponse , GoogleLoginResponse , GoogleLoginValues , TimeZoneResponse}  from "../types/auth";
import { AUTH_URL } from "../../constants/api";

interface AuthState{
    loading: boolean;
    error: string | null;
    success: boolean;
    isAuthenticated: boolean;
    token: string | null;
    user:{id:number,email:string,username:string} | null;
    verificationStatus: 'idle' | 'pending' | 'success' | 'failed';
    verificationMessage: string | null;
    forgotPasswordStatus: 'idle' | 'pending' | 'success' | 'failed';
    forgotPasswordMessage: string | null;
    resetPasswordStatus: 'idle' | 'pending' | 'success' | 'failed';
    resetPasswordMessage: string | null;
    timezones: string[],
    timezoneStatus: 'idle' | 'pending' | 'success' | 'failed';
}

const initialState: AuthState = {
    loading: false,
    error:null,
    success:false,
    isAuthenticated: !!localStorage.getItem('Token'),
    token: localStorage.getItem('Token') || null,
    user:null,
    verificationStatus: 'idle',
    verificationMessage: null,
    forgotPasswordStatus: 'idle',
    forgotPasswordMessage: null,
    resetPasswordStatus: 'idle',
    resetPasswordMessage: null,
    timezones: [],
    timezoneStatus: 'idle'
}

export const signup = createAsyncThunk(
    'auth/signup',
    async (values: SignupValues, {rejectWithValue}) => {
        try{
            const response = await axiosInstance.post<SignupResponse>(
            AUTH_URL.SIGNUP,
            values);
            return response.data;
        }
        catch(error:any){
            return rejectWithValue(error.response?.data?.message || 'Signup failed. Please try again!')
        }
    }
)


export const login = createAsyncThunk(
    'auth/login',
    async (values: LoginValues , {rejectWithValue}) => {
        try{
            const response = await axiosInstance.post<LoginResponse>(
            AUTH_URL.LOGIN,    
            values);
            const {authToken } = response.data
            localStorage.setItem("Token",authToken)
            return response.data;
        }
        catch(error:any){
            return rejectWithValue(error.response?.data?.message || 'Login failed. Please try again!')
        }
    }
)

export const verifyEmail = createAsyncThunk<VerifyEmailResponse,{token:string}>(
    'auth/verifyEmail',
    async ({token} , {rejectWithValue}) => {
        try{
            const response = await axiosInstance.post<VerifyEmailResponse>(
            AUTH_URL.VERIFY_EMAIL,
            {token});
            const {authToken} = response.data;
            localStorage.setItem("Token",authToken);
            return response.data;
        }
        catch(error:any){
            return rejectWithValue(error.response?.data?.message || 'Email Verification failed.')
        }
    }
)


export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async(values:ForgotPasswordValues , {rejectWithValue}) => {
        try{
            const response = await axiosInstance.post<ForgotPasswordResponse>(
            AUTH_URL.FORGOT_PASSWORD,
            values);
            return response.data;
        }
        catch(error:any){
            return rejectWithValue(error.response?.data?.message || 'Failed to sent Forgot password email!')
        }
    }
)


export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async(values:ResetPasswordValues, {rejectWithValue}) => {
        try{
            const response = await axiosInstance.post<ResetPasswordResponse>(
            AUTH_URL.RESET_PASSWORD,
            values)
            return response.data;
        }
        catch(error:any){
            return rejectWithValue(error.response?.data?.message || 'Failed to set password!')
        }
    }
)


export const googleLogin = createAsyncThunk(
    'auth/googlelogin',
    async(values:GoogleLoginValues,{rejectWithValue}) => {
        try{
            const response = await axiosInstance.post<GoogleLoginResponse>(
            AUTH_URL.GOOGLE_LOGIN,
            values);
            const {authToken} = response.data;
            localStorage.setItem("Token",authToken);
            return response.data;
        }
        catch(error:any){
            console.log(error.message);
            return rejectWithValue(error.response?.data?.message || 'Google login Failed!')
        }
    }
)


export const fetchTimezones = createAsyncThunk(
    'auth/timezones',
    async(_,{rejectWithValue}) => {
        try{
            const response = await axiosInstance.get<TimeZoneResponse>(AUTH_URL.TIMEZONES)
            return response.data.timezones;
        }
        catch(error:any){
            console.log(error.message);
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch timezone!')
        }
    }
)


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetAuthState: (state) => {
            state.error = null;
            state.success = false;
            state.loading = false;
            state.verificationStatus = 'idle';
            state.verificationMessage = null;
            state.forgotPasswordStatus = 'idle';
            state.forgotPasswordMessage = null;
            state.resetPasswordStatus = 'idle';
            state.resetPasswordMessage = null;
            state.timezoneStatus = 'idle';
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.user = null;
            localStorage.removeItem("Token");
        }
    },

    extraReducers: (builder) => {
        builder
            // Email Signup case
             .addCase(signup.pending,(state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
             })
             .addCase(signup.fulfilled,(state) => {
                state.loading = false;
                state.success = true;
                state.error = null;
             }) 
             .addCase(signup.rejected,(state,action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.success = false;
             })

            // Email login case
             .addCase(login.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
             })
             .addCase(login.fulfilled, (state,action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.isAuthenticated = true;
                state.token = action.payload.authToken || null;
                state.user = action.payload.user;
             })
             .addCase(login.rejected,(state,action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
                state.isAuthenticated = false;
                state.token = null;
                state.user = null;
             })
            //  verify email case
            .addCase(verifyEmail.pending,(state) => {
                state.verificationStatus = 'pending';
                state.verificationMessage = null;
                state.error = null;
            })
            .addCase(verifyEmail.fulfilled,(state,action) => {
                state.verificationStatus = 'success';
                state.verificationMessage = action.payload.message;
                state.isAuthenticated = true;
                state.token = action.payload.authToken;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(verifyEmail.rejected,(state,action) => {
                state.verificationStatus = 'failed';
                state.verificationMessage = action.payload as string;
                state.error = action.payload as string;
            })
            // forgot password case
            .addCase(forgotPassword.pending,(state) => {
                state.loading = true;
                state.error = null;
                state.forgotPasswordStatus = 'pending';
                state.forgotPasswordMessage = null;
            })
            .addCase(forgotPassword.fulfilled,(state,action) => {
                state.loading = false;
                state.forgotPasswordStatus = 'success';
                state.forgotPasswordMessage = action.payload.message;
                state.error = null;
            })
            .addCase(forgotPassword.rejected,(state,action) => {
                state.loading = false;
                state.forgotPasswordStatus = 'failed';
                state.forgotPasswordMessage = action.payload as string;
                state.error = action.payload as string;
            })

            // Reset password case
            .addCase(resetPassword.pending,(state)=> {
                state.loading = true;
                state.error = null;
                state.resetPasswordStatus = 'pending';
                state.resetPasswordMessage = null;
            })
            .addCase(resetPassword.fulfilled,(state,action) => {
                state.loading = false;
                state.resetPasswordMessage = action.payload.message;
                state.resetPasswordStatus = 'success';
                state.error = null
            })
            .addCase(resetPassword.rejected,(state,action) => {
                state.loading = false;
                state.resetPasswordMessage = action.payload as string;
                state.resetPasswordStatus = 'failed';
                state.error = action.payload as string;
            })
            // google login case
            .addCase(googleLogin.fulfilled,(state,action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.isAuthenticated = true;
                state.token = action.payload.authToken;
                state.user = action.payload.user;
            })
            .addCase(googleLogin.pending,(state)=> {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(googleLogin.rejected,(state,action)=> {
                state.loading = false;
                state.error = action.payload as string;
                state.success = false;
            })

            // fetch timezone
            .addCase(fetchTimezones.pending,(state) => {
                state.timezoneStatus = 'pending',
                state.error = null
            })
            .addCase(fetchTimezones.fulfilled,(state,action) => {
                state.timezoneStatus = 'success',
                state.timezones = action.payload,
                state.error = null
            })
            .addCase(fetchTimezones.rejected,(state,action) => {
                state.timezoneStatus = 'failed',
                state.error = action.payload as string
            })
    },
});

export const {resetAuthState ,logout} = authSlice.actions;
export default authSlice.reducer;

