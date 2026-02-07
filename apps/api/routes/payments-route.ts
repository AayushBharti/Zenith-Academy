import express, { type Router } from "express";

import {
  capturePayment,
  sendPaymentSuccessEmail,
  verifySignature,
} from "@/controllers/payments-controller";
import { auth, isStudent } from "@/middlewares/auth-middlewares";

const router: Router = express.Router();

/**
 * POST /capturePayment
 * Route to capture payment initiated by a student.
 */
router.post("/capturePayment", auth, isStudent, capturePayment);

/**
 * POST /verifyPayment
 * Route to verify payment signature.
 */
router.post("/verifyPayment", auth, verifySignature);

/**
 * POST /sendPaymentSuccessEmail
 * Route to send a success email after payment is processed.
 */
router.post("/sendPaymentSuccessEmail", auth, sendPaymentSuccessEmail);

export default router;
