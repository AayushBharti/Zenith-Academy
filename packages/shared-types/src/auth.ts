import { z } from "zod";
import { userSummarySchema } from "./user";

// Request schemas
export const sendOtpSchema = z.object({
  email: z.string().email(),
});
export type SendOtpInput = z.infer<typeof sendOtpSchema>;

export const signupSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    accountType: z.enum(["Admin", "Instructor", "Student"]),
    contactNumber: z.string().optional(),
    otp: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const changePasswordSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: z.string().min(6),
    confirmNewPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const resetPasswordTokenSchema = z.object({
  email: z.string().email(),
});
export type ResetPasswordTokenInput = z.infer<typeof resetPasswordTokenSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    token: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// Response schemas
export const loginResponseSchema = z.object({
  accessToken: z.string(),
  user: userSummarySchema,
});
export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const refreshTokenResponseSchema = z.object({
  accessToken: z.string(),
});
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;
 
