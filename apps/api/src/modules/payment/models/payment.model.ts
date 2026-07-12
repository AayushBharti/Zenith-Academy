import mongoose, { type Document } from "mongoose";

export interface IPayment extends Document {
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  user: mongoose.Types.ObjectId;
  courses: mongoose.Types.ObjectId[];
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed" | "refunded";
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new mongoose.Schema<IPayment>(
  {
    razorpay_order_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    razorpay_payment_id: {
      type: String,
      index: true,
    },
    razorpay_signature: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "refunded"],
      required: true,
      default: "pending",
      index: true,
    },
    failureReason: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
