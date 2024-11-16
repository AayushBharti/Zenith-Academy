"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { COURSE_STATUS } from "@/data/constants"
import {
  deleteCourse,
  fetchInstructorCourses,
} from "@/services/courseDetailsService"
import { useAuthStore } from "@/store/useAuthStore"
import { format } from "date-fns"
import { Check, Clock, Edit2, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Course {
  _id: string
  courseName: string
  courseDescription: string
  thumbnail: string
  price: number
  status: string
  createdAt: string
  updatedAt: string
}

interface CoursesTableProps {
  courses: Course[]
  setCourses: any
}

export default function CoursesTable({
  courses,
  setCourses,
}: CoursesTableProps) {
  const router = useRouter()
  const { token } = useAuthStore()

  const [loading, setLoading] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState<{
    courseId: string
  } | null>(null)
  const TRUNCATE_LENGTH = 30

  const handleCourseDelete = async (courseId: string) => {
    setLoading(true)
    try {
      await deleteCourse({ courseId: courseId }, token as string)
      const result = await fetchInstructorCourses(token as string)
      if (result) {
        setCourses(result)
      }
    } catch (error) {
      console.error("Error deleting course:", error)
    } finally {
      setConfirmationModal(null)
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50%]">Courses</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                No courses found
              </TableCell>
            </TableRow>
          ) : (
            courses?.map((course) => (
              <TableRow key={course._id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-4">
                    <Image
                      src={course.thumbnail}
                      alt={course.courseName}
                      width={100}
                      height={75}
                      className="rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-semibold">{course.courseName}</p>
                      <p className="text-sm text-muted-foreground">
                        {course.courseDescription.length > TRUNCATE_LENGTH
                          ? `${course.courseDescription.slice(
                              0,
                              TRUNCATE_LENGTH
                            )}...`
                          : course.courseDescription}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Created:{" "}
                        {formatDate(course.createdAt || course.updatedAt)}
                      </p>
                      <Badge
                        variant={
                          course.status === COURSE_STATUS.DRAFT
                            ? "secondary"
                            : "default"
                        }
                      >
                        {course.status === COURSE_STATUS.DRAFT ? (
                          <Clock className="mr-1 h-3 w-3" />
                        ) : (
                          <Check className="mr-1 h-3 w-3" />
                        )}
                        {course.status === COURSE_STATUS.DRAFT
                          ? "Drafted"
                          : "Published"}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell>₹{course.price}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        router.push(`/dashboard/edit-course/${course._id}`)
                      }
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setConfirmationModal({ courseId: course._id })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog
        open={!!confirmationModal}
        onOpenChange={() => setConfirmationModal(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this course?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. All data related to this course will
              be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmationModal(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                confirmationModal &&
                handleCourseDelete(confirmationModal.courseId)
              }
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
