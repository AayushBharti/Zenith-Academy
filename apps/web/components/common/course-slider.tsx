"use client"

import React from "react"

import { CourseDetails } from "@/types/course"
import { Skeleton } from "@/components/ui/skeleton"

import { CourseCard } from "./course-card"
import { GeneralSwiper } from "./general-swiper"

interface CourseSliderProps {
  courses: CourseDetails[]
}

export function CourseSlider({ courses }: CourseSliderProps) {
  if (!courses?.length) {
    return (
      <div className="flex gap-4">
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
      slidesPerView={{ 300: 1.3, 640: 2.5, 1024: 3.4 }}
      spaceBetween={20}
      pagination={false}
      navigation={false}
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
      {courses.map((course) => (
        <CourseCard key={course._id} course={course} />
      ))}
    </GeneralSwiper>
  )
}
