import { z } from "zod";

// Request schemas
export const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dateOfBirth: z.string().optional(),
  about: z.string().optional(),
  contactNumber: z.string().optional(),
  gender: z.string().optional(),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const updateDisplayPictureSchema = z.object({
  pfp: z.any(),
});
export type UpdateDisplayPictureInput = z.infer<typeof updateDisplayPictureSchema>;

// Response schemas
export const profileResponseSchema = z.object({
  _id: z.string(),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  about: z.string().optional(),
  contactNumber: z.string().optional(),
});
export type ProfileResponse = z.infer<typeof profileResponseSchema>;

export const userSummarySchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  image: z.string(),
  accountType: z.string(),
  additionalDetails: z
    .object({
      gender: z.string().optional(),
      dateOfBirth: z.string().optional(),
      about: z.string().optional(),
      contactNumber: z.string().optional(),
    })
    .optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  active: z.boolean().optional(),
  approved: z.boolean().optional(),
});
export type UserSummary = z.infer<typeof userSummarySchema>;

export const updateProfileResponseSchema = z.object({
  profile: profileResponseSchema,
  userDetails: userSummarySchema,
});
export type UpdateProfileResponse = z.infer<typeof updateProfileResponseSchema>;

