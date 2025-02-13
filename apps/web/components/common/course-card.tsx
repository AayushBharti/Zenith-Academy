"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import getAvgRating from "@/utils/avg-rating"
import { Users } from "lucide-react"

import { CourseDetails } from "@/types/course"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

import { RatingStars } from "../ui/rating-stars"

interface CourseCardProps {
  course: CourseDetails
}

export function CourseCard({ course }: CourseCardProps) {
  const [avgReviewCount, setAvgReviewCount] = useState(0)

  useEffect(() => {
    const count = getAvgRating(course.ratingAndReviews)
    setAvgReviewCount(count)
  }, [course])

  return (
    <Link href={`/courses/${course._id}`}>
      <Card className="group overflow-hidden rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300">
        <CardContent className="p-0">
          <div className="relative">
            <Image
              src={course.thumbnail}
              alt={`${course.courseName} thumbnail`}
              width={400}
              height={225}
              className="w-full h-[220px] object-cover rounded-t-xl"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-t-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center">
              <span className="text-white font-base tracking-widest uppercase text-xl">
                View Course
              </span>
            </div>
            <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-2xl text-sm font-semibold">
              Rs. {course.price}
            </Badge>
          </div>
          <div className="flex flex-col gap-3 p-5">
            <h3 className="text-xl font-bold text-primary line-clamp-2 group-hover:text-primary/80 transition-colors duration-200">
              {course.courseName}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Users size={16} />
              <span className="font-medium text-secondary-foreground">
                {course.instructor.firstName} {course.instructor.lastName}
              </span>
            </p>
            <div className="flex items-center gap-x-2">
              <span className="text-lg font-bold text-yellow-500">
                {avgReviewCount.toFixed(1)}
              </span>
              <RatingStars rating={avgReviewCount} />
              <span className="text-sm text-muted-foreground">
                ({course.ratingAndReviews.length} reviews)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
