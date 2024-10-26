import mongoose, { CallbackError } from "mongoose"

import { otpTemplate } from "../mail/templates/emailVerificationTemplate"
import mailSender from "../utils/mailSender"

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
})

// Function to send verification email
async function sendVerificationEmail(email: string, otp: string) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email",
      otpTemplate(otp)
    )
    console.log("Email sent successfully:", mailResponse)
  } catch (error) {
    console.error("Error occurred while sending email:", error)
    throw error
  }
}

// Pre-save hook to send OTP email when a new document is created
OTPSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      await sendVerificationEmail(this.email, this.otp)
      console.log("Verification email sent for OTP document.")
    } catch (error) {
      return next(error as CallbackError) // Pass error to the next middleware
    }
  }
  next()
})

export default mongoose.model("OTP", OTPSchema)
