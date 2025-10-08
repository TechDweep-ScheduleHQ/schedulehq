import z from "zod";

export const signupByEmailSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(20, "Username must not exceed 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: z.string().email({ message: "Invalid email" }),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#_])[A-Za-z\d@$!%*?&^#_]{6,}$/,
        "Password must include uppercase, lowercase,symbol and a number"
      ),
  }),
});

export const emailLoginSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email" }),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#_])[A-Za-z\d@$!%*?&^#_]{6,}$/,
        "Password must include uppercase, lowercase,symbol and a number"
      ),
  }),
});


export const resetPasswordSchema = z.object({
  body: z
    .object({
      token: z.string().nonempty("Please provide token"),

      password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#_])[A-Za-z\d@$!%*?&^#_]{6,}$/,
          "Password must include uppercase, lowercase, symbol, and a number"
        ),

      confirmPassword: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#_])[A-Za-z\d@$!%*?&^#_]{6,}$/,
          "Password must include uppercase, lowercase, symbol, and a number"
        ),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Password and Confirm Password must match",
    }),
});

export type SignupByEmailInput = z.infer<typeof signupByEmailSchema>["body"];
export type EmailLoginInput = z.infer<typeof emailLoginSchema>["body"];
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>["body"];