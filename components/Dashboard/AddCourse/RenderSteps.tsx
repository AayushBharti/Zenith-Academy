"use client"

import React from "react"
import useCourseStore from "@/store/useCourseStore"
import { Check, ChevronRight } from "lucide-react"

import { Progress } from "@/components/ui/progress"

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

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <CourseInformationForm />
      case 2:
        return <CourseBuilderForm />
      case 3:
        return <PublishCourseForm />
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          {steps.map((item, index) => (
            <React.Fragment key={item.id}>
              <div className="flex flex-col items-center">
                <div
                  className={`grid place-items-center w-10 h-10 rounded-full border-2 ${
                    step >= item.id
                      ? "bg-primary border-primary-foreground text-primary-foreground"
                      : "border-muted-foreground text-muted-foreground"
                  }`}
                >
                  {step > item.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{item.id}</span>
                  )}
                </div>
                <span className="mt-2 text-xs font-medium text-muted-foreground">
                  {item.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              )}
            </React.Fragment>
          ))}
        </div>
        <Progress value={(step / steps.length) * 100} className="h-2" />
      </div>

      {renderStepContent()}
    </div>
  )
}
