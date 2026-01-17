"use client";

import { format } from "date-fns";
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  IndianRupee,
  Plus,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { COURSE_STATUS } from "@/data/constants";
import {
  deleteCourse,
  fetchInstructorCourses,
} from "@/services/course-details-service";
import { useAuthStore } from "@/store/use-auth-store";
import type { CourseDetails } from "@/types/course";

interface CoursesGridProps {
  courses: CourseDetails[];
  setCourses: any;
}

export default function CoursesGrid({ courses, setCourses }: CoursesGridProps) {
  const router = useRouter();
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<CourseDetails | null>(
    null
  );

  // --- Handlers ---
  const handleCourseDelete = async () => {
    if (!courseToDelete) return;
    setLoading(true);
    try {
      await deleteCourse({ courseId: courseToDelete._id }, token as string);
      const updatedCourses = await fetchInstructorCourses(token as string);
      if (updatedCourses) setCourses(updatedCourses);
    } catch (error) {
      console.error("Error deleting course:", error);
    } finally {
      setLoading(false);
      setCourseToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMM d, yyyy");
  };

  // --- Animation Variants ---
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // --- Empty State ---
  if (courses.length === 0) {
    return (
      <div className="fade-in-50 flex min-h-[400px] animate-in flex-col items-center justify-center rounded-xl border-2 border-muted border-dashed p-8 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <BookOpen className="h-10 w-10 text-primary" />
        </div>
        <h3 className="font-semibold text-xl">No courses created yet</h3>
        <p className="mx-auto mt-2 mb-6 max-w-sm text-muted-foreground">
          You haven't created any courses yet. Start sharing your knowledge with
          the world today.
        </p>
        <Button
          className="font-semibold"
          onClick={() => router.push("/dashboard/create-course")}
          size="lg"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Course
        </Button>
      </div>
    );
  }

  return (
    <>
      <motion.div
        animate="show"
        className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
        initial="hidden"
        variants={container}
      >
        <AnimatePresence>
          {courses.map((course) => (
            <motion.div key={course._id} layout variants={item}>
              <Card className="group flex h-full flex-col overflow-hidden border-border/50 transition-all duration-300 hover:border-primary/50 hover:shadow-md">
                {/* --- Thumbnail Section --- */}
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  {course.thumbnail ? (
                    <Image
                      alt={course.courseName}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      fill
                      src={course.thumbnail}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <BookOpen className="h-10 w-10 opacity-20" />
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <Badge
                      className={`shadow-xs backdrop-blur-md ${
                        course.status === COURSE_STATUS.DRAFT
                          ? "bg-white/90 text-zinc-800 hover:bg-white/90"
                          : "border-emerald-500 bg-emerald-500/90 text-white hover:bg-emerald-600/90"
                      }`}
                      variant={
                        course.status === COURSE_STATUS.DRAFT
                          ? "secondary"
                          : "default"
                      }
                    >
                      {course.status === COURSE_STATUS.DRAFT ? (
                        <Clock className="mr-1.5 h-3 w-3" />
                      ) : (
                        <CheckCircle2 className="mr-1.5 h-3 w-3" />
                      )}
                      {course.status === COURSE_STATUS.DRAFT
                        ? "Draft"
                        : "Published"}
                    </Badge>
                  </div>

                  {/* Price Tag (Overlay) */}
                  <div className="absolute right-3 bottom-3 z-10">
                    <div className="flex items-center rounded-md bg-black/60 px-3 py-1 font-semibold text-sm text-white backdrop-blur-xs">
                      {course.price === 0 ? (
                        "Free"
                      ) : (
                        <>
                          <IndianRupee className="mr-0.5 h-3 w-3" />
                          {course.price}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* --- Content Section --- */}
                <CardContent className="flex flex-1 flex-col p-5">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="line-clamp-1 font-bold text-xl transition-colors duration-200 group-hover:text-primary">
                      {course.courseName}
                    </h3>
                  </div>

                  <p className="mb-6 line-clamp-2 flex-1 text-muted-foreground text-sm">
                    {course.courseDescription}
                  </p>

                  <div className="flex items-center gap-4 text-muted-foreground text-xs">
                    <div className="flex items-center gap-1 rounded-md bg-secondary/50 px-2 py-1">
                      <Calendar className="h-3 w-3" />
                      <span>Created: {formatDate(course.createdAt)}</span>
                    </div>
                  </div>
                </CardContent>

                {/* --- Footer Actions --- */}
                <CardFooter className="gap-3 p-4 pt-0">
                  <Button
                    className="flex-1 hover:bg-secondary"
                    onClick={() =>
                      router.push(`/dashboard/edit-course/${course._id}`)
                    }
                    variant="outline"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    className="flex-0 px-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setCourseToDelete(course)}
                    variant="ghost"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* --- Delete Confirmation Dialog --- */}
      <AlertDialog
        onOpenChange={(open) => !open && setCourseToDelete(null)}
        open={!!courseToDelete}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Course?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                "{courseToDelete?.courseName}"
              </span>
              ?
              <br />
              This action cannot be undone and all associated lectures will be
              permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={loading}
              onClick={(e) => {
                e.preventDefault(); // Prevent auto-close to handle loading state
                handleCourseDelete();
              }}
            >
              {loading ? "Deleting..." : "Delete Permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
