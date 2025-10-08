export const BASE_URL = 'http://localhost:5000/api';

export const AUTH_URL = {
  SIGNUP: `${BASE_URL}/auth/signupByEmail`,
  LOGIN: `${BASE_URL}/auth/loginEmail`,
  VERIFY_EMAIL: `${BASE_URL}/auth/verifyEmail`,
  FORGOT_PASSWORD: `${BASE_URL}/auth/forgotPassword`,
  RESET_PASSWORD: `${BASE_URL}/auth/resetPassword`,
  GOOGLE_LOGIN: `${BASE_URL}/auth/loginGoogle`,
  TIMEZONES: `${BASE_URL}/auth/getTimezone`,
};


export const ONBOARD_URL = {
  GOOGLE_CALENDAR: `${BASE_URL}/onboard/auth/google-calender`,
  ZOOM: `${BASE_URL}/onboard/auth/zoom`,
  COMPLETE_ONBOARDING: `${BASE_URL}/onboard/setup/onboarding`,
};