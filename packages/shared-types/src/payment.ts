import { z } from "zod";

// Request schemas
export const capturePaymentSchema = z.object({
  courses: z.array(z.string()),
});
export type CapturePaymentInput = z.infer<typeof capturePaymentSchema>;

export const verifySignatureSchema = z.object({
  razorpay_payment_id: z.string(),
  razorpay_order_id: z.string(),
  razorpay_signature: z.string(),
  courses: z.array(z.string()),
});
export type VerifySignatureInput = z.infer<typeof verifySignatureSchema>;

export const sendPaymentSuccessEmailSchema = z.object({
  amount: z.number(),
  paymentId: z.string(),
  orderId: z.string(),
});
export type SendPaymentSuccessEmailInput = z.infer<typeof sendPaymentSuccessEmailSchema>;

// Response schemas
export const capturePaymentResponseSchema = z.object({
  orderId: z.string(),
  currency: z.string(),
  amount: z.number(),
});
export type CapturePaymentResponse = z.infer<
  typeof capturePaymentResponseSchema
>;

export const paymentRecordSchema = z.object({
  _id: z.string(),
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string().optional(),
  amount: z.number(),
  currency: z.string(),
  status: z.enum(["pending", "success", "failed", "refunded"]),
  courses: z.array(
    z.object({
      _id: z.string(),
      courseName: z.string(),
      thumbnail: z.string(),
      price: z.number(),
    })
  ),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type PaymentRecord = z.infer<typeof paymentRecordSchema>;

export const paymentHistoryResponseSchema = z.object({
  payments: z.array(paymentRecordSchema),
  total: z.number(),
});
export type PaymentHistoryResponse = z.infer<
  typeof paymentHistoryResponseSchema
>;

export const instructorEarningsResponseSchema = z.object({
  totalEarnings: z.number(),
  totalTransactions: z.number(),
  currency: z.string(),
});
export type InstructorEarningsResponse = z.infer<
  typeof instructorEarningsResponseSchema
>;
