import express from "express";
import { createEvent, deleteEvent, editEvent, getAllEvents, hideEvent } from "../Controllers/event";
import { createEventSchema, deleteEventSchema, editEventSchema, hiddenEventSchema } from "../validation/event.schema";
import { validateRequest } from "../Middleware/validateRequest";
import { authentication } from "../Middleware/auth";

const router = express.Router();

router.post("/createEvents",authentication,validateRequest(createEventSchema),createEvent);
router.get("/getEvents/:userId",authentication,getAllEvents);
router.delete("/deleteEvents/:userId/:eventId",authentication,validateRequest(deleteEventSchema),deleteEvent);
router.patch("/editEvents/:userId/:eventId",authentication,validateRequest(editEventSchema),editEvent);
router.patch("/hideEvents/:userId/:eventId",authentication,validateRequest(hiddenEventSchema),hideEvent);



export default router;
