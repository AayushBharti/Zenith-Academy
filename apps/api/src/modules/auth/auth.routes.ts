import express, { type Router } from "express";
// Import reset password controllers
import { auth } from "@/shared/middlewares/auth-middlewares"; // Import authentication middleware
import * as AuthController from "./controllers/auth.controller";

// Import authentication-related controllers

const router: Router = express.Router();

/**
 * POST /login
 * Route for user login. This will authenticate the user and return a session or token.
 */
router.post("/login", AuthController.login);

router.post("/logout", auth, AuthController.logout);

router.post("/refresh-token", AuthController.refreshToken);

/**
 * POST /signup
 * Route for user signup. This will create a new user in the system.
 */
router.post("/signup", AuthController.signup);

/**
 * POST /sendotp
 * Route to send an OTP (One-Time Password) to the user's email. Typically used for password resets or verification.
 */
router.post("/sendotp", AuthController.sendotp);

/**
 * POST /changepassword
 * Route to change the user's password. This route requires the user to be authenticated
 */
router.post("/changepassword", auth, AuthController.changePassword);

// ********************************************************************************************************
//                                      Reset Password Routes
// ********************************************************************************************************

/**
 * POST /reset-password-token
 * Route to generate a reset password token, usually triggered when the user requests a password reset.
 */
router.post("/reset-password-token", AuthController.resetPasswordToken);

/**
 * POST /reset-password
 * Route for resetting the user's password after they have verified their identity using the token.
 */
router.post("/reset-password", AuthController.resetPassword);

// Export the router to be used in the main app
export default router;
