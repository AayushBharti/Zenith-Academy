/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express"

import Course from "../models/Course"
import Section from "../models/Section"
import SubSection from "../models/SubSection"
import { uploadImageToCloudinary } from "../utils/imageUploader"

// Create a new sub-section for a given section
export const createSubSection = async (req: any, res: Response) => {
  try {
    // Extract necessary information from the request body
    const { sectionId, title, description, courseId } = req.body
    const video = req.files?.videoFile

    // Check if all necessary fields are provided
    if (!sectionId || !title || !description || !video || !courseId) {
      return res
        .status(404)
        .json({ success: false, message: "All Fields are Required" })
    }

    // Check if the section exists
    const section = await Section.findById(sectionId)
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found.",
      })
    }

    // Upload the video file to Cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      Array.isArray(video) ? video[0] : video,
      process.env.FOLDER_VIDEO as string
    )

    console.log(uploadDetails)
    // Create a new sub-section with the necessary information
    const SubSectionDetails = await SubSection.create({
      title,
      // timeDuration: timeDuration,
      description,
      videoUrl: uploadDetails.secure_url,
    })

    // Update the corresponding section with the newly created sub-section
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subSection: SubSectionDetails._id } },
      { new: true }
    ).populate("subSection") // Populate the updated section with its sub-sections

    // Retrieve the updated course details to return a complete course structure
    const updatedCourse = await Course.findById(courseId)
      .populate({ path: "courseContent", populate: { path: "subSection" } })
      .exec()

    // Return the updated course with the new sub-section added
    return res.status(200).json({
      success: true,
      message: "Sub-section created successfully.",
      data: updatedCourse,
    })
  } catch (error) {
    // Handle unexpected errors and return a generic error response
    console.error("Error creating new sub-section:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
      error: (error as Error).message,
    })
  }
}

// UPDATE a sub-section
export const updateSubSection = async (req: any, res: Response) => {
  try {
    // Extract necessary information from the request body
    const { SubsectionId, title, description, courseId } = req.body
    const video = req.files?.videoFile

    // Check if subsectionId and courseId are provided
    if (!SubsectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "SubsectionId and courseId are required.",
      })
    }

    // Variable to hold upload details (if a new video is provided)
    let uploadDetails: { secure_url?: string } = {}

    // Upload the video file to Cloudinary (if provided)
    if (video) {
      uploadDetails = await uploadImageToCloudinary(
        Array.isArray(video) ? video[0] : video,
        process.env.FOLDER_VIDEO as string
      )
    }

    // Find and update the sub-section with the new data
    const SubSectionDetails = await SubSection.findByIdAndUpdate(
      SubsectionId,
      {
        title: title,
        description: description,
        videoUrl: uploadDetails.secure_url,
      },
      { new: true }
    )

    // Check if the sub-section exists
    if (!SubSectionDetails) {
      return res.status(404).json({
        success: false,
        message: "Sub-section not found.",
      })
    }

    // Find the corresponding course and populate its content with sub-sections
    const updatedCourse = await Course.findById(courseId)
      .populate({ path: "courseContent", populate: { path: "subSection" } })
      .exec()

    // Return the updated course with the modified sub-section
    return res.status(200).json({
      success: true,
      message: "Sub-section updated successfully.",
      data: updatedCourse,
    })
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error updating sub-section:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: (error as Error).message,
    })
  }
}

export const deleteSubSection = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    // Extract subSectionId, sectionId, and courseId from the request body
    const { subSectionId, sectionId, courseId } = req.body

    // Validate required fields
    if (!subSectionId || !sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      })
    }

    // Find the sub-section by its ID
    const ifSubSection = await SubSection.findById(subSectionId)
    if (!ifSubSection) {
      return res.status(404).json({
        success: false,
        message: "Sub-section not found",
      })
    }

    // Find the section by its ID
    const ifSection = await Section.findById(sectionId)
    if (!ifSection) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      })
    }

    // Delete the sub-section
    await SubSection.findByIdAndDelete(subSectionId)

    // Remove the sub-section reference from the section
    await Section.findByIdAndUpdate(
      sectionId,
      { $pull: { subSection: subSectionId } },
      { new: true }
    )

    // Find the updated course and populate its content
    const updatedCourse = await Course.findById(courseId)
      .populate({ path: "courseContent", populate: { path: "subSection" } })
      .exec()

    // Return success response with updated course
    return res.status(200).json({
      success: true,
      message: "Sub-section deleted",
      data: updatedCourse,
    })
  } catch (error) {
    // Handle errors
    console.error("Error deleting sub-section:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: (error as Error).message,
    })
  }
}
