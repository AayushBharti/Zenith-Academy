import env from "@/configs/env";
import { resend } from "@/configs/resend";
import { logger } from "./logger";

export async function sendEmail(email: string, title: string, body: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: `"Nextdemy" <${env.EMAIL_FROM}>`,
      to: [email],
      subject: title,
      html: body,
    });

    if (error) {
      logger.error(error, "Error sending email:");
      return error;
    }

    logger.info({ id: data?.id }, "Email sent:");
    return data;
  } catch (error) {
    logger.error(error, "Unexpected error:");
    return error;
  }
}

// import dotenv from "dotenv"
// import nodemailer from "nodemailer"

// dotenv.config()

// // Function to send an email
// const mailSender = async (email: string, title: string, body: string) => {
//   try {
//     // Create a transporter object using the default SMTP transport
//     const transporter = nodemailer.createTransport({
//       host: process.env.MAIL_HOST,
//       auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS,
//       },
//     })

//     // Send email
//     const info = await transporter.sendMail({
//       from: `"Nextdemy" <${process.env.MAIL_USER}>`,
//       to: email,
//       subject: title,
//       html: body,
//     })

//     console.log("Email sent:", info.messageId)
//     return info
//   } catch (error) {
//     console.error("Error sending email:", (error as Error).message)
//     return error
//   }
// }

// export default mailSender
