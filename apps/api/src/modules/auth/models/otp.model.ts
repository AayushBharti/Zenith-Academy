import mongoose, { type CallbackError } from "mongoose";
import { otpTemplate } from "@/mail/templates/email-verification-mail-template";
import { logger } from "@/shared/utils/logger";
import { sendEmail } from "@/shared/utils/send-mail";

// Define the OTP schema
const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // The document will be automatically deleted after 5 minutes
  },
});

// Function to send verification email
async function sendVerificationEmail(email: string, otp: string) {
  try {
    logger.info({ otp }, "OTP for testing");
    const mailResponse = await sendEmail(
      email,
      "Verification Email",
      otpTemplate(otp)
    );
    logger.info(mailResponse, "Email sent successfully:");
  } catch (error) {
    logger.error(error, "Error occurred while sending email:");
    throw error;
  }
}

// Pre-save hook to send OTP email when a new document is created
OTPSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      await sendVerificationEmail(this.email, this.otp);
      logger.info("Verification email sent for OTP document.");
    } catch (error) {
      logger.error(error, "Error occurred while sending email:");
      return next(error as CallbackError); // Pass error to the next middleware
    }
  }
  next();
});

export default mongoose.model("OTP", OTPSchema);
