import type { Request, Response } from "express";
import { ApiError } from "@/shared/utils/api-error";
import { ApiResponse } from "@/shared/utils/api-response";
import { asyncHandler } from "@/shared/utils/async-handler";
import { updateProfileSchema } from "@workspace/shared-types";
import * as ProfileService from "../services/profile.service";

export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const { profile, userDetails } = await ProfileService.updateProfile(
      req.user.id,
      updateProfileSchema.parse(req.body)
    );
    return ApiResponse.ok(res, "Profile updated successfully", {
      profile,
      userDetails,
    });
  }
);

export const deleteAccount = asyncHandler(
  async (req: Request, res: Response) => {
    await ProfileService.deleteAccount(req.user.id);
    return ApiResponse.ok(res, "User deleted successfully");
  }
);

export const getAllUserDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const userDetails = await ProfileService.getAllUserDetails(req.user.id);
    return ApiResponse.ok(res, "User Data fetched successfully", userDetails);
  }
);

export const getEnrolledCourses = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await ProfileService.getEnrolledCourses(req.user.id);
    return ApiResponse.ok(res, "User Data fetched successfully", user);
  }
);

export const updateDisplayPicture = asyncHandler(
  async (req: Request, res: Response) => {
    const image = req.file;
    if (!image) {
      throw ApiError.badRequest("Profile picture is required.");
    }
    const updatedImage = await ProfileService.updateDisplayPicture(
      req.user.id,
      image
    );
    return ApiResponse.ok(res, "Image updated successfully", updatedImage);
  }
);

export const instructorDashboard = asyncHandler(
  async (req: Request, res: Response) => {
    const courseDetails = await ProfileService.instructorDashboard(req.user.id);
    return ApiResponse.ok(res, "User Data fetched successfully", courseDetails);
  }
);
