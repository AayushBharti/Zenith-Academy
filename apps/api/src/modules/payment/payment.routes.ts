import express, { type Router } from "express";
import {
  auth,
  isInstructor,
  isStudent,
} from "@/shared/middlewares/auth-middlewares";
import * as PaymentController from "./controllers/payment.controller";

const router: Router = express.Router();

/**
 * POST /capturePayment
 * Route to capture payment initiated by a student.
 */
router.post(
  "/capturePayment",
  auth,
  isStudent,
  PaymentController.capturePayment
);

/**
 * POST /verifyPayment
 * Route to verify payment signature.
 */
router.post("/verifyPayment", auth, PaymentController.verifySignature);

/**
 * POST /sendPaymentSuccessEmail
 * Route to send a success email after payment is processed.
 */
router.post(
  "/sendPaymentSuccessEmail",
  auth,
  PaymentController.sendPaymentSuccessEmail
);

/**
 * GET /history
 * Route to get payment history for the authenticated user.
 */
router.get("/history", auth, PaymentController.getPaymentHistory);

/**
 * GET /instructor-earnings
 * Route to get earnings for an instructor.
 */
router.get(
  "/instructor-earnings",
  auth,
  isInstructor,
  PaymentController.getInstructorEarnings
);

export default router;
