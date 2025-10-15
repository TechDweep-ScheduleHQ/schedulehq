// import { Request, Response } from "express";
// import { prisma } from '../server';
// import dotenv from 'dotenv';
// dotenv.config();
// // utils/zoom.ts
// import axios from 'axios';


// export const scheduleZoomMeeting = async (duration: number, startTime: Date) => {
//     const token = process.env.ZOOM_JWT_TOKEN;

//     const response = await axios.post(
//         'https://api.zoom.us/v2/users/me/meetings',
//         {
//             topic: 'Client Meeting',
//             type: 2, // scheduled
//             start_time: startTime,
//             duration: duration,
//             settings: { join_before_host: true },
//         },
//         { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
//     );

//     return response.data.join_url;
// };


// export const createClientMeeting = async (req: Request, res: Response) => {
//     try {
//         const { userId, clientName, clientEmail, meetingDuration, meetingType, timezone, meetingDate, hourDuration, meetingTime } = req.body;

//         const validUser = await prisma.user.findUnique({ where: { id: Number(userId) } })
//         if (!validUser) {
//             return res.status(400).json({ status: false, message: "User not found!" })
//         }

//         // create client booking
//         const booking = await prisma.client.create({
//             data: {
//                 userId: Number(userId),
//                 clientName,
//                 clientEmail,
//                 meetingDuration,
//                 meetingType,
//                 timezone,
//                 meetingDate,
//                 hourDuration,
//                 meetingTime
//             }
//         })

//         // create zoom meeting
//         const zoomLink = await scheduleZoomMeeting(
//             meetingDuration,
//             new Date(meetingTime)
//         )

//         // create google calender event with zoom link 
//         const googleEvent = await createGoogleEventWithZoomLink(
//             clientName,
//             clientEmail,
//             new Date(meetingTime),
//             meetingDuration,
//             zoomLink
//         )


//         // utils/googleCalendar.ts
//         import { google } from 'googleapis';

//         export const createGoogleEventWithZoomLink = async (
//             clientName: string,
//             clientEmail: string,
//             startTime: Date,
//             duration: number,
//             zoomLink: string
//         ) => {
//             const oAuth2Client = new google.auth.OAuth2(
//                 process.env.GOOGLE_CLIENT_ID,
//                 process.env.GOOGLE_CLIENT_SECRET,
//                 process.env.GOOGLE_REDIRECT_URI
//             );
//             oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

//             const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
//             const endTime = new Date(startTime.getTime() + duration * 60000);

//             const event = {
//                 summary: 'Client Meeting',
//                 description: `Zoom Meeting Link: ${zoomLink}`,
//                 start: { dateTime: startTime.toISOString(), timeZone: 'Asia/Kolkata' },
//                 end: { dateTime: endTime.toISOString(), timeZone: 'Asia/Kolkata' },
//                 attendees: [{ email: clientEmail }],
//                 reminders: { useDefault: false, overrides: [{ method: 'email', minutes: 10 }, { method: 'popup', minutes: 5 }] },
//             };

//             const response = await calendar.events.insert({
//                 calendarId: 'primary',
//                 resource: event,
//                 sendUpdates: 'all',
//             });

//             return response.data; // contains htmlLink for calendar
//         };



//         // // 5️⃣ Send confirmation email after 15 minutes
//         // setTimeout(() => {
//         //     sendMeetingEmail(clientEmail, clientName, zoomLink, new Date(meetingTime));
//         // }, 15 * 60 * 1000);

//         // 6️⃣ Respond with booking details
//         return res.status(200).json({
//             status: true,
//             message: 'Meeting booked successfully!',
//             booking: {
//                 id: booking.id,
//                 clientName,
//                 clientEmail,
//                 meetingTime,
//                 zoomLink,
//                 googleEventLink: googleEvent.htmlLink,
//             },
//         });

//     }
//     catch (error: any) {
//         console.log(error.message);
//         return res.status(500).json({ status: false, message: "Internal server error!" })
//     }
// }