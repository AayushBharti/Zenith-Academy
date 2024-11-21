"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { fetchInstructorCourses } from "@/services/courseDetailsService"
import { useAuthStore } from "@/store/useAuthStore"
import { PlusIcon } from "lucide-react"

import { CourseDetails } from "@/types/course"
import { Button } from "@/components/ui/button"
import CoursesTable from "@/components/Dashboard/MyCourses/CoursesTable"

export default function MyCourses() {
  const { token } = useAuthStore()

  const router = useRouter()
  const [courses, setCourses] = useState<CourseDetails[] | null>(null)

  const fetchCourses = async () => {
    try {
      const result = await fetchInstructorCourses(token as string)
      if (result) {
        setCourses(result)
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <div className="mb-14 flex items-center justify-between">
        <h1 className="text-4xl font-bold">My Courses</h1>
        <Button
          onClick={() => router.push("/dashboard/add-course")}
          className="flex items-center gap-x-2"
        >
          <span>Add Course</span>
          <PlusIcon className="h-5 w-5" />
        </Button>
      </div>
      <div>
        {courses && <CoursesTable courses={courses} setCourses={setCourses} />}
      </div>
    </div>
  )
}
