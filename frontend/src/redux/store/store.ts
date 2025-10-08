import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../slices/authSlice';
import onboardReducer from '../slices/onboardSlice';


export const store = configureStore({
    reducer: {
        auth: authReducer,
        onboard: onboardReducer
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
