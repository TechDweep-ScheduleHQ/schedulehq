// for auth file 
export const getUserCacheKey = (userId : number) => `user:${userId}`;
export const getTokenCacheKey = (userId : number) => `token:${userId}`;
export const getUsernameCacheKey = (username : string) => `username:${username}`;
export const getUserEmailCacheKey = (email : string) => `email:${email}`;
export const getVerifiedCacheKey = (verified : boolean) => `verified:${verified}`;

export const TIMEZONE_CACHE_KEY = 'timezones';



