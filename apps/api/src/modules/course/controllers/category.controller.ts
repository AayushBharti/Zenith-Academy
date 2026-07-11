import type { Request, Response } from "express";
import { ApiResponse } from "@/shared/utils/api-response";
import { asyncHandler } from "@/shared/utils/async-handler";
import {
  addCourseToCategorySchema,
  categoryPageDetailsSchema,
  createCategorySchema,
} from "@workspace/shared-types";
import * as CategoryService from "../services/category.service";

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const newCategory = await CategoryService.createCategory(
      createCategorySchema.parse(req.body)
    );
    return ApiResponse.created(
      res,
      "Category Created Successfully",
      newCategory
    );
  }
);

export const showAllCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const allCategories = await CategoryService.showAllCategories();
    return ApiResponse.ok(
      res,
      "All categories fetched successfully",
      allCategories
    );
  }
);

export const categoryPageDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const pageDetails = await CategoryService.categoryPageDetails(
      categoryPageDetailsSchema.parse(req.body)
    );
    return ApiResponse.ok(
      res,
      "Category page details fetched successfully",
      pageDetails
    );
  }
);

export const addCourseToCategory = asyncHandler(
  async (req: Request, res: Response) => {
    await CategoryService.addCourseToCategory(
      addCourseToCategorySchema.parse(req.body)
    );
    return ApiResponse.ok(res, "Course added to category successfully");
  }
);
