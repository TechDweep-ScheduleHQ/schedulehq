// for auth file 
export const getUserCacheKey = (userId : number) => `user:${userId}`;
export const getTokenCacheKey = (userId : number) => `token:${userId}`;
export const getUsernameCacheKey = (username : string) => `username:${username}`;
export const getUserEmailCacheKey = (email : string) => `email:${email}`;
export const getVerifiedCacheKey = (verified : boolean) => `verified:${verified}`;
export const getUserOnboardingCacheKey = (userId : number) => `user:onboarding:${userId}`;
<<<<<<< HEAD
=======
export const getUserEventCacheKey = (userId : number) => `event:userId:${userId}`;

>>>>>>> redis

export const TIMEZONE_CACHE_KEY = 'timezones';



