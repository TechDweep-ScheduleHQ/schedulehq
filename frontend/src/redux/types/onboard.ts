export interface CalenderAuthResponse{
    status:boolean,
    message:string,
    authUrl:string
}

export interface ZoomAuthResponse{
    status:boolean,
    message:string,
    authUrl:string
}


export interface TimeSlot {
  start: string;
  end: string;
}

export interface Availability {
  day: string;
  enabled: boolean;
  timeSlots: TimeSlot[];
}

export interface OnboardingPayload {
  // username: string;
  // email: string;
  timezone: string;
  availability: Availability[];
  bio: string;
  profilePhotoUrl: string;
}

export interface OnboardingResponse{
    status: boolean;
    message: string;
}