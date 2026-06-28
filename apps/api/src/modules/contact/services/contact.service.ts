import type { ContactUsInput } from "@workspace/shared-types";
import env from "@/configs/env";
import { ApiError } from "@/shared/utils/api-error";
import { sendEmail } from "@/shared/utils/send-mail";

export const contactUs = async (body: ContactUsInput) => {
  const { firstName, lastName, email, message, phoneNo } = body;

  const data = {
    firstName,
    lastName: lastName || "null",
    email,
    message,
    phoneNo: phoneNo || "null",
  };

  const info = await sendEmail(
    env.CONTACT_MAIL,
    "Enquiry",
    `<html><body>${Object.keys(data)
      .map((key) => `<p>${key}: ${data[key as keyof typeof data]}</p>`)
      .join("")}</body></html>`
  );

  if (!info) {
    throw ApiError.server("Something went wrong");
  }
};
