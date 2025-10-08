import z from "zod";

export const completeSetupOnboardingSchema = z.object({
  body: z.object({
    timezone: z.string().refine(
      (tz) => {
        try {
          new Intl.DateTimeFormat(undefined as any, { timeZone: tz });
          return true;
        } catch {
          return false;
        }
      },
      { message: "Invalid timezone" }
    ),
    availability: z.array(
      z.object({
        day: z.string(),
        enabled: z.boolean(),
        timeSlots: z.array(
          z.object({
            start: z.string(),
            end: z.string(),
          })
        ),
      })
    ),
    bio: z.string().max(1000).optional(),
    profilePhotoUrl: z.string().url().optional(),
  }),
});

export type CompleteSetupOnboardingInput = z.infer<typeof completeSetupOnboardingSchema>["body"];
