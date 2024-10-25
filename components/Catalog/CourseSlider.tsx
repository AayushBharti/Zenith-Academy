"use client"

import React from "react"

import { Skeleton } from "@/components/ui/skeleton"

import { GeneralSwiper } from "../Common/GeneralSwiper"
import { CourseCard } from "./CourseCard"

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

interface CourseSliderProps {
  courses: Course[]
}

export function CourseSlider({ courses }: CourseSliderProps) {
  if (!courses?.length) {
    return (
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="w-full">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <Skeleton className="mt-2 h-4 w-1/4" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-full" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <GeneralSwiper
      slidesPerView={{ 300: 2.1, 640: 2.2, 1024: 3.1 }}
      spaceBetween={20}
      pagination={true}
      navigation={true}
      // mousewheel={{
      //   enabled: true,
      //   forceToAxis: true,
      // }}
      // keyboard={{
      //   enabled: true,
      //   onlyInViewport: true,
      // }}
      // freeMode={true}
      className="mySwiper md:pt-5"
    >
      {courses.map((course, index) => (
        <CourseCard
          key={index}
          course={course}
          height="lg:h-[250px] h-[100px]"
        />
      ))}
    </GeneralSwiper>
  )
}
