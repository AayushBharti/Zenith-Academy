import { z } from "zod";

// Request schemas
export const contactUsSchema = z.object({
  firstName: z.string(),
  lastName: z.string().optional(),
  email: z.string().email(),
  message: z.string(),
  phoneNo: z.string().optional(),
});
export type ContactUsInput = z.infer<typeof contactUsSchema>;
