import Razorpay from "razorpay";
import env from "./env";

export const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY,
  key_secret: env.RAZORPAY_SECRET,
});
