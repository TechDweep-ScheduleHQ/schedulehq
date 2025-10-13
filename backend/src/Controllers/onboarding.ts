import { Request, Response } from "express";
import { google } from 'googleapis';
import { prisma } from '../server';
import axios from 'axios';
import { AuthRequest } from '../Middleware/auth';
import dotenv from 'dotenv';
import { Prisma } from "@prisma/client";
import { redisConfig } from "../Utilis/redis";
import { getUserOnboardingCacheKey } from "../Utilis/helper";
dotenv.config();

const CACHE_EXPIRES = 3600

// integrate google calender 
const OAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URL!
)

export const authGoogleCalender = (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(400).json({ status: false, message: "userId is missing!" })
    }

    const state = encodeURIComponent(
        Buffer.from(JSON.stringify({
            userId,
            // returnTo: req.headers.referer || 'http://localhost:5173/getStarted/calender',
            returnTo: process.env.FRONTEND_CALENDER_URL,
        })).toString("base64")
    );

    const authUrl = OAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar'],
        prompt: 'consent',
        state,
        redirect_uri: process.env.GOOGLE_REDIRECT_URL,
    })
    return res.status(200).json({ status: true, message: "auth calender redirect url created!", authUrl })
};


const isValidBase64 = (str: string) => {
    try {
        return Buffer.from(decodeURIComponent(str), 'base64').toString() && true;
    } catch {
        return false;
    }
};
export const googleCalenderCallback = async (req: AuthRequest, res: Response) => {
    const { code, state } = req.query;

    if (!code || !state) {
        return res.status(400).json({ status: false, message: "No code or state found!" })
    }

    if (!isValidBase64(state as string)) {
        return res.status(400).json({ status: false, message: "Invalid state parameter!" });
    }

    try {
        const decodedState = JSON.parse(
            Buffer.from(decodeURIComponent(state as string), 'base64').toString()
        );

        // console.log("Decoded state:", decodedState);
        const { userId, returnTo } = decodedState
        // const userId = req.user?.userId
        if (!userId) {
            return res.status(400).json({ status: false, message: "Unauthorized! no userId found." })
        }

        const { tokens } = await OAuth2Client.getToken(code as string)
        const existingConnection = await prisma.calenderConnection.findFirst({
            where: { userId, type: 'google' }
        });

        if (existingConnection) {
            await prisma.calenderConnection.update({
                where: { id: existingConnection.id },
                data: {
                    accessToken: tokens.access_token!,
                    refreshToken: tokens.refresh_token!,
                    expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
                }
            })
        }
        else {
            await prisma.calenderConnection.create({
                data: {
                    userId,
                    type: 'google',
                    accessToken: tokens.access_token!,
                    refreshToken: tokens.refresh_token!,
                    expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
                    calenderId: 'primary'
                }
            })
        }
        res.redirect(returnTo);
    }
    catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ status: false, message: "Internal server error!" })
    }
}



// zoom integration
const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;
const ZOOM_REDIRECT_URI = process.env.ZOOM_REDIRECT_URI || "hjkhkj";

export const authZoom = (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(400).json({ status: false, message: "userId is missing!" })
    }

    const state = encodeURIComponent(
        Buffer.from(JSON.stringify({
            userId,
            returnTo: process.env.FRONTEND_ZOOM_URL
        })).toString("base64")
    )

    const authUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${ZOOM_CLIENT_ID}&redirect_uri=${encodeURIComponent(ZOOM_REDIRECT_URI)}&state=${state}`;

    return res.status(200).json({ status: true, message: "auth zoom redirect url created!", authUrl })
}



export const zoomCallback = async (req: AuthRequest, res: Response) => {
    const { code, state } = req.query;
    if (!code || !state) {
        return res.status(400).json({ status: false, message: "Code & state Missing!" })
    }
    if (!isValidBase64(state as string)) {
        return res.status(400).json({ state: false, message: "Invalid state parameter!" })
    }

    try {
        const decodedState = JSON.parse(
            Buffer.from(decodeURIComponent(state as string), 'base64').toString()
        )

        const { userId, returnTo } = decodedState;
        if (!userId) {
            return res.status(400).json({ status: false, message: "userId is missing!" })
        }

        const tokenResponse = await axios.post('https://zoom.us/oauth/token', null, {
            params: {
                grant_type: 'authorization_code',
                code,
                redirect_uri: ZOOM_REDIRECT_URI
            },
            headers: {
                Authorization: `Basic ${Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64')}`,
            }
        })

        const { access_token, refresh_token, expires_in } = tokenResponse.data;
        const expiryDate = new Date(Date.now() + expires_in * 1000);

        const existingConnection = await prisma.videoConnection.findFirst({
            where: { userId, type: 'zoom' }
        })

        if (existingConnection) {
            await prisma.videoConnection.update({
                where: { id: existingConnection.id },
                data: {
                    accessToken: access_token,
                    refreshToken: refresh_token,
                    expiryDate,
                    accountId:"primary"
                }
            })
        }
        else {
            await prisma.videoConnection.create({
                data: {
                    userId,
                    type: "zoom",
                    accessToken: access_token,
                    refreshToken: refresh_token,
                    expiryDate,
                    accountId: "primary"
                }
            })
        }
        res.redirect(returnTo);
    }
    catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ status: false, message: "Internal server error!" })
    }
}




// complete setup for onboarding
interface AvailabilityData {
    day: string,
    enabled: boolean,
    timeSlots: { start: string; end: string }[];
}

interface SetupData {
    timezone: string,
    availability: AvailabilityData[]
    bio?: string;
    profilePhotoUrl?: string
}

export const completeSetupOnboarding = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ status: false, message: "userId is missing!" })
    }

    const data: SetupData = req.body;
    if (!data.timezone || !data.availability) {
        return res.status(400).json({ status: false, message: "Missing required fields!" })
    }

    if (!Array.isArray(data.availability)) {
        return res.status(400).json({ status: false, message: "Availability must be an array!" })
    }

    try {
        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // update user
            await tx.user.update({
                where: { id: userId },
                data: {
                    timezone: data.timezone,
                    bio: data.bio,
                    profilePhotoUrl: data.profilePhotoUrl
                }
            });

            // create Availabalities 
            for (const avail of data.availability) {
                await tx.availability.create({
                    data: {
                        userId,
                        day: avail.day.toLowerCase(),
                        enabled: avail.enabled,
                        timeSlots: avail.timeSlots
                    }
                })
            }
        });
        
        // cache data for redis 
        const cachedData = {
            timezone : data.timezone,
            bio : data.bio,
            availability:  data.availability
        }

        const redisClient = await redisConfig.getClient();
        await redisClient.setEx(getUserOnboardingCacheKey(userId),CACHE_EXPIRES , JSON.stringify(cachedData));

        return res.status(200).json({ status: true, message: "User Onboarded successfully!"})
    }
    catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ status: false, message: "Internal server error!" })
    }
}



