import mongoose from "mongoose";

export const DBconnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL as string);
    console.log("DB Connected Successfully");
  } catch (error) {
    console.error("DB Connection Failed:", error);
    process.exit(1);
  }
};
