/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express"

import Course from "@/models/course-model"
import Section from "@/models/section-model"

export const createSection = async (req: any, res: Response) => {
  try {
    // 1. Data fetch
    const { sectionName, courseId } = req.body

    // 2. Validate the input
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing required properties",
      })
    }

    // 3. Check if the course exists
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }

    // 4. Create a new section with the given name
    const newSection = await Section.create({ sectionName })

    // 5. Add the new section to the course's content array
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate({
        //populate to replace sections/sub-sections both in the updatedCourseDetails
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    // 6. Return the updated course object in the response
    res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourse,
    })
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: (error as Error).message,
    })
  }
}

// UPDATE a section
export const updateSection = async (req: any, res: Response) => {
  try {
    // 1. Data fetch
    const { sectionName, sectionId, courseId } = req.body

    // 2. Validate the input
    if (!sectionName || !sectionId || !courseId) {
      res.status(400).json({
        success: false,
        message: "Missing required properties",
      })
      return
    }

    // 3. Update the section
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    )
    // Check if the section was updated
    if (!section) {
      res.status(404).json({
        success: false,
        message: "Section not found",
      })
      return
    }

    // 4. Fetch the updated course and populate related content
    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .exec()

    // 5. Success the updated course in the response
    res.status(200).json({
      success: true,
      message: "Section updated successfully",
      updatedCourse,
    })
  } catch (error) {
    console.error("Error updating section:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

// DELETE a section
export const deleteSection = async (req: any, res: Response) => {
  try {
    const { sectionId, courseId } = req.body
    await Section.findByIdAndDelete(sectionId)
    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .exec()
    res.status(200).json({
      success: true,
      message: "Section deleted",
      updatedCourse,
    })
  } catch (error) {
    console.error("Error deleting section:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}
