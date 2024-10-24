"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"

import GetAvgRating from "../../utils/avgRating"
import { RatingStars } from "../ui/rating-stars"

interface Course {
  _id: string
  courseName: string
  thumbnail: string
  instructor: {
    firstName: string
    lastName: string
  }
  price: number
  ratingAndReviews: any[]
}

interface CourseCardProps {
  course: Course
  height?: string
}

export function CourseCard({ course, height = "60" }: CourseCardProps) {
  const [avgReviewCount, setAvgReviewCount] = useState(0)

  useEffect(() => {
    const count = GetAvgRating(course.ratingAndReviews)
    setAvgReviewCount(count)
  }, [course])

  return (
    <Card className="mb-4 hover:scale-[1.03] transition-all duration-200">
      <Link href={`/courses/${course._id}`}>
        <CardContent className="p-0">
          <div className="relative">
            <Image
              src={course.thumbnail}
              alt="course thumbnail"
              width={300}
              height={200}
              className={`${height} rounded-t-xl object-cover`}
            />
          </div>
          <div className="flex flex-col gap-2 p-4">
            <h3 className="text-sm md:text-xl text-primary">
              {course.courseName}
            </h3>
            <p className="text-[12px] md:text-xl text-muted-foreground">
              By{" "}
              <span className="text-yellow-500">
                {course.instructor.firstName} {course.instructor.lastName}
              </span>
            </p>
            <div className="flex items-center gap-x-3">
              <span className="text-yellow-500">
                {avgReviewCount.toFixed(1)}
              </span>
              <RatingStars rating={avgReviewCount} />
              <span className="hidden md:block md:text-xl text-muted-foreground">
                {course.ratingAndReviews.length} Ratings
              </span>
            </div>
            <p className="text-sm md:text-xl text-primary">
              Rs. {course.price}
            </p>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
