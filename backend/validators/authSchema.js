import { z } from "zod/v4";

export const sendOtpSchema = z.object({
    email: z
    .email("Please enter a valid email!")
});

export const verifyOtpSchema = z.object({
    email: z
    .email("Please enter a valid email!"),
    otp: z
    .string("Please enter a valid 4 digit OTP!")
    .regex(/^\d{4}$/, "Please enter a valid 4 digit OTP!")
});

export const loginSchema = z.object({
    email: z
    .email("Please enter a valid email!"),
    password: z
    .string("Please enter a valid password!")
    .min(4, "Password should be atleast 4 digit long!")
    .max(8, "Password can be at max 8 characters!")
});

export const registerSchema = loginSchema.extend({
    name: z
    .string("Please enter a valid name!")
    .min(3, "Name should be atleast 3 characters!")
    .max(40, "Name can be at max 100 characters!"),
    otp: z
    .string("Please enter a valid 4 digit OTP!")
    .regex(/^\d{4}$/, "Please enter a valid 4 digit OTP!")
});
