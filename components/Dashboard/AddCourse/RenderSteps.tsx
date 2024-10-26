"use client"

import React from "react"
import useCourseStore from "@/store/useCourseStore"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

import CourseBuilderForm from "./CourseBuilder/CourseBuilder"
import CourseInformationForm from "./CourseInformation/CourseInformationForm"
import PublishCourseForm from "./PublishCourse"

const steps = [
  { id: 1, title: "Course Information" },
  { id: 2, title: "Course Builder" },
  { id: 3, title: "Publish Course" },
]

export function RenderSteps() {
  const { step } = useCourseStore()

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <div className="relative flex justify-between">
          {steps.map((item) => (
            <div key={item.id} className=" flex w-full justify-between">
              <div className="flex flex-col items-center">
                <div
                  className={`grid cursor-default aspect-square w-[34px] place-items-center rounded-full border-[1px] ${
                    step === item.id
                      ? "bg-yellow-900 border-yellow-50 text-yellow-50"
                      : "border-richblack-700 bg-richblack-800 text-richblack-300"
                  }`}
                >
                  {step > item.id ? <Check /> : item.id}
                </div>
              </div>
              {item.id < 3 && (
                <div
                  className={`h-[calc(34px/2)] w-[100%]  border-dashed border-b-2 ${step > item.id ? "border-yellow-50" : "border-richblack-700"}
            }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <motion.div
        className="space-y-8"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {step === 1 && <CourseInformationForm />}
        {step === 2 && <CourseBuilderForm />}
        {step === 3 && <PublishCourseForm />}
      </motion.div>
    </div>
  )
}
