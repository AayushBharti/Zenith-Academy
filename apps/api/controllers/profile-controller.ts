/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express"

import Course from "@/models/course-model"
import Profile from "@/models/profile-model"
import User from "@/models/user-model"
import { uploadImageToCloudinary } from "@/utils/image-uploader"

// import Course from "../models/Course"
// import { uploadImageToCloudinary } from "../utils/imageUploader"

// Method for updating a profile
export const updateProfile = async (req: any, res: Response) => {
  try {
    // Extract profile update data from the request body
    const {
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      firstName,
      lastName,
      gender = "",
    } = req.body

    // Extract user ID from the authenticated user object
    const userId = req.user?.id

    // Find the user and their associated profile
    const userDetails = await User.findById(userId)
    if (!userDetails) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    const profile = await Profile.findById(userDetails.additionalDetails)
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" })
    }

    // Update the user and profile fields
    userDetails.firstName = firstName || userDetails.firstName
    userDetails.lastName = lastName || userDetails.lastName
    profile.dateOfBirth = dateOfBirth || profile.dateOfBirth
    profile.about = about || profile.about
    profile.gender = gender || profile.gender
    profile.contactNumber = contactNumber || profile.contactNumber

    // Save the updated data
    await profile.save()
    await userDetails.save()

    // Return the updated user and profile data in the response
    return res.json({
      success: true,
      message: "Profile updated successfully",
      profile,
      userDetails,
    })
  } catch (error) {
    // Handle errors and send a response
    console.error("Error updating profile:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: (error as Error).message,
    })
  }
}

export const deleteAccount = async (req: any, res: Response) => {
  try {
    // TODO: Job Schedule this request for 5 days

    // Extract user ID from the authenticated user object
    const userId = req.user?.id

    // Find the user by ID
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Delete associated profile linked with the user
    await Profile.findByIdAndDelete(user.additionalDetails)

    // TODO: Unenroll user from all the enrolled courses (if applicable)

    // Delete the user itself
    await User.findByIdAndDelete(userId)

    // Return success response
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    // Handle errors and send error response
    console.error("Error deleting user:", error)
    return res.status(500).json({
      success: false,
      message: "User cannot be deleted successfully",
      error: (error as Error).message,
    })
  }
}
// ANSWER
// import schedule from "node-schedule" // Node-schedule for job scheduling

// export const deleteAccount = async (
//   req,
//   res
// ) => {
//   try {
//     // Extract user ID from the authenticated user object
//     const userId = req.user?.id

//     // Find the user by ID
//     const user = await User.findById(userId)
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       })
//     }

//     // Schedule job to delete account after 5 days
//     schedule.scheduleJob(Date.now() + 5 * 24 * 60 * 60 * 1000, async () => {
//       try {
//         // Delete associated profile linked with the user
//         await Profile.findByIdAndDelete(user.additionalDetails)

//         // Unenroll user from all enrolled courses (assuming there's an "enrolledStudents" field in Course)
//         await Course.updateMany(
//           { enrolledStudents: userId },
//           { $pull: { enrolledStudents: userId } }
//         )

//         // Delete the user itself
//         await User.findByIdAndDelete(userId)
//         console.log(`User with ID ${userId} deleted after 5 days.`)
//       } catch (error) {
//         console.error(
//           `Error during scheduled deletion for user ID ${userId}:`,
//           error
//         )
//       }
//     })

//     // Return success response, informing the user the account will be deleted in 5 days
//     return res.status(200).json({
//       success: true,
//       message: "Your account will be deleted in 5 days.",
//     })
//   } catch (error) {
//     // Handle errors and send error response
//     console.error("Error scheduling account deletion:", error)
//     return res.status(500).json({
//       success: false,
//       message: "Error scheduling account deletion",
//       error: (error as Error).message,
//     })
//   }
// }

export const getAllUserDetails = async (req: any, res: Response) => {
  try {
    const id = req.user?.id
    const userDetails = await User.findById(id)
      .populate("additionalDetails") //to get details like gender
      .exec()
    console.log(userDetails)
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: (error as Error).message,
    })
  }
}

export const getEnrolledCourses = async (req: any, res: Response) => {
  try {
    const id = req.user?.id
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID not provided",
      })
    }
    const user = await User.findById(id)
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
        },
      })
      .populate("courseProgress")
      .exec()

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: user,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: (error as Error).message,
    })
  }
}

// updateDisplayPicture
export const updateDisplayPicture = async (req: any, res: Response) => {
  try {
    const id = req.user?.id
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    const image = req.files.pfp
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      })
    }
    const uploadDetails = await uploadImageToCloudinary(
      image,
      process.env.FOLDER_NAME as string
    )
    console.log(uploadDetails)

    const updatedImage = await User.findByIdAndUpdate(
      { _id: id },
      { image: uploadDetails.secure_url },
      { new: true }
    )

    res.status(200).json({
      success: true,
      message: "Image updated successfully",
      data: updatedImage,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: (error as Error).message,
    })
  }
}

interface CourseStats {
  _id: string
  courseName: string
  courseDescription: string
  totalStudents: number
  totalRevenue: number
}

//instructor dashboard
export const instructorDashboard = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    const id = req.user.id
    const courseData = await Course.find({ instructor: id })

    // Map over the courses to gather relevant statistics
    const courseDetails: CourseStats[] = courseData.map((course) => {
      const totalStudents = course?.studentsEnrolled?.length || 0
      const totalRevenue = (course?.price || 0) * totalStudents

      const courseStats: CourseStats = {
        _id: course._id.toString(),
        courseName: course.courseName as string,
        courseDescription: course.courseDescription as string,
        totalStudents,
        totalRevenue,
      }
      return courseStats
    })

    // Sending the response with the data
    return res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: courseDetails,
    })
  } catch (error: any) {
    // Catching errors and sending a response
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred while fetching course data.",
    })
  }
}
