import bcrypt from "bcrypt"
import { Response } from "express"
import jwt from "jsonwebtoken"
import otpGenerator from "otp-generator"

import { passwordUpdated } from "@/mail/templates/password-update-mail-template"
import OTP from "@/models/otp-model"
import Profile from "@/models/profile-model"
import User from "@/models/user-model"
import mailSender from "@/utils/mail-sender"

// Send OTP For Email Verification
export const sendotp = async (req: any, res: Response) => {
  try {
    const { email } = req.body

    // Check if user is already present
    const checkUserPresent = await User.findOne({ email })

    // to be used in case of signup

    // If user found with provided email
    if (checkUserPresent) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      })
    }

    // Generate OTP
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })

    // Ensure OTP is unique
    let result = await OTP.findOne({ otp })
    console.log("Result is Generate OTP Func")
    console.log("OTP", otp)
    console.log("Result", result)
    //this is a very bad practise (lopp over db calls, use better lib for otp generations)
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      })
      result = await OTP.findOne({ otp })
    }

    // Create OTP record
    const otpPayload = { email, otp }
    //create an entry for otp in DB
    //also before creating entry, email will be send since we used preSave hook to send mail
    const otpBody = await OTP.create(otpPayload)
    console.log("OTP Body", otpBody)

    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp,
    })
  } catch (error) {
    // console.log(error.message)
    return res.status(500).json({
      success: false,
      error: (error as Error).message,
    })
  }
}

// Signup Controller for Registering USers
export const signup = async (req: any, res: Response) => {
  try {
    // Destructure fields from the request body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body
    // Check if All Details are present
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      })
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password do not match. Please try again.",
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      })
    }

    // Find the most recent OTP for the email
    const otpResponse = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1)
    // sorted by the createdAt field in descending order(-1). The most recently created OTP records will appear first in the results.
    //The limit method restricts the number of documents returned by the query.
    console.log(otpResponse)
    if (otpResponse.length === 0) {
      // OTP not found for the email
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      })
    } else if (otp !== otpResponse[0].otp) {
      // Invalid OTP
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Determine if the account is approved
    const approved = accountType === "Instructor" ? false : true

    // Create the Additional Profile For User
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    })

    // Create the User
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      approved,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/6.x/initials/svg?seed=${firstName} ${lastName}&backgroundColor=00897b,00acc1,039be5,1e88e5,3949ab,43a047,5e35b1,7cb342,8e24aa,c0ca33,d81b60,e53935,f4511e,fb8c00,fdd835,ffb300,ffd5dc,ffdfbf,c0aede,d1d4f9,b6e3f4&backgroundType=solid,gradientLinear&backgroundRotation=0,360,-350,-340,-330,-320&fontFamily=Arial&fontWeight=600`,
    })

    // Respond with success
    return res.status(200).json({
      success: true,
      user,
      message: "User registered successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    })
  }
}

// Login controller for authenticating users
export const login = async (req: any, res: Response) => {
  try {
    // 1.Get email and password from request body
    const { email, password } = req.body

    // 2.validate data
    if (!email || !password) {
      // Return 400 Bad Request status code with error message
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      })
    }

    // 3.Find user with provided email
    const user = await User.findOne({ email }).populate("additionalDetails")
    if (!user) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`,
      })
    }

    // 4.Compare Password and Generate JWT token
    if (await bcrypt.compare(password, user.password)) {
      // Create a payload with essential user information
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      }
      const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: "7d",
      })

      // Store the token in the user document
      user.token = token
      user.password = "HIDDEN" // Hide the password in the response

      // Set cookie options
      const options = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      }
      // 5.Set token as a cookie and return the response
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User Login Success`,
      })
    } else {
      // If password is incorrect, return an error
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      })
    }
  } catch (error) {
    console.error(error)
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    })
  }
}

//Changing Password
export const changePassword = async (req: any, res: Response) => {
  try {
    // 1.Get user data from req.user
    const userDetails = await User.findById(req.user?.id)
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // 2.Get old password, new password, and confirm new password from req.body
    const { oldPassword, newPassword, confirmNewPassword } = req.body

    // 3.Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    )
    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New Password cannot be same as Old Password",
      })
    }

    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" })
    }

    // Match new password and confirm new password
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "The password and confirm password does not match",
      })
    }

    // 4.Update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10)
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user?.id,
      { password: encryptedPassword },
      { new: true }
    )

    // 5.Send notification email
    try {
      const emailResponse = await mailSender(
        updatedUserDetails?.email || "",
        "Zenith Academy - Password Updated",
        passwordUpdated(
          updatedUserDetails?.email || "",
          `Password updated successfully for ${updatedUserDetails?.firstName} ${updatedUserDetails?.lastName}`
        )
      )
      console.log(
        "Email sent successfully:",
        (emailResponse as { response: string }).response
      )
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: (error as Error).message,
      })
    }

    // 6.Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error)
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: (error as Error).message,
    })
  }
}
