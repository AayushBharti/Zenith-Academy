"use client";

import type { SectionResponse } from "@workspace/shared-types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ReviewModal } from "@/features/course/components/review-modal";
import { useFullCourseDetails } from "@/features/course/hooks/use-course-queries";
import useViewCourseStore from "@/features/course/use-view-course-store";

export default function ViewCourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [reviewModal, setReviewModal] = useState(false);
  const params = useParams();
  const courseId = params.courseId as string;
  const {
    setCompletedLectures,
    setCourseSectionData,
    setEntireCourseData,
    setTotalNoOfLectures,
  } = useViewCourseStore();

  const { data: courseData } = useFullCourseDetails(courseId);

  useEffect(() => {
    if (!courseData?.courseDetails) return;

    setCourseSectionData(courseData.courseDetails.courseContent ?? []);
    setEntireCourseData(courseData.courseDetails);
    setCompletedLectures(courseData.completedVideos);

    let lecture = 0;
    courseData.courseDetails.courseContent?.forEach(
      (section: SectionResponse) => {
        lecture += section?.subSection?.length;
      }
    );
    setTotalNoOfLectures(lecture);
  }, [
    courseData,
    setCourseSectionData,
    setEntireCourseData,
    setCompletedLectures,
    setTotalNoOfLectures,
  ]);

  return (
    <>
      {children}
      {reviewModal && <ReviewModal setReviewModal={setReviewModal} />}
    </>
  );
}
