import mongoose from "mongoose";
import type {
  CreateRatingInput,
  GetAverageRatingInput,
} from "@workspace/shared-types";
import { ApiError } from "@/shared/utils/api-error";
import Course from "../models/course-model";
import RatingAndReview from "../models/rating-and-review-model";

export const createRating = async (userId: string, body: CreateRatingInput) => {
  const { rating, review, courseId } = body;

  const course = await Course.findOne({
    _id: courseId,
    studentsEnrolled: { $elemMatch: { $eq: userId } },
  });

  if (!course) {
    throw ApiError.notFound("Student not enrolled in course");
  }

  const existingReview = await RatingAndReview.findOne({
    user: userId,
    course: courseId,
  });

  if (existingReview) {
    throw ApiError.conflict("Already reviewed");
  }

  const newRatingReview = await RatingAndReview.create({
    rating,
    review,
    course: courseId,
    user: userId,
  });

  await Course.findByIdAndUpdate(courseId, {
    $push: {
      ratingAndReviews: newRatingReview._id,
    },
  });

  return newRatingReview;
};

export const getAverageRating = async (body: GetAverageRatingInput) => {
  const { courseId } = body;

  const result = await RatingAndReview.aggregate([
    {
      $match: {
        course: new mongoose.Types.ObjectId(courseId),
      },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  if (result.length > 0) {
    return result[0].averageRating;
  }
  return 0;
};

export const getAllRating = async () => {
  const allReviews = await RatingAndReview.find()
    .sort({ rating: -1 })
    .populate({
      path: "user",
      select: "firstName lastName email image",
    })
    .populate({
      path: "course",
      select: "courseName",
    })
    .exec();

  return allReviews;
};
