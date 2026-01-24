/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Response } from "express";
import Category from "@/models/category-model";
import Course from "@/models/course-model";

// Helper function to create a slug
function generateSlug(name: string): string {
  return name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-") // Replace spaces and non-word chars with -
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing -
}

export const createCategory = async (req: any, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }

    // UPDATED: Generate slug automatically from name
    const slug = generateSlug(name);

    // Check if category already exists (optional but recommended)
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });
    }

    const CategorysDetails = await Category.create({
      name,
      description,
      slug, // Save the slug
    });

    console.log(CategorysDetails);

    return res.status(200).json({
      success: true,
      message: "Category Created Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: (error as Error).message,
    });
  }
};

export const showAllCategories = async (req: any, res: Response) => {
  try {
    // UPDATED: Included 'slug' in the select projection
    const allCategories = await Category.find(
      {},
      { name: true, description: true, slug: true }
    );

    res.status(200).json({
      success: true,
      data: allCategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const categoryPageDetails = async (req: any, res: Response) => {
  try {
    const { categoryId } = req.body; // Ideally, you might want to find by 'slug' here in the future

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: [{ path: "instructor" }, { path: "ratingAndReviews" }],
      })
      .exec();

    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Handle case with no courses gracefully (return empty array instead of 404 if preferred, but 404 is fine logic)
    if (selectedCategory.courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      });
    }

    const selectedCourses = selectedCategory.courses;

    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    }).populate({
      path: "courses",
      match: { status: "Published" },
      populate: [{ path: "instructor" }, { path: "ratingAndReviews" }],
    });

    const differentCourses: any[] = [];
    categoriesExceptSelected.forEach((category) => {
      differentCourses.push(...category.courses);
    });

    const allCategories = await Category.find().populate({
      path: "courses",
      match: { status: "Published" },
      populate: [{ path: "instructor" }, { path: "ratingAndReviews" }],
    });

    const allCourses = allCategories.flatMap((category) => category.courses);

    // Sort and get the top 10 selling courses (uncomment sorting if you have the 'sold' field)
    const mostSellingCourses = allCourses
      // .sort((a, b) => (b as any).sold - (a as any).sold) // Assuming 'sold' is a field in the course model
      .slice(0, 10);

    return res.status(200).json({
      selectedCategory, // Return the full category object (includes name, slug, description)
      selectedCourses,
      differentCourses,
      mostSellingCourses,
      success: true,
    });
  } catch (error) {
    console.log("Error in categoryPageDetails:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const addCourseToCategory = async (req: any, res: Response) => {
  const { courseId, categoryId } = req.body;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (category.courses.includes(courseId)) {
      return res.status(200).json({
        success: true,
        message: "Course already exists in the category",
      });
    }

    category.courses.push(courseId);
    await category.save();

    return res.status(200).json({
      success: true,
      message: "Course added to category successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
};
