/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from "crypto"
import bcrypt from "bcrypt"
import { Response } from "express"

import User from "../models/User"
import mailSender from "../utils/mailSender"

export const resetPasswordToken = async (req: any, res: Response) => {
  try {
    //get email from req body
    const email = req.body.email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required for generating reset password token",
      })
    }
    //check user for this email, email validation
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.json({
        success: false,
        message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
      })
    }
    //generate token
    const token = crypto.randomBytes(20).toString("hex")

    //update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 3600000, // 1hr
      },
      { new: true } //using this will return the updated doc
    )
    console.log("DETAILS", updatedDetails)

    //create url
    const url = `${process.env.UPDATE_PASSWORD_BASE_URL}/${token}`

    await mailSender(
      email,
      "Password Reset",
      `Your Link for email verification is ${url}. Please click this url to reset your password.`
    )

    res.json({
      success: true,
      message:
        "Email Sent Successfully, Please Check Your Email to Continue Further",
    })
  } catch (error) {
    return res.json({
      error: (error as Error).message,
      success: false,
      message: `Some Error in Sending the Reset Message`,
    })
  }
}

export const resetPassword = async (req: any, res: Response) => {
  try {
    //data fetch
    const { password, confirmPassword, token } = req.body
    if (!password || !confirmPassword || !token) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      })
    }

    // Check if passwords match(validation)
    if (confirmPassword !== password) {
      return res.json({
        success: false,
        message: "Password and Confirm Password Does not Match",
      })
    }

    // Find user by token
    const userDetails = await User.findOne({ token: token })
    // Ensure userDetails and resetPasswordExpires are defined
    if (!userDetails || !userDetails.resetPasswordExpires) {
      return res.status(400).json({
        success: false,
        message: "Invalid token or token has expired.",
      })
    }

    // Check if token has expired
    if (userDetails.resetPasswordExpires.getTime() <= Date.now()) {
      return res.status(403).json({
        success: false,
        message: "Token has expired. Please regenerate your token.",
      })
    }

    // Hash the new password
    const encryptedPassword = await bcrypt.hash(password, 10)

    // Update the user password
    await User.findOneAndUpdate(
      { token },
      {
        password: encryptedPassword,
        token: undefined,
        resetPasswordExpires: undefined,
      },
      { new: true }
    )

    res.json({
      success: true,
      message: "Password reset successful.",
    })
  } catch (error) {
    console.error("Error resetting password:", error)
    res.status(500).json({
      success: false,
      message: "An error occurred while resetting the password.",
    })
  }
}
