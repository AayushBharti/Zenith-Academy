"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { getUserCourses as getUserEnrolledCourses } from "@/services/profileService"
import { useAuthStore } from "@/store/useAuthStore"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

interface Course {
  _id: string
  courseName: string
  courseDescription: string
  thumbnail: string
  courseContent: {
    subSection: any[]
  }[]
}

interface CourseProgress {
  courseID: string
  completedVideos: string[]
}

export default function EnrolledCourses() {
  const router = useRouter()
  const { token } = useAuthStore()

  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([])
  const [progressData, setProgressData] = useState<CourseProgress[]>([])
  const [loading, setLoading] = useState(true)

  const getEnrolledCourses = async () => {
    try {
      const response = await getUserEnrolledCourses(token as string)
      setEnrolledCourses(response?.courses || [])
      setProgressData(response?.courseProgress || [])
    } catch (error) {
      console.error("Error fetching enrolled courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const totalNoOfLectures = (course: Course) => {
    return course.courseContent.reduce(
      (total, section) => total + section.subSection.length,
      0
    )
  }

  useEffect(() => {
    getEnrolledCourses()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="w-[250px] h-[36px] mb-6" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-[200px] w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Enrolled Courses</h1>
      {enrolledCourses.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-[200px]">
            <p className="text-muted-foreground">
              You have not enrolled in any courses yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course) => {
              const progress = progressData.find(
                (p) => p.courseID === course._id
              )
              const completedLectures = progress?.completedVideos?.length || 0
              const totalLectures = totalNoOfLectures(course)
              const progressPercentage =
                (completedLectures / totalLectures) * 100

              return (
                <Card key={course._id} className="overflow-hidden">
                  <Image
                    src={course.thumbnail}
                    alt={course.courseName}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <CardHeader>
                    <CardTitle className="line-clamp-1">
                      {course.courseName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {course.courseDescription}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{progressPercentage.toFixed(0)}%</span>
                      </div>
                      <Progress value={progressPercentage} className="w-full" />
                      <p className="text-xs text-muted-foreground">
                        {completedLectures} of {totalLectures} lectures
                        completed
                      </p>
                    </div>
                    <Button
                      className="w-full mt-4"
                      onClick={() => router.push(`/courses/${course._id}`)}
                    >
                      Continue Learning
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
