import {
  capturePaymentSchema,
  sendPaymentSuccessEmailSchema,
  verifySignatureSchema,
} from "@workspace/shared-types";
import type { Request, Response } from "express";
import { ApiResponse } from "@/shared/utils/api-response";
import { asyncHandler } from "@/shared/utils/async-handler";
import * as PaymentService from "../services/payment.service";

export const capturePayment = asyncHandler(
  async (req: Request, res: Response) => {
    const data = capturePaymentSchema.parse(req.body);
    const paymentResponse = await PaymentService.capturePayment(
      req.user.id,
      data
    );
    return ApiResponse.ok(
      res,
      "Payment initiated successfully",
      paymentResponse
    );
  }
);

export const verifySignature = asyncHandler(
  async (req: Request, res: Response) => {
    await PaymentService.verifySignature(
      req.user.id,
      verifySignatureSchema.parse(req.body)
    );
    return ApiResponse.ok(res, "Payment and enrollment successful");
  }
);

export const sendPaymentSuccessEmail = asyncHandler(
  async (req: Request, res: Response) => {
    await PaymentService.sendPaymentSuccessEmail(
      req.user.id,
      sendPaymentSuccessEmailSchema.parse(req.body)
    );
    return ApiResponse.ok(res, "Payment success email sent successfully");
  }
);

export const getPaymentHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const { status, limit } = req.query;
    const payments = await PaymentService.getPaymentHistory(req.user.id, {
      status: status as string | undefined,
      limit: limit ? Number(limit) : undefined,
    });
    return ApiResponse.ok(res, "Payment history retrieved", payments);
  }
);

export const getInstructorEarnings = asyncHandler(
  async (req: Request, res: Response) => {
    const earnings = await PaymentService.getInstructorEarnings(req.user.id);
    return ApiResponse.ok(res, "Earnings retrieved", earnings);
  }
);
