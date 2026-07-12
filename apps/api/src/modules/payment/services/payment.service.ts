import type {
  CapturePaymentInput,
  CapturePaymentResponse,
  InstructorEarningsResponse,
  PaymentRecord,
  SendPaymentSuccessEmailInput,
  VerifySignatureInput,
} from "@workspace/shared-types";
import crypto from "crypto";
import mongoose from "mongoose";
import env from "@/configs/env";
import { razorpay } from "@/configs/razorpay";
import { courseEnrollmentEmail } from "@/mail/templates/course-enrollment-mail-template";
import { paymentSuccess } from "@/mail/templates/payment-success-mail-template";
import User from "@/modules/auth/models/user.model";
import Course from "@/modules/course/models/course-model";
import CourseProgress from "@/modules/course/models/course-progress-model";
import { ApiError } from "@/shared/utils/api-error";
import { sendEmail } from "@/shared/utils/send-mail";
import { Payment } from "../models/payment.model";

export const capturePayment = async (
  userId: string,
  data: CapturePaymentInput
): Promise<CapturePaymentResponse> => {
  const { courses } = data;

  if (!Array.isArray(courses) || courses.length === 0) {
    throw ApiError.validation("Please provide valid course IDs");
  }

  let totalAmount = 0;

  for (const courseId of courses) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw ApiError.notFound("Course not found");
    }

    const uid = new mongoose.Types.ObjectId(userId);
    if (course.studentsEnrolled.includes(uid)) {
      throw ApiError.conflict("User is already enrolled in this course");
    }

    totalAmount += course.price as number;
  }

  const options = {
    amount: totalAmount * 100,
    currency: "INR",
    receipt: (Math.random() * Date.now()).toString(),
  };

  try {
    const paymentResponse = await razorpay.orders.create(options);

    // Save payment record with pending status
    const payment = new Payment({
      razorpay_order_id: paymentResponse.id,
      user: userId,
      courses,
      amount: Number(paymentResponse.amount),
      currency: paymentResponse.currency,
      status: "pending",
    });
    await payment.save();

    return {
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: Number(paymentResponse.amount),
    };
  } catch (error) {
    console.error("Error initiating payment:", error);
    throw ApiError.server("Error initiating payment");
  }
};

const enrollStudent = async (courseIds: string[], userId: string) => {
  if (!(courseIds && userId)) {
    throw ApiError.validation("Please provide valid courses and user ID");
  }

  for (const courseId of courseIds) {
    const course = await Course.findByIdAndUpdate(
      courseId,
      { $push: { studentsEnrolled: userId } },
      { new: true }
    );
    if (!course) {
      throw ApiError.notFound("Course not found");
    }

    await User.findByIdAndUpdate(
      userId,
      { $push: { courses: courseId } },
      { new: true }
    );

    const newCourseProgress = new CourseProgress({
      user: userId,
      course: courseId,
    });
    await newCourseProgress.save();

    await User.findByIdAndUpdate(
      userId,
      { $push: { courseProgress: newCourseProgress._id } },
      { new: true }
    );

    const recipient = await User.findById(userId);
    if (recipient && course) {
      const { email, firstName, lastName } = recipient;
      const { courseName, courseDescription, thumbnail } = course;
      const userName = `${firstName} ${lastName}`;

      const emailTemplate = courseEnrollmentEmail(
        courseName as string,
        userName as string,
        courseDescription as string,
        thumbnail as string
      );

      await sendEmail(
        email,
        `You have successfully enrolled for ${courseName}`,
        emailTemplate
      );
    }
  }
};

export const verifySignature = async (
  userId: string,
  body: VerifySignatureInput
): Promise<void> => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    courses,
  } = body;

  if (!(razorpay_payment_id && razorpay_order_id && razorpay_signature)) {
    throw ApiError.validation("Payment details are incomplete");
  }

  const generatedSignature = crypto
    .createHmac("sha256", env.RAZORPAY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    // Mark payment as failed
    await Payment.findOneAndUpdate(
      { razorpay_order_id },
      {
        status: "failed",
        failureReason: "Invalid signature",
      }
    );
    throw ApiError.unauthorized("Invalid payment signature");
  }

  // Update payment record to success
  await Payment.findOneAndUpdate(
    { razorpay_order_id },
    {
      razorpay_payment_id,
      razorpay_signature,
      status: "success",
    }
  );

  await enrollStudent(courses, userId);
};

export const sendPaymentSuccessEmail = async (
  userId: string,
  body: SendPaymentSuccessEmailInput
) => {
  const { amount, paymentId, orderId } = body;

  const enrolledStudent = await User.findById(userId);
  if (!enrolledStudent) {
    throw ApiError.notFound("enrolledStudent not found");
  }

  await sendEmail(
    enrolledStudent.email,
    "Nextdemy Payment successful",
    paymentSuccess(
      amount / 100,
      paymentId,
      orderId,
      enrolledStudent.firstName,
      enrolledStudent.lastName
    )
  );
};

export const getPaymentHistory = async (
  userId: string,
  options?: { status?: string; limit?: number }
): Promise<PaymentRecord[]> => {
  const query: any = { user: userId };
  if (options?.status) {
    query.status = options.status;
  }

  return Payment.find(query)
    .populate("courses", "courseName thumbnail price")
    .sort({ createdAt: -1 })
    .limit(options?.limit || 50)
    .lean() as any;
};

export const getInstructorEarnings = async (
  instructorId: string
): Promise<InstructorEarningsResponse> => {
  const instructorCourses = await Course.find(
    { instructor: instructorId },
    "_id"
  );
  const courseIds = instructorCourses.map((c) => c._id);

  const payments = await Payment.find({
    courses: { $in: courseIds },
    status: "success",
  });

  const totalEarnings = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalTransactions = payments.length;

  return {
    totalEarnings: totalEarnings / 100, // Convert paise to rupees
    totalTransactions,
    currency: "INR",
  };
};
