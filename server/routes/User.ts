import express from "express" // Import express

import { changePassword, login, sendotp, signup } from "../controllers/Auth" // Import authentication-related controllers

import { resetPassword, resetPasswordToken } from "../controllers/ResetPassword" // Import reset password controllers
import { auth } from "../middlewares/auth" // Import authentication middleware
import { isDemo } from "../middlewares/demo" // Import demo middleware

const router = express.Router() // Create an express router

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

/**
 * POST /login
 * Route for user login. This will authenticate the user and return a session or token.
 */
router.post("/login", login)

/**
 * POST /signup
 * Route for user signup. This will create a new user in the system.
 */
router.post("/signup", signup)

/**
 * POST /sendotp
 * Route to send an OTP (One-Time Password) to the user's email. Typically used for password resets or verification.
 */
router.post("/sendotp", sendotp)

/**
 * POST /changepassword
 * Route to change the user's password. This route requires the user to be authenticated and the 'isDemo' middleware for demo mode checks.
 */
router.post("/changepassword", auth, isDemo, changePassword)

// ********************************************************************************************************
//                                      Reset Password Routes
// ********************************************************************************************************

/**
 * POST /reset-password-token
 * Route to generate a reset password token, usually triggered when the user requests a password reset.
 */
router.post("/reset-password-token", resetPasswordToken)

/**
 * POST /reset-password
 * Route for resetting the user's password after they have verified their identity using the token.
 */
router.post("/reset-password", resetPassword)

// Export the router to be used in the main app
export default router
