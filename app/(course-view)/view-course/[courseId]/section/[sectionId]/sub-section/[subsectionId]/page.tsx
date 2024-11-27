"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getFullDetailsOfCourse } from "@/services/courseDetailsService"
import { useAuthStore } from "@/store/useAuthStore"
import useViewCourseStore from "@/store/useViewCourseStore"

import { ReviewModal } from "@/components/Dashboard/ViewCourse/ReviewModal"
import { VideoDetails } from "@/components/Dashboard/ViewCourse/VideoDetails"
import { VideoDetailsSidebar } from "@/components/Dashboard/ViewCourse/VideoDetailsSidebar"

export default function ViewCourse() {
  const [reviewModal, setReviewModal] = useState(false)
  const params = useParams()
  const courseId = params.courseId as string
  const { token } = useAuthStore()
  const {
    setCompletedLectures,
    setCourseSectionData,
    setEntireCourseData,
    setTotalNoOfLectures,
  } = useViewCourseStore()

  useEffect(() => {
    const setCourseSpecifics = async () => {
      const courseData = await getFullDetailsOfCourse(courseId, token as string)
      setCourseSectionData(courseData.courseDetails.courseContent)
      setEntireCourseData(courseData.courseDetails)
      setCompletedLectures(courseData.completedVideos)
      let lecture = 0
      courseData?.courseDetails?.courseContent?.forEach((section: any) => {
        lecture += section?.subSection?.length
      })
      setTotalNoOfLectures(lecture)
    }
    setCourseSpecifics()
  }, [courseId, token])

  return (
    <div className="flex w-full">
      <div className="w-1/4">
        <VideoDetailsSidebar setReviewModal={setReviewModal} />
      </div>
      <div className="w-3/4">
        <VideoDetails />
      </div>
      {reviewModal && <ReviewModal setReviewModal={setReviewModal} />}
    </div>
  )
}
