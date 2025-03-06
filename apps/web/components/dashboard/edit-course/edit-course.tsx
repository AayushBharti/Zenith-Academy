"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getFullDetailsOfCourse } from "@/services/course-details-service"
import { useAuthStore } from "@/store/use-auth-store"
import useCourseStore from "@/store/use-course-store"

import { Card, CardContent } from "@/components/ui/card"
import Loading from "@/app/loading"

import { RenderSteps } from "../add-course/render-steps"
import CourseTips from "../course-tips"

export default function EditCourse() {
  const { courseId } = useParams()
  const { token } = useAuthStore()
  const { course, setStep, setCourse, setEditCourse } = useCourseStore()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const popualteCourse = async () => {
      setLoading(true)
      const result = await getFullDetailsOfCourse(
        courseId as string,
        token as string
      )
      if (result?.courseDetails) {
        setCourse(result.courseDetails)
        console.log("result", course)
        setEditCourse(true)
        setStep(1)
      }
      setLoading(false)
    }
    popualteCourse()
  }, [])

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-8">Edit Course</h1>
          <Card>
            <CardContent className="p-6">
              {loading ? <Loading /> : <RenderSteps />}
            </CardContent>
          </Card>
        </div>
        <CourseTips className="xl:sticky xl:top-10 xl:self-start h-full xl:mt-16" />
      </div>
    </div>
  )
}
