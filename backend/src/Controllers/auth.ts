import { Request, Response } from 'express';
import { prisma } from '../server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { mailPayload } from '../Email/mailPayload';
import { OAuth2Client } from "google-auth-library";
import moment from 'moment-timezone';
import dotenv from 'dotenv';
import { redisConfig } from '../Utilis/redis';
import { getUserCacheKey, getTokenCacheKey, getUsernameCacheKey, getUserEmailCacheKey, TIMEZONE_CACHE_KEY, getVerifiedCacheKey } from '../Utilis/helper';
import { json } from 'zod';
import { cached } from 'zod/v4/core/util.cjs';
dotenv.config();

const JWT_EXPIRES_IN = 9 * 24 * 60 * 60;
const CACHE_EXPIRES = 3600

// signup by email & send email to user for verification 
export const signupByEmail = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ status: false, message: "Required missing fields!" });
    }

    try {
        const redisClient = await redisConfig.getClient();

        // Check if user exists in Redis
        const cachedUserByEmail = await redisClient.get(getUserEmailCacheKey(email));
        const cachedUserByUsername = await redisClient.get(getUsernameCacheKey(username));
        if (cachedUserByEmail || cachedUserByUsername) {
            return res.status(400).json({ status: false, message: "Email or username already in use!!" });
        }

        // Check if user exists in DB
        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ email }, { username }] }
        });

        if (existingUser) {
            // Cache user in Redis
            await redisClient.setEx(getUserCacheKey(existingUser.id), CACHE_EXPIRES, JSON.stringify(existingUser));
            await redisClient.setEx(getUserEmailCacheKey(email), CACHE_EXPIRES, JSON.stringify(existingUser));
            await redisClient.setEx(getUsernameCacheKey(username), CACHE_EXPIRES, JSON.stringify(existingUser));
            return res.status(409).json({ status: false, message: "Email or username already in use!" });
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { username, email, password: hashedPassword }
        });

        // Generate JWT
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '9d' });

        // Update user with verification token
        await prisma.user.update({
            where: { id: user.id },
            data: { verificationToken: token }
        });

        // Cache new user and token in Redis
        await redisClient.setEx(getUserCacheKey(user.id), CACHE_EXPIRES, JSON.stringify(user));
        await redisClient.setEx(getUserEmailCacheKey(user.email), CACHE_EXPIRES, JSON.stringify(user));
        await redisClient.setEx(getUsernameCacheKey(user.username), CACHE_EXPIRES, JSON.stringify(user));
        await redisClient.setEx(getTokenCacheKey(user.id), JWT_EXPIRES_IN, token);

        // Send verification email
        const payload = { email: user.email, token };
        await mailPayload("email_verification", payload);

        return res.status(200).json({ status: true, message: "User created. Check your email for verification!" });

    } catch (error: any) {
        console.error(error.message);
        return res.status(500).json({ status: false, message: "Internal server error!" });
    }
};


// verify email by token 
export const verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.body;
    if (!token || typeof token !== "string") {
        return res.status(400).json({ status: false, message: "Token is required!" })
    }
    try {
        const redisClient = await redisConfig.getClient();

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }

        // check redis cache for user
        const cachedUser = await redisClient.get(getUserCacheKey(decoded.userId))
        let user = cachedUser ? JSON.parse(cachedUser) : null;

        if (!user) {
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
            });

            if (!user || user.verificationToken !== token) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid or expired verification tokens.",
                });
            }

            // cache user in redis
            await redisClient.setEx(getUserCacheKey(user.id), CACHE_EXPIRES, JSON.stringify(user));
            await redisClient.setEx(getUserEmailCacheKey(user.email), CACHE_EXPIRES, JSON.stringify(user));
            await redisClient.setEx(getUsernameCacheKey(user.username), CACHE_EXPIRES, JSON.stringify(user));
        }

        const updatedUser = await prisma.user.update({
            where: { id: decoded.userId, verificationToken: token },
            data: { verified: true, verificationToken: null }
        });
        const authToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET!, { expiresIn: '9d' })

        // update redis client with updated user data
        await redisClient.setEx(getUserCacheKey(updatedUser.id), CACHE_EXPIRES, JSON.stringify(updatedUser))
        await redisClient.setEx(getUserEmailCacheKey(updatedUser.email), CACHE_EXPIRES, JSON.stringify(updatedUser));
        await redisClient.setEx(getUsernameCacheKey(updatedUser.username), CACHE_EXPIRES, JSON.stringify(updatedUser));
        await redisClient.setEx(getVerifiedCacheKey(updatedUser.verified), CACHE_EXPIRES, JSON.stringify(updatedUser));
        await redisClient.setEx(getTokenCacheKey(updatedUser.id), JWT_EXPIRES_IN, authToken);

        return res.status(200).json({
            status: true, message: "Email Verified", authToken,
            user: {
                id: user.id,
                email: user.email,
                username: user.username
            }
        })
    }
    catch (error) {
        return res.status(500).json({ status: false, message: "Invalid or Expired Token" })
    }
}



