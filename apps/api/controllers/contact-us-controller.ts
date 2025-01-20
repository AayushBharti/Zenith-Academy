/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express"

import mailSender from "@/utils/mail-sender"

// Define a type for the request body
interface ContactUsRequest {
  firstName: string
  lastName?: string // Optional
  email: string
  message: string
  phoneNo?: string // Optional
}

const contactUs = async (req: any, res: Response) => {
  const { firstName, lastName, email, message, phoneNo } = req.body

  // Validate required fields
  if (!firstName || !email || !message) {
    return res.status(403).send({
      success: false,
      message: "All Fields are required",
    })
  }

  try {
    const data = {
      firstName,
      lastName: lastName || "null",
      email,
      message,
      phoneNo: phoneNo || "null",
    }

    const info = await mailSender(
      process.env.CONTACT_MAIL as string,
      "Enquiry",
      `<html><body>${Object.keys(data)
        .map((key) => {
          return `<p>${key}: ${data[key as keyof ContactUsRequest]}</p>`
        })
        .join("")}</body></html>`
    )

    if (info) {
      return res.status(200).send({
        success: true,
        message: "Your message has been sent successfully",
      })
    } else {
      return res.status(403).send({
        success: false,
        message: "Something went wrong",
      })
    }
  } catch (error) {
    console.error("Error sending email:", error) // Log the error for debugging
    return res.status(403).send({
      success: false,
      message: "Something went wrong",
    })
  }
}

export default contactUs
