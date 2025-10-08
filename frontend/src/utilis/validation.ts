import * as yup from 'yup';

export const regex = {
    // simple email validation (username@domain.tld)
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 

  // At least 6 chars, one uppercase, one lowercase, one number
  password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/, 

  // Only letters, numbers, and underscores
  username: /^[a-zA-Z0-9_]+$/, 
};


export const emailValidation = yup.string()
    .matches(regex.email , "Invalid email format")
    .required("Email is required");


export const passwordValidation = yup.string()
    .matches(regex.password, "Password must have atleast 6 character ,one uppercase , one lowercase & one number")
    .min(6,"Too short")
    .required("Password is required");

export const usernameValidation = yup.string()
    .matches(regex.username , "only letters , numbers & underscores are allowed")
    .required("Username is required")
    .min(3,"Too short")
    .max(20,"Too long");