// email login api
export const emailLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ status: false, message: "Email & Password is required!" })
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return res.status(400).json({ status: false, message: "Invalid email or password!" })
        }

        if (!user.verified) {
            return res.status(400).json({ status: false, message: "Please verify your email before login!" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password || '');
        if (!isPasswordValid) {
            return res.status(400).json({ status: false, message: "Invalid email or password!" })
        }

        const authToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '9d' });

        return res.status(200).json({
            status: true, message: "Login successful!", authToken,
            user: {
                id: user.id,
                email: user.email,
                username: user.username
            }
        })
    }
    catch (error: any) {
        console.log(error.message);
    }
}



// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// export const googleLoginOAuth = async (req: Request, res: Response) => {
//     const { idToken } = req.body;

//     if (!idToken || typeof idToken !== "string") {
//         return res.status(400).json({ status: false, message: "Google ID token is required!" });
//     }

//     try {
//         const ticket = await client.verifyIdToken({
//             idToken,
//             audience: process.env.GOOGLE_CLIENT_ID,
//         });

//         const payload = ticket.getPayload();
//         const email = payload?.email;
//         const googleId = payload?.sub;
//         const name = payload?.name;

//         if (!email || !googleId) {
//             return res.status(400).json({ status: false, message: "Invalid Google token payload!" });
//         }

//         let user = await prisma.user.findUnique({ where: { email } });
//         if (!user) {
//             user = await prisma.user.create({
//                 data: {
//                     email,
//                     googleId,
//                     username: name || `user_${googleId}`,
//                     verified: true,
//                     verificationToken: null,
//                     password: ''
//                 },
//             });
//         } else if (!user.googleId) {
//             user = await prisma.user.update({
//                 where: { email },
//                 data: { googleId, verified: true },
//             });
//         }

//         // Create your own JWT for your app
//         const authToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "9d" });

//         return res.status(200).json({
//             status: true,
//             message: "Google login successful!",
//             authToken,
//             user: {
//                 id: user.id,
//                 email: user.email,
//                 username: user.username,
//             },
//         });
//     } catch (error: any) {
//         console.error("Google login error:", error.message);
//         return res.status(500).json({ status: false, message: "Internal server error!" });
//     }
// }; 

