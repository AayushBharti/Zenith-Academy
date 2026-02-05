"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ReviewModal } from "@/components/dashboard/view-course/review-modal";
import { VideoDetails } from "@/components/dashboard/view-course/video-details";
import { VideoDetailsSidebar } from "@/components/dashboard/view-course/video-details-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getFullDetailsOfCourse } from "@/services/course-details-service";
import { useAuthStore } from "@/store/use-auth-store";
import useViewCourseStore from "@/store/use-view-course-store";

export default function ViewCourse() {
  const [reviewModal, setReviewModal] = useState(false);
  const params = useParams();
  const courseId = params.courseId as string;
  const { token } = useAuthStore();
  const {
    setCompletedLectures,
    setCourseSectionData,
    setEntireCourseData,
    setTotalNoOfLectures,
  } = useViewCourseStore();

  useEffect(() => {
    const setCourseSpecifics = async () => {
      if (!token) return;

      const courseData = await getFullDetailsOfCourse(
        courseId,
        token as string
      );
      if (courseData?.courseDetails) {
        setCourseSectionData(courseData.courseDetails.courseContent);
        setEntireCourseData(courseData.courseDetails);
        setCompletedLectures(courseData.completedVideos);
        let lecture = 0;
        courseData.courseDetails.courseContent?.forEach((section: any) => {
          lecture += section?.subSection?.length;
        });
        setTotalNoOfLectures(lecture);
      }
    };
    setCourseSpecifics();
  }, [
    courseId,
    token,
    setCourseSectionData,
    setEntireCourseData,
    setCompletedLectures,
    setTotalNoOfLectures,
  ]);

  return (
    <div className="flex">
      <SidebarProvider defaultOpen={true}>
        {/* Sidebar Component */}
        <VideoDetailsSidebar setReviewModal={setReviewModal} />

        {/* Main Content Area */}
        <SidebarInset>
          {/* Header with Toggle Button */}
          <header className="mt-16 flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <SidebarTrigger className="-ml-1" />
            <Separator className="mr-2 h-4" orientation="vertical" />
            <span className="font-medium text-sm">Course Content</span>
          </header>

          <main className="flex-1 overflow-auto p-8">
            <div className="container">
              <VideoDetails />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>

      {reviewModal && <ReviewModal setReviewModal={setReviewModal} />}
    </div>
  );
}
