import { Resend } from "resend"
import dotenv from "dotenv"

dotenv.config()

const resend = new Resend(process.env.RESEND_API_KEY)

const mailSender = async (email: string, title: string, body: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `"Zenith Academy" <academy@aayushbharti.in>`,
      to: [email],
      subject: title,
      html: body,
    })

    if (error) {
      console.error("Error sending email:", error.message)
      return error
    }

    console.log("Email sent:", data?.id)
    return data
  } catch (error) {
    console.error("Unexpected error:", (error as Error).message)
    return error
  }
}

export default mailSender

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
//       from: `"ZenithAcademy" <${process.env.MAIL_USER}>`,
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
