/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express"
import mongoose from "mongoose"

import Course from "@/models/course-model"
import RatingAndReview from "@/models/rating-and-review-model"

// Function to create a rating and review for a course
export const createRating = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    // Extract user ID and rating details from the request
    const userId = req.user?.id
    const { rating, review, courseId } = req.body

    // Check if the course exists and if the user is enrolled
    const course = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    })

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Student not enrolled in course",
      })
    }

    // Check if the user has already reviewed the course
    const existingReview = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    })

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "Already reviewed",
      })
    }

    // Create a new rating and review
    const newRatingReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    })

    // Update the course to include the new rating and review
    await Course.findByIdAndUpdate(courseId, {
      $push: {
        ratingAndReviews: newRatingReview._id,
      },
    })

    // Respond with success and the new rating and review
    return res.status(200).json({
      success: true,
      message: "Rating added successfully",
      ratingReview: newRatingReview,
    })
  } catch (error) {
    // Log the error and respond with a server error
    console.error("Error creating rating:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: (error as Error).message,
    })
  }
}

// Function to get the average rating for a specific course
export const getAverageRating = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    // Extract course ID from request body
    const { courseId } = req.body

    // Validate the provided course ID
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      })
    }

    // Aggregate the ratings for the specified course
    const result = await RatingAndReview.aggregate([
      {
        // Stage 1: Match documents that have the specified courseId
        $match: {
          // Convert the provided courseId into a valid ObjectId
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        // Stage 2: Group the matched documents and calculate the average rating
        $group: {
          // We don't need to group by any specific field, so we use `_id: null`
          // to group all documents into one single group
          _id: null,

          // Calculate the average of the 'rating' field from the matched documents
          averageRating: { $avg: "$rating" },
        },
      },
    ])

    // Check if there are any results and respond accordingly
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      })
    } else {
      return res.status(200).json({
        success: true,
        message: "No ratings found for this course",
        averageRating: 0,
      })
    }
  } catch (error) {
    // Log the error and respond with a server error
    console.error("Error calculating average rating:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: (error as Error).message,
    })
  }
}

// Function to get all ratings sorted by rating
export const getAllRating = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    // Fetch all reviews sorted by rating in descending order
    const allReviews = await RatingAndReview.find()
      .sort({ rating: -1 }) // Sort reviews by rating in descending order
      .populate({
        path: "user",
        select: "firstName lastName email image", // Select only the necessary user fields
      })
      .populate({
        path: "course",
        select: "courseName", // Select only the course name
      })
      .exec()

    // Respond with the fetched reviews and a success message
    return res.status(200).json({
      success: true,
      message: "All reviews fetched successfully",
      data: allReviews,
    })
  } catch (error) {
    // Log the error and respond with a server error
    console.error("Error fetching reviews:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: (error as Error).message,
    })
  }
}
