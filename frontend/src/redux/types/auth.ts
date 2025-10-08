export interface SignupValues{
  username:string,
  email:string,
  password:string
}

export interface SignupResponse{
  status:boolean,
  message:string
}

export interface LoginValues{
    email:string,
    password:string
}

export interface LoginResponse{
  status:boolean,
  message:string,
  authToken:string,
  user:{
    id:number,
    email:string,
    username:string
  }
}

export interface VerifyEmailResponse{
  status:boolean,
  message:string,
  authToken:string,
  user:{
    id:number,
    email:string,
    username:string
  }
}


export interface ForgotPasswordValues{
  email:string
}

export interface ForgotPasswordResponse{
  status:boolean,
  message:string
}

export interface ResetPasswordValues{
  token:string,
  password:string,
  confirmPassword:string
}

export interface ResetPasswordResponse{
  status:boolean,
  message:string
}


export interface GoogleLoginValues{
  idToken:string
}

export interface GoogleLoginResponse{
  status:boolean,
  message:string,
  authToken:string,
  user:{
    id:number,
    email:string,
    username:string 
  }
}


export interface TimeZoneResponse{
  status:boolean,
  message:string,
  timezones:string[]
}