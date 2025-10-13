import { Request, Response } from "express";
import { prisma } from "../server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validateEmail, validatePassword } from "../Utilis/validation";
import { mailPayload } from "../Email/mailPayload";
import { OAuth2Client } from "google-auth-library";
import moment from "moment-timezone";
import dotenv from "dotenv";
dotenv.config();

// signup by email & send email to user for verification
export const signupByEmail = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ status: false, message: "Required missing fields!" });
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ status: false, message: "Email or username already in use!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "9d",
    });
    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken: token },
    });

    const payload = {
      email: user.email,
      token: token,
    };

    await mailPayload("email_verification", payload);

    return res.status(200).json({
      status: true,
      message: "user created. check your email for verification!",
    });
  } catch (error: any) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error!!" });
  }
};

// verify email by token
export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token || typeof token !== "string") {
    return res
      .status(400)
      .json({ status: false, message: "Token is required!" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.verificationToken !== token) {
      return res.status(400).json({
        status: false,
        message: "Invalid or expired verification tokens.",
      });
    }

    await prisma.user.update({
      where: { id: decoded.userId, verificationToken: token },
      data: { verified: true, verificationToken: null },
    });
    const authToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET!,
      { expiresIn: "9d" }
    );
    return res.status(200).json({
      status: true,
      message: "Email Verified",
      authToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        availabilities: user.availabilities,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Invalid or Expired Token" });
  }
};

// email login api
export const emailLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ status: false, message: "Email & Password is required!" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { availabilities: true },
    });

    if (!user) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid email or password!" });
    }

    if (!user.verified) {
      return res.status(400).json({
        status: false,
        message: "Please verify your email before login!",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || "");
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid email or password!" });
    }

    const authToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "9d",
    });

    return res.status(200).json({
      status: true,
      message: "Login successful!",
      authToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        availabilities: user.availabilities,
        timezone: user.timezone
      },
    });
  } catch (error: any) {
    console.log(error.message);
  }
};

// Google signup and login
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const googleLoginOAuth = async (req: Request, res: Response) => {
  const { idToken } = req.body;

  if (!idToken || typeof idToken !== "string") {
    return res
      .status(400)
      .json({ status: false, message: "Google ID token is required!" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    const googleId = payload?.sub;
    const name = payload?.name;

    if (!email || !googleId) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid Google token payload!" });
    }

    let user = await prisma.user.findUnique({
      where: { email },
      include: { availabilities: true },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          googleId,
          username: name || `user_${googleId}`,
          verified: true,
          verificationToken: null,
          password: "",
        },
      });
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { email },
        data: { googleId, verified: true },
      });
    }

    // Create your own JWT for your app
    const authToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "9d",
    });

    return res.status(200).json({
      status: true,
      message: "Google login successful!",
      authToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        availabilities: user.availabilities,
        timezone: user.timezone
      },
    });
  } catch (error: any) {
    console.error("Google login error:", error.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error!" });
  }
};

const RESET_SECRET = process.env.RESET_SECRET! || "supersecretkey";
// forgot password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ status: false, message: "Email is requried!" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ status: false, message: "Invalid Email!" });
    }

    const validuser = await prisma.user.findUnique({
      where: { email },
    });
    if (!validuser) {
      return res.status(400).json({ status: false, message: "Invalid user!" });
    }

    const token = jwt.sign({ email: validuser.email }, RESET_SECRET, {
      expiresIn: "10m",
    });

    const resetUrl = `http://localhost:5173/resetPassword?token=${token}`;

    const payload = {
      email: validuser.email,
      resetUrl,
    };
    await mailPayload("forgot_password", payload);

    return res.status(200).json({
      status: true,
      message: "Please check your email for reset password!",
    });
  } catch (error: any) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "internal server error!" });
  }
};

// Reset password
export const ResetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password, confirmPassword } = req.body;
    if (!token || !password || !confirmPassword) {
      return res.status(400).json({
        status: false,
        message: "Passaword , confirmPassword & token is required!",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: false,
        message: "Password must be same with confirmPassword!",
      });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, RESET_SECRET);
      // console.log(decoded , "decoded token")
    } catch (err) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid or Expired Link!" });
    }

    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });
    if (!user) {
      return res
        .status(400)
        .json({ status: false, message: "user not found!!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email: decoded.email },
      data: { password: hashedPassword },
    });

    return res
      .status(200)
      .json({ status: true, message: "Password Reset successfully!" });
  } catch (error: any) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error!" });
  }
};

// get timezone
export const getAllTimezone = async (req: Request, res: Response) => {
  try {
    const timezones = moment.tz.names();
    return res.status(200).json({
      status: true,
      message: "Timezone fetched successfully!",
      timezones,
    });
  } catch (error: any) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error!" });
  }
};
