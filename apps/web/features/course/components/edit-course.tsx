"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/app/loading";
import { useFullCourseDetails } from "@/features/course/hooks/use-course-queries";
import useCourseStore from "@/features/course/use-course-store";
import { DashboardPageHeader } from "@/features/dashboard/components/dashboard-page-header";
import { RenderSteps } from "./render-steps";

export default function EditCourse() {
  const { courseId } = useParams();
  const { setStep, setCourse, setEditCourse } = useCourseStore();
  const { data, isLoading } = useFullCourseDetails((courseId as string) ?? "");

  useEffect(() => {
    if (data?.courseDetails) {
      setCourse(data.courseDetails);
      setEditCourse(true);
      setStep(1);
    }
  }, [data, setCourse, setEditCourse, setStep]);

  return (
    <div className="container space-y-8 p-4 md:p-8">
      <DashboardPageHeader
        description="Update your course details and content."
        title="Edit Course"
      />
      {isLoading ? <Loading /> : <RenderSteps />}
    </div>
  );
}
