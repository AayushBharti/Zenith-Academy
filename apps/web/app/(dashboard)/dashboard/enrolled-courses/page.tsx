"use client";

import type { CourseResponse as CourseDetails } from "@workspace/shared-types";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { BookOpenCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardPageHeader } from "@/features/dashboard/components/dashboard-page-header";
import { EmptyState } from "@/features/dashboard/components/empty-state";
import { useEnrolledCourses } from "@/features/profile/hooks/use-profile-queries";

export default function EnrolledCourses() {
  const router = useRouter();
  const { data, isLoading } = useEnrolledCourses();

  const enrolledCourses = data?.courses ?? [];
  const progressData = data?.courseProgress ?? [];

  const totalNoOfLectures = (course: CourseDetails) =>
    (course.courseContent ?? []).reduce(
      (total, section) => total + section.subSection.length,
      0
    );

  if (isLoading) {
    return (
      <div className="container space-y-8 p-4 md:p-8">
        <DashboardPageHeader
          description="We're loading your courses. Please wait."
          title="Enrolled Courses"
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...new Array(3)].map((_, index) => (
            <Skeleton className="h-88 w-full rounded-xl" key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container space-y-8 p-4 md:p-8">
      <DashboardPageHeader
        description="Courses you have enrolled in."
        title="Enrolled Courses"
      />
      {enrolledCourses.length === 0 ? (
        <EmptyState
          action={
            <Button animation="swap" asChild>
              <Link href="/catalog">Browse Courses</Link>
            </Button>
          }
          description="You have not enrolled in any courses yet. Explore our catalog to start learning."
          icon={BookOpenCheck}
          title="No Courses Found"
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course) => {
              const progress = progressData.find(
                (p) => String(p.course) === String(course._id)
              );
              const completedLectures = progress?.completedVideos?.length || 0;
              const totalLectures = totalNoOfLectures(course);
              const progressPercentage =
                totalLectures > 0
                  ? (completedLectures / totalLectures) * 100
                  : 0;

              return (
                <Card
                  className="overflow-hidden border-border/60 shadow-sm"
                  key={course._id}
                >
                  <Image
                    alt={course.courseName}
                    className="h-48 w-full object-cover"
                    height={200}
                    src={course.thumbnail ?? ""}
                    width={400}
                  />
                  <CardHeader>
                    <CardTitle className="line-clamp-1">
                      {course.courseName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 line-clamp-2 text-muted-foreground text-sm">
                      {course.courseDescription}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-muted-foreground text-sm">
                        <span>Progress</span>
                        <span className="font-medium text-foreground">
                          {progressPercentage.toFixed(0)}%
                        </span>
                      </div>
                      <Progress className="w-full" value={progressPercentage} />
                      <p className="text-muted-foreground text-xs">
                        {completedLectures} of {totalLectures} lectures
                        completed
                      </p>
                    </div>
                    <Button
                      animation="swap"
                      className="mt-4 w-full"
                      disabled={totalLectures === 0}
                      onClick={() =>
                        router.push(
                          `/dashboard/enrolled-courses/${course._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection[0]}`
                        )
                      }
                    >
                      Continue Learning
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
      )}
    </div>
  );
}
