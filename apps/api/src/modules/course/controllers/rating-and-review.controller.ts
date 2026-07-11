import type { Request, Response } from "express";
import { ApiResponse } from "@/shared/utils/api-response";
import { asyncHandler } from "@/shared/utils/async-handler";
import {
  createRatingSchema,
  getAverageRatingSchema,
} from "@workspace/shared-types";
import * as RatingAndReviewService from "../services/rating-and-review.service";

export const createRating = asyncHandler(
  async (req: Request, res: Response) => {
    const newRatingReview = await RatingAndReviewService.createRating(
      req.user.id,
      createRatingSchema.parse(req.body)
    );
    return ApiResponse.ok(res, "Rating added successfully", newRatingReview);
  }
);

export const getAverageRating = asyncHandler(
  async (req: Request, res: Response) => {
    const averageRating = await RatingAndReviewService.getAverageRating(
      getAverageRatingSchema.parse(req.body)
    );
    return ApiResponse.ok(
      res,
      "Average rating fetched successfully",
      averageRating
    );
  }
);

export const getAllRating = asyncHandler(
  async (req: Request, res: Response) => {
    const allReviews = await RatingAndReviewService.getAllRating();
    return ApiResponse.ok(res, "All reviews fetched successfully", allReviews);
  }
);