// Google signup and login


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const googleLoginOAuth = async (req: Request, res: Response) => {
    const { idToken } = req.body;

    if (!idToken || typeof idToken !== "string") {
        return res.status(400).json({ status: false, message: "Google ID token is required!" });
    }

    try {
        const redisClient = await redisConfig.getClient();

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const email = payload?.email;
        const googleId = payload?.sub;
        const name = payload?.name;

        if (!email || !googleId) {
            return res.status(400).json({ status: false, message: "Invalid Google token payload!" });
        }

        // check redis cache for user email
        const cachedUser = await redisClient.get(getUserEmailCacheKey(email));
        let user = cachedUser ? JSON.parse(cachedUser) : null;

        // Helper to generate unique username
        const generateUniqueUsername = async (name: string | undefined) => {
            const baseName = (name || "user").replace(/\s+/g, '').toLowerCase();
            let username = "";
            let exists = true;

            while (exists) {
                const randomSuffix = Math.floor(1000 + Math.random() * 9000);
                username = `${baseName}_${randomSuffix}`;

                const existingUser = await prisma.user.findUnique({ where: { username } });
                exists = !!existingUser;
            }

            return username;
        };

        if (!user) {
            let dbUser = await prisma.user.findUnique({ where: { email } });
            if (!dbUser) {
                // create new user
                const generatedUsername = await generateUniqueUsername(name);
                const newUser = await prisma.user.create({
                    data: {
                        email,
                        googleId,
                        username: generatedUsername,
                        verified: true,
                        verificationToken: null,
                        password: ''
                    },
                });

                user = {
                    id: newUser.id,
                    email: newUser.email,
                    username: newUser.username,
                    verified: newUser.verified
                }

                // Cache new user data in Redis (excluding googleId and password)
                await redisClient.setEx(getUserCacheKey(user.id), CACHE_EXPIRES, JSON.stringify(user));
                await redisClient.setEx(getUserEmailCacheKey(user.email), CACHE_EXPIRES, JSON.stringify(user));
                await redisClient.setEx(getUsernameCacheKey(user.username), CACHE_EXPIRES, JSON.stringify(user));
                await redisClient.setEx(getVerifiedCacheKey(user.verified), CACHE_EXPIRES, JSON.stringify(user));

            } else {
                // Update existing user with googleId if not present
                if (!dbUser.googleId) {
                    const updatedUser = await prisma.user.update({
                        where: { email },
                        data: { googleId, verified: true },
                    });

                    user = {
                        id: updatedUser.id,
                        email: updatedUser.email,
                        username: updatedUser.username,
                        verified: updatedUser.verified,
                    };

                    // Update cache with updated user data
                    await redisClient.setEx(getUserCacheKey(user.id), CACHE_EXPIRES, JSON.stringify(user));
                    await redisClient.setEx(getUserEmailCacheKey(user.email), CACHE_EXPIRES, JSON.stringify(user));
                    await redisClient.setEx(getUsernameCacheKey(user.username), CACHE_EXPIRES, JSON.stringify(user));
                    await redisClient.setEx(getVerifiedCacheKey(user.verified), CACHE_EXPIRES, JSON.stringify(user));

                } else {
                    user = {
                        id: dbUser.id,
                        email: dbUser.email,
                        username: dbUser.username,
                        verified: dbUser.verified,
                    };

                    // Cache existing user data
                    await redisClient.setEx(getUserCacheKey(user.id), CACHE_EXPIRES, JSON.stringify(user));
                    await redisClient.setEx(getUserEmailCacheKey(user.email), CACHE_EXPIRES, JSON.stringify(user));
                    await redisClient.setEx(getUsernameCacheKey(user.username), CACHE_EXPIRES, JSON.stringify(user));
                    await redisClient.setEx(getVerifiedCacheKey(user.verified), CACHE_EXPIRES, JSON.stringify(user));
                }
            }
        }
        // Create your own JWT for your app
        const authToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "9d" });

        // if user found cached
        await redisClient.setEx(getTokenCacheKey(user.id), JWT_EXPIRES_IN, authToken);
        await redisClient.setEx(getVerifiedCacheKey(user.verified), JWT_EXPIRES_IN, JSON.stringify(user));

        return res.status(200).json({
            status: true,
            message: "Google login successful!",
            authToken,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
        });
    } catch (error: any) {
        console.error("Google login error:", error.message);
        return res.status(500).json({ status: false, message: "Internal server error!" });
    }
};



const RESET_SECRET = process.env.RESET_SECRET! || "supersecretkey";
export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ status: false, message: "Email is required!" });
        }

        const redisClient = await redisConfig.getClient();

        // Check Redis cache for user by email
        const cachedUser = await redisClient.get(getUserEmailCacheKey(email));
        let user = cachedUser ? JSON.parse(cachedUser) : null;
        console.log(user, "user cached")

        if (!user) {
            // Fetch user from database if not in cache
            const dbUser = await prisma.user.findUnique({
                where: { email },
            });
            console.log(dbUser, "user new ")

            if (!dbUser) {
                return res.status(400).json({ status: false, message: "Invalid user!" });
            }

            // Create user object for caching
            user = {
                id: dbUser.id,
                email: dbUser.email,
                username: dbUser.username,
                verified: dbUser.verified,
            };

            // Cache user data in Redis
            await redisClient.setEx(getUserCacheKey(user.id), CACHE_EXPIRES, JSON.stringify(user));
            await redisClient.setEx(getUserEmailCacheKey(user.email), CACHE_EXPIRES, JSON.stringify(user));
            await redisClient.setEx(getUsernameCacheKey(user.username), CACHE_EXPIRES, JSON.stringify(user));
        }

        const token = jwt.sign({ email: user.email }, process.env.RESET_SECRET!, { expiresIn: "10m" });
        await redisClient.setEx(getTokenCacheKey(user.id), JWT_EXPIRES_IN, token);

        // Generate reset URL
        const resetUrl = `http://localhost:5173/resetPassword?token=${token}`;

        // Send reset email
        const payload = {
            email: user.email,
            resetUrl,
        };
        await mailPayload("forgot_password", payload);

        return res.status(200).json({ status: true, message: "Please check your email for reset password!" });
    } catch (error: any) {
        console.error("Forgot password error:", error.message);
        return res.status(500).json({ status: false, message: "Internal server error!" });
    }
};

