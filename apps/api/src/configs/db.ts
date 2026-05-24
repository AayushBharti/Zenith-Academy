import mongoose from "mongoose";
import { logger } from "../shared/utils/logger";
import env from "./env";

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URL);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on("error", (err) => {
      logger.error(err, "MongoDB runtime error");
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });
  } catch (error) {
    logger.error(error, "Initial MongoDB connection failed");
    throw error; // Let caller decide what to do
  }
};
