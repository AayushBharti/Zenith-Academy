import type { Request, Response } from "express";
import { contactUsSchema } from "@workspace/shared-types";
import { ApiResponse } from "@/shared/utils/api-response";
import { asyncHandler } from "@/shared/utils/async-handler";
import * as ContactService from "../services/contact.service";

export const contactUs = asyncHandler(async (req: Request, res: Response) => {
  await ContactService.contactUs(contactUsSchema.parse(req.body));
  return ApiResponse.ok(res, "Your message has been sent successfully");
});