// forgot password 
// export const forgotPassword = async (req: Request, res: Response) => {
//     try {
//         const { email } = req.body;

//         if (!email) {
//             return res.status(400).json({ status: false, message: "Email is requried!" })
//         }

//         const validuser = await prisma.user.findUnique({
//             where: { email }
//         })
//         if (!validuser) {
//             return res.status(400).json({ status: false, message: "Invalid user!" })
//         }

//         const token = jwt.sign({ email: validuser.email }, RESET_SECRET, { expiresIn: "10m" })

//         const resetUrl = `http://localhost:5173/resetPassword?token=${token}`;

//         const payload = {
//             email: validuser.email,
//             resetUrl
//         }
//         await mailPayload("forgot_password", payload);

//         return res.status(200).json({ status: true, message: "Please check your email for reset password!" })

//     }
//     catch (error: any) {
//         console.log(error.message);
//         return res.status(500).json({ status: false, message: "internal server error!" })
//     }
// }



// Reset password 
// export const ResetPassword = async (req: Request, res: Response) => {
//     try {
//         const { token, password, confirmPassword } = req.body;
//         if (!token || !password || !confirmPassword) {
//             return res.status(400).json({ status: false, message: "Passaword , confirmPassword & token is required!" })
//         }

//         if (password !== confirmPassword) {
//             return res.status(400).json({ status: false, message: "Password must be same with confirmPassword!" })
//         }

//         let decoded: any
//         try {
//             decoded = jwt.verify(token, RESET_SECRET)
//             // console.log(decoded , "decoded token")
//         }
//         catch (err) {
//             return res.status(400).json({ status: false, message: "Invalid or Expired Link!" })
//         }

//         const user = await prisma.user.findUnique({
//             where: { email: decoded.email }
//         })
//         if (!user) {
//             return res.status(400).json({ status: false, message: "user not found!!" })
//         }

//         const hashedPassword = await bcrypt.hash(password, 10)

//         await prisma.user.update({
//             where: { email: decoded.email },
//             data: { password: hashedPassword }
//         })

//         return res.status(200).json({ status: true, message: "Password Reset successfully!" })
//     }
//     catch (error: any) {
//         console.log(error.message);
//         return res.status(500).json({ status: false, message: "Internal server error!" })
//     }
// }

export const ResetPassword = async (req: Request, res: Response) => {
    try {
        const { token, password, confirmPassword } = req.body;
        if (!token || !password || !confirmPassword) {
            return res.status(400).json({ status: false, message: "Passaword , confirmPassword & token is required!" })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ status: false, message: "Password must be same with confirmPassword!" })
        }

        let decoded: any
        try {
            decoded = jwt.verify(token, RESET_SECRET)
            // console.log(decoded , "decoded token")
        }
        catch (err) {
            return res.status(400).json({ status: false, message: "Invalid or Expired Link!" })
        }

        const redisClient = await redisConfig.getClient();
        const cachedUser = await redisClient.get(getUserEmailCacheKey(decoded.email))
        let user = cachedUser ? JSON.parse(cachedUser) : null;

        if (!user || !user.email || user.email !== decoded.email) {
            // find in db
            const dbUser = await prisma.user.findUnique({
                where: { email: decoded.email }
            })
            if (!dbUser) {
                return res.status(400).json({ status: false, message: "user not found!!" })
            }

            const user = {
                id: dbUser.id,
                email: dbUser.email,
                username: dbUser.username,
                verified: dbUser.verified
            }

            await redisClient.setEx(getUserEmailCacheKey(user.email), CACHE_EXPIRES, JSON.stringify(user))
        }

        // Verify user exists in the database 
        const dbUser = await prisma.user.findUnique({
            where: { email: decoded.email },
        });

        if (!dbUser) {  
            return res.status(400).json({ status: false, message: "Invalid user!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.update({
            where: { email: decoded.email },
            data: { password: hashedPassword }
        })

        return res.status(200).json({ status: true, message: "Password Reset successfully!" })
    }
    catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ status: false, message: "Internal server error!" })
    }
}




// get timezone
export const getAllTimezone = async (req: Request, res: Response) => {
    try {
        const timezones = moment.tz.names();
        return res.status(200).json({ status: true, message: "Timezone fetched successfully!", timezones })
    }
    catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ status: false, message: "Internal server error!" })
    }
}



