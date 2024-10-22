import express from "express" // Import express

import {
  capturePayment,
  sendPaymentSuccessEmail,
  verifySignature,
} from "../controllers/Payments"
// Import controllers
import { auth, isStudent } from "../middlewares/auth" // Import required middlewares

const router = express.Router() // Create an express router

// ********************************************************************************************************
//                                      Payment Routes
// ********************************************************************************************************

/**
 * POST /capturePayment
 * Route to capture payment initiated by a student.
 */
router.post("/capturePayment", auth, isStudent, capturePayment)

/**
 * POST /verifyPayment
 * Route to verify payment signature.
 */
router.post("/verifyPayment", auth, verifySignature)

/**
 * POST /sendPaymentSuccessEmail
 * Route to send a success email after payment is processed.
 */
router.post("/sendPaymentSuccessEmail", auth, sendPaymentSuccessEmail)

// Export the router
export default router
