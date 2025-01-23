/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from "crypto"
import { Response } from "express"
import { default as mongoose } from "mongoose"

import { instance } from "@/config/razorpay"
import { courseEnrollmentEmail } from "@/mail/templates/course-enrollment-mail-template"
import { paymentSuccess } from "@/mail/templates/payment-success-mail-template"
import Course from "@/models/course-model"
import CourseProgress from "@/models/course-progress-model"
import User from "@/models/user-model"
import mailSender from "@/utils/mail-sender"

export const capturePayment = async (req: any, res: Response) => {
  //get courseId and UserID
  const { courses } = req.body
  const userId = req.user?.id
  try {
    // Validate the courses array
    if (!Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid course IDs",
      })
    }

    let totalAmount = 0

    // Iterate over each course ID to calculate the total amount
    for (const courseId of courses) {
      try {
        // Find the course by ID
        const course = await Course.findById(courseId)
        if (!course) {
          return res.status(404).json({
            success: false,
            message: "Course not found",
          })
        }

        // Check if the user is already enrolled in this course
        const uid = new mongoose.Types.ObjectId(userId)
        if (course.studentsEnrolled.includes(uid)) {
          return res.status(200).json({
            success: false,
            message: "User is already enrolled in this course",
          })
        }

        // Accumulate the total amount for all courses
        totalAmount += course.price as number
      } catch (error) {
        console.error("Error finding course:", error)
        return res.status(500).json({
          success: false,
          message: "Error processing course",
          error: (error as Error).message,
        })
      }
    }

    // Define the payment options for Razorpay
    const options = {
      amount: totalAmount * 100, // Amount in the smallest currency unit
      currency: "INR",
      receipt: (Math.random() * Date.now()).toString(),
      // Generate a unique receipt ID
    }
    // Initiate the payment using Razorpay
    try {
      const paymentResponse = await instance.orders.create(options)
      console.log("Payment response:", paymentResponse)

      // Return payment details to the client
      return res.status(200).json({
        success: true,
        orderId: paymentResponse.id,
        currency: paymentResponse.currency,
        amount: paymentResponse.amount,
      })
    } catch (error) {
      console.error("Error initiating payment:", error)
      return res.status(500).json({
        success: false,
        message: "Error initiating payment",
        error: (error as Error).message,
      })
    }
  } catch (error) {
    // Handle unexpected errors
    console.error("Unexpected error:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: (error as Error).message,
    })
  }
}

//verify the signature
export const verifySignature = async (req: any, res: Response) => {
  try {
    // Extract payment and course details from the request body
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      courses,
    } = req.body
    const userId = req.user?.id

    // Validate that the necessary payment details are present
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment details are incomplete",
      })
    }

    // Create the body to be used for signature verification
    const body = `${razorpay_order_id}|${razorpay_payment_id}`

    // Function to handle course enrollment logic
    const enrollStudent = async (
      courseIds: string[],
      userId: string
    ): Promise<Response> => {
      if (!courseIds || !userId) {
        return res.status(400).json({
          success: false,
          message: "Please provide valid courses and user ID",
        })
      }

      try {
        // Loop through each course to enroll the student
        for (const courseId of courseIds) {
          console.log("Enrolling in course:", courseId)

          // Update the course with the new student
          const course = await Course.findByIdAndUpdate(
            courseId,
            { $push: { studentsEnrolled: userId } },
            { new: true }
          )
          if (!course) {
            return res.status(404).json({
              success: false,
              message: "Course not found",
            })
          }

          // Update the user with the new course
          await User.findByIdAndUpdate(
            userId,
            { $push: { courses: courseId } },
            { new: true }
          )

          // Create and save a new CourseProgress for the user
          const newCourseProgress = new CourseProgress({
            userID: userId,
            courseID: courseId,
          })
          await newCourseProgress.save()

          // Update the user's course progress
          await User.findByIdAndUpdate(
            userId,
            { $push: { courseProgress: newCourseProgress._id } },
            { new: true }
          )

          // Send a confirmation email to the user
          const recipient = await User.findById(userId)
          if (recipient && course) {
            const { email, firstName, lastName } = recipient
            const { courseName, courseDescription, thumbnail } = course
            const userName = `${firstName} ${lastName}`

            const emailTemplate = courseEnrollmentEmail(
              courseName as string,
              userName as string,
              courseDescription as string,
              thumbnail as string
            )

            await mailSender(
              email,
              `You have successfully enrolled for ${courseName}`,
              emailTemplate
            )
          }
        }

        // Return a success response
        return res.status(200).json({
          success: true,
          message: "Payment and enrollment successful",
        })
      } catch (error) {
        console.error("Error during course enrollment:", error)
        return res.status(500).json({
          success: false,
          error: (error as Error).message,
        })
      }
    }

    // Verify the Razorpay signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET as string)
      .update(body)
      .digest("hex")

    if (generatedSignature === razorpay_signature) {
      // If the signature is valid, proceed with course enrollment
      return await enrollStudent(courses, userId as string)
    } else {
      // If the signature is invalid, return an error
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      })
    }
  } catch (error) {
    console.error("Error during payment verification:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: (error as Error).message,
    })
  }
}

//send email
export const sendPaymentSuccessEmail = async (req: any, res: Response) => {
  const { amount, paymentId, orderId } = req.body
  const userId = req.user?.id
  if (!amount || !paymentId) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid payment details",
    })
  }
  try {
    const enrolledStudent = await User.findById(userId)
    if (!enrolledStudent) {
      return res.status(404).json({
        success: false,
        message: "enrolledStudent not found",
      })
    }
    await mailSender(
      enrolledStudent.email,
      `Zenith Academy Payment successful`,
      paymentSuccess(
        amount / 100,
        paymentId,
        orderId,
        enrolledStudent.firstName,
        enrolledStudent.lastName
      )
    )
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      error: (error as Error).message,
    })
  }
}
