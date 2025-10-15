import { Request, Response } from 'express';
import { prisma } from '../server';
import { redisConfig } from '../Utilis/redis';
import dotenv from 'dotenv';
import { getUserEventCacheKey } from '../Utilis/helper';
dotenv.config();

const CACHE_EXPIRES = 3600

export const createEvent = async (req: Request, res: Response) => {
    try {
        const { userId, title, url, description, duration } = req.body;

        // existing user or not 
        const validUser = await prisma.user.findUnique({
            where: { id: Number(userId) }
        })
        if (!validUser) {
            return res.status(400).json({ status: false, message: "User not found!!" })
        }

        // create events
        const newEvent = await prisma.event.create({
            data: {
                userId: Number(userId),
                title,
                url,
                description,
                duration
            }
        })

        const redisClient = await redisConfig.getClient();
        const cacheKey = getUserEventCacheKey(Number(userId));
        await redisClient.setEx(cacheKey, CACHE_EXPIRES, JSON.stringify(newEvent))

        return res.status(200).json({ status: true, message: "Events created successfully!", newEvent })
    }
    catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ status: false, message: "Internal server error!" })
    }
}



// get all events with searching and pagination
export const getAllEvents = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10, search = '' } = req.query;

        // validate userId
        const validUser = await prisma.user.findUnique({
            where: { id: Number(userId) }
        })
        if (!validUser) {
            return res.status(400).json({ status: false, message: "User not found!!" })
        }

        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);
        const skip = (pageNumber - 1) * limitNumber;

        const searchFilter = search ? {
            AND: [
                { userId: Number(userId) },
                {
                    OR: [
                        { title: { contains: search as string, mode: 'insensitive' } },
                        { duration: { contains: search as string, mode: 'insensitive' } }
                    ]
                }
            ]
        }
            : { userId: Number(userId) }

        // fetch event from database with search & pagination 
        const events = await prisma.event.findMany({
            where: searchFilter,
            skip,
            take: limitNumber,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { email: true, username: true } } }
        })

        const totalEvents = await prisma.event.count({ where: searchFilter });
        const totalPages = Math.ceil(totalEvents / limitNumber)

        return res.status(200).json({
            status: true, message: "Events fetched successfully!",
            data: {
                events,
                totalEvents,
                totalPages,
                currentPage: pageNumber
            }
        })
    }
    catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ status: false, message: "Interval server error!" })
    }
}




// edit event
export const editEvent = async (req: Request, res: Response) => {
    try {
        const { userId, eventId } = req.params;
        const { title, url, description, duration } = req.body;

        const validUser = await prisma.user.findUnique({ where: { id: Number(userId) } })

        if (!validUser) {
            return res.status(400).json({ status: false, message: "User not found!" })
        }

        const validEvent = await prisma.event.findFirst({
            where: {
                id: Number(eventId),
                userId: Number(userId)
            }
        });

        if (!validEvent) {
            return res.status(400).json({ status: false, message: "Event not found or not belong to this user!" })
        }

        const updatedEvent = await prisma.event.update({
            where: { id :  validEvent.id },
            data: {
                title: title ?? validEvent.title,
                url: url ?? validEvent.url,
                description: description ?? validEvent.description,
                duration: duration ?? validEvent.duration,
                updatedAt: new Date()
            }
        })

        return res.status(200).json({ status: true, message: "Event updated successfully", updatedEvent })
    }
    catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ status: false, message: "Internal server error!" })
    }
}




// delete events by id 
export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const { userId, eventId } = req.params;

        const validUser = await prisma.user.findUnique({
            where: { id: Number(userId) }
        })
        if (!validUser) {
            return res.status(400).json({ status: false, message: "User not found!" })
        }

        const validEvent = await prisma.event.findFirst({
            where: {
                id: Number(eventId),
                userId: Number(userId) 
            }
        });

        if (!validEvent) {
            return res.status(400).json({ status: false, message: "Event not found or not belong to this user!" })
        }

        const deletedEvents = await prisma.event.delete({
            where: { id: validEvent.id }
        })

        return res.status(200).json({ status: false, message: "Event deleted successfully!!", deletedEvents })
    }
    catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ status: false, message: "Internal server error!" })
    }
}



// hide event 
export const hideEvent = async (req: Request , res: Response) => {
    try{
        const {userId , eventId } = req.params;
        const {hidden} = req.body

        const validUser = await prisma.user.findUnique({where: {id : Number(userId)}})
        if(!validUser){
            return res.status(400).json({status:false,message:"User not found!!"})
        }

        const validEvent = await prisma.event.findFirst({
            where: {id : Number(eventId) , userId : Number(userId)}
        })
        if(!validEvent){
            return res.status(400).json({status:false,message:"Invalid Event or event not belong to this user!"})
        }

        const events = await prisma.event.update({
            where: {id : validEvent.id},
            data: {
                hidden : hidden,
                updatedAt : new Date()
            } 
        })
        return res.status(200).json({status:true,message:"Event hide successfully!",events})
    }
    catch(error:any){
        console.log(error.message);
        return res.status(500).json({status:false,message:"Internal server error!"})
    }
}