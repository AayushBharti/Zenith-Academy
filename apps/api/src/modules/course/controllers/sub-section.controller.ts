import type { Request, Response } from "express";
import { ApiError } from "@/shared/utils/api-error";
import { ApiResponse } from "@/shared/utils/api-response";
import { asyncHandler } from "@/shared/utils/async-handler";
import {
  createSubSectionSchema,
  deleteSubSectionSchema,
  updateSubSectionSchema,
} from "@workspace/shared-types";
import * as SubSectionService from "../services/sub-section.service";

export const createSubSection = asyncHandler(
  async (req: Request, res: Response) => {
    const parsedBody = createSubSectionSchema.parse(req.body);
    if (!req.file) {
      throw ApiError.badRequest("Video file is required.");
    }
    const updatedCourse = await SubSectionService.createSubSection(
      parsedBody,
      req.file
    );
    return ApiResponse.created(
      res,
      "Sub-section created successfully.",
      updatedCourse
    );
  }
);

export const updateSubSection = asyncHandler(
  async (req: Request, res: Response) => {
    const parsedBody = updateSubSectionSchema.parse(req.body);
    const updatedCourse = await SubSectionService.updateSubSection(
      parsedBody,
      req.file
    );
    return ApiResponse.ok(
      res,
      "Sub-section updated successfully.",
      updatedCourse
    );
  }
);

export const deleteSubSection = asyncHandler(
  async (req: Request, res: Response) => {
    const updatedCourse = await SubSectionService.deleteSubSection(
      deleteSubSectionSchema.parse(req.body)
    );
    return ApiResponse.ok(res, "Sub-section deleted", updatedCourse);
  }
);
