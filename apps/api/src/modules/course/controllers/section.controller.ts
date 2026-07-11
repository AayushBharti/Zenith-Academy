import type { Request, Response } from "express";
import { ApiResponse } from "@/shared/utils/api-response";
import { asyncHandler } from "@/shared/utils/async-handler";
import {
  createSectionSchema,
  deleteSectionSchema,
  updateSectionSchema,
} from "@workspace/shared-types";
import * as SectionService from "../services/section.service";

export const createSection = asyncHandler(
  async (req: Request, res: Response) => {
    const updatedCourse = await SectionService.createSection(
      createSectionSchema.parse(req.body)
    );
    return ApiResponse.created(
      res,
      "Section created successfully",
      updatedCourse
    );
  }
);

export const updateSection = asyncHandler(
  async (req: Request, res: Response) => {
    const updatedCourse = await SectionService.updateSection(
      updateSectionSchema.parse(req.body)
    );
    return ApiResponse.ok(res, "Section updated successfully", updatedCourse);
  }
);

export const deleteSection = asyncHandler(
  async (req: Request, res: Response) => {
    const updatedCourse = await SectionService.deleteSection(
      deleteSectionSchema.parse(req.body)
    );
    return ApiResponse.ok(res, "Section deleted", updatedCourse);
  }
);
