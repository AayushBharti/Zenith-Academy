import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("5000"),
  CORS_ORIGIN: z.string().url(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  RESEND_API_KEY: z.string(),
  FOLDER_VIDEO: z.string(),
  FOLDER_NAME: z.string(),
  JWT_SECRET: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  RAZORPAY_KEY: z.string(),
  RAZORPAY_SECRET: z.string(),
  UPDATE_PASSWORD_BASE_URL: z.string().url(),
  CONTACT_MAIL: z.string().email(),
  EMAIL_FROM: z.string().email(),
  MONGODB_URL: z.string().url(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

const env = envSchema.parse(process.env);

export default env;
