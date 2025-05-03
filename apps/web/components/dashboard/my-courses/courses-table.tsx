"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { COURSE_STATUS } from "@/data/constants"
import {
  deleteCourse,
  fetchInstructorCourses,
} from "@/services/course-details-service"
import { useAuthStore } from "@/store/use-auth-store"
import { format } from "date-fns"
import { Check, Clock, Edit2, Plus, Trash2 } from "lucide-react"

import { CourseDetails } from "@/types/course"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface CoursesGridProps {
  courses: CourseDetails[]
  setCourses: any
}

export default function CoursesGrid({ courses, setCourses }: CoursesGridProps) {
  const router = useRouter()
  const { token } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<CourseDetails | null>(
    null
  )

  const handleCourseDelete = async () => {
    if (!courseToDelete) return
    setLoading(true)
    try {
      await deleteCourse({ courseId: courseToDelete._id }, token as string)
      const updatedCourses = await fetchInstructorCourses(token as string)
      if (updatedCourses) setCourses(updatedCourses)
    } catch (error) {
      console.error("Error deleting course:", error)
    } finally {
      setDeletingCourseId(null)
      setLoading(false)
      setIsDeleteModalOpen(false)
      setCourseToDelete(null)
    }
  }

  const openDeleteModal = (course: CourseDetails) => {
    setCourseToDelete(course)
    setIsDeleteModalOpen(true)
  }

  const formatDate = (dateString: string) =>
    format(new Date(dateString), "MMM d, yyyy")

  return (
    <div className="space-y-8">
      {courses.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl font-semibold">No courses found</p>
          <p className="text-muted-foreground mt-2">
            Start creating your first course!
          </p>
          <Button
            className="mt-4"
            onClick={() => router.push("/dashboard/create-course")}
          >
            <Plus className="mr-2 h-4 w-4" /> Create Your First Course
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card
              key={course._id}
              className="flex flex-col overflow-hidden transition-all duration-200 hover:shadow-lg"
            >
              <CardContent className="p-0">
                <div className="relative aspect-video">
                  <Image
                    src={course.thumbnail}
                    alt={course.courseName}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge
                      variant={
                        course.status === COURSE_STATUS.DRAFT
                          ? "secondary"
                          : "default"
                      }
                      className="text-xs font-semibold"
                    >
                      {course.status === COURSE_STATUS.DRAFT ? (
                        <Clock className="mr-1 h-3 w-3" />
                      ) : (
                        <Check className="mr-1 h-3 w-3" />
                      )}
                      {course.status === COURSE_STATUS.DRAFT
                        ? "Draft"
                        : "Published"}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                    {course.courseName}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {course.courseDescription}
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      {formatDate(course.createdAt || course.updatedAt)}
                    </span>
                    <span className="font-semibold">₹{course.price}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center mt-auto border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(`/dashboard/edit-course/${course._id}`)
                  }
                  className="flex-1 mr-2"
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => openDeleteModal(course)}
                  disabled={deletingCourseId === course._id}
                  className="flex-1"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Course Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the course "
              {courseToDelete?.courseName}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleCourseDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete Course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
