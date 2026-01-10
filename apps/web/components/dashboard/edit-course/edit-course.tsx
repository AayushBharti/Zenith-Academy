"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";
import { Card, CardContent } from "@/components/ui/card";
import { getFullDetailsOfCourse } from "@/services/course-details-service";
import { useAuthStore } from "@/store/use-auth-store";
import useCourseStore from "@/store/use-course-store";

import { RenderSteps } from "../add-course/render-steps";

export default function EditCourse() {
  const { courseId } = useParams();
  const { token } = useAuthStore();
  const { course, setStep, setCourse, setEditCourse } = useCourseStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const popualteCourse = async () => {
      setLoading(true);
      const result = await getFullDetailsOfCourse(
        courseId as string,
        token as string
      );
      if (result?.courseDetails) {
        setCourse(result.courseDetails);
        console.log("result", course);
        setEditCourse(true);
        setStep(1);
      }
      setLoading(false);
    };
    popualteCourse();
  }, []);

  return (
    <div className="">
      <div className="flex flex-col gap-8 xl:flex-row">
        <div className="flex-1">
          <h1 className="mb-8 font-bold text-3xl">Edit Course</h1>
          <Card>
            <CardContent className="p-6">
              {loading ? <Loading /> : <RenderSteps />}
            </CardContent>
          </Card>
        </div>
        {/* <CourseTips className="xl:sticky xl:top-10 xl:self-start h-full xl:mt-16" /> */}
      </div>
    </div>
  );
}
