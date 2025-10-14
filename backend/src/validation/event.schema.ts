import z from "zod";

export const createEventSchema = z.object({
  body: z.object({
    userId: z.number().int().positive("userId must be a positive number"),
    title: z.string().min(1, "title is required"),
    url: z.string().min(1, "url is required"),
    description: z.string().min(1, "description is required"),
    duration: z.string().min(1, "duration is required"),
  }),
});

export const deleteEventSchema = z.object({
   params: z.object({
    userId: z
      .string()
      .regex(/^\d+$/, "userId must be a positive integer")
      .transform((val) => Number(val)),
    eventId: z
      .string()
      .regex(/^\d+$/, "eventId must be a positive integer")
      .transform((val) => Number(val)),
  }),
})


export const editEventSchema = z.object({
  params: z.object({
    userId: z
      .string()
      .regex(/^\d+$/, "userId must be a positive integer")
      .transform((val) => Number(val)),
    eventId: z
      .string()
      .regex(/^\d+$/, "eventId must be a positive integer")
      .transform((val) => Number(val)),
  }),
  body: z.object({
    title: z.string().min(1, "title cannot be empty").optional(),
    url: z.string().min(1, "url cannot be empty").optional(),
    description: z.string().min(1, "description cannot be empty").optional(),
    duration: z.string().min(1, "duration cannot be empty").optional(),
  }),
});


export const hiddenEventSchema = z.object({
  params: z.object({
    userId: z
      .string()
      .regex(/^\d+$/, "userId must be a positive integer")
      .transform((val) => Number(val)),
    eventId: z
      .string()
      .regex(/^\d+$/, "eventId must be a positive integer")
      .transform((val) => Number(val)),
  }),
  body: z.object({
    hidden: z.boolean(),
  }),
});


export type CreateEventInput = z.infer<typeof createEventSchema>["body"];
export type deleteEventInput = z.infer<typeof deleteEventSchema>["params"];
export type EditEventInput = z.infer<typeof editEventSchema>;
export type HiddenEventInput = z.infer<typeof hiddenEventSchema>;
