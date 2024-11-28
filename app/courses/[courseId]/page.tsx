"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { ACCOUNT_TYPE } from "@/data/constants"
import { fetchCourseDetails } from "@/services/courseDetailsService"
import { buyCourse } from "@/services/paymentService"
import { useAuthStore } from "@/store/useAuthStore"
import { useCartStore } from "@/store/useCartStore"
import { useProfileStore } from "@/store/useProfileStore"
import getAvgRating from "@/utils/avgRating"
import { CheckCircle, Globe, Info, Share2, Video } from "lucide-react"
import { toast } from "react-hot-toast"

import { CourseDetails as CourseDetailsType } from "@/types/course"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RatingStars } from "@/components/ui/rating-stars"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export default function CourseDetails() {
  const { token } = useAuthStore()
  const { user } = useProfileStore()
  const { addToCart } = useCartStore()
  const router = useRouter()
  const { courseId } = useParams()
  const [courseDetail, setCourseDetail] = useState<CourseDetailsType | null>(
    null
  )
  const [avgReviewCount, setAvgReviewCount] = useState(0)
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const handlePayment = () => {
    if (token && courseId) {
      buyCourse(token, [courseId], user, router.push)
    } else {
      router.push("/login")
    }
  }

  const handleAddToCart = () => {
    if (token && courseDetail) {
      addToCart(courseDetail)
      toast.success("Course added to cart")
    } else {
      router.replace("/login")
    }
  }

  useEffect(() => {
    const getCourseDetails = async () => {
      if (typeof courseId === "string") {
        setIsLoading(true)
        try {
          const response = await fetchCourseDetails(courseId)
          setCourseDetail(response)
          if (response.ratingAndReviews?.length) {
            const count = getAvgRating(response.ratingAndReviews)
            setAvgReviewCount(count)
          }
          if (response && user) {
            const enrolled = response.studentsEnrolled?.includes(user._id)
            setAlreadyEnrolled(enrolled)
          }
        } catch (error) {
          console.error("Error fetching course details:", error)
          toast.error("Failed to load course details")
        } finally {
          setIsLoading(false)
        }
      }
    }
    getCourseDetails()
  }, [courseId, user])

  if (isLoading) {
    return <CourseDetailsSkeleton />
  }

  if (!courseDetail) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Course not found</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
            {courseDetail.courseName}
          </h1>
          <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
            {courseDetail.courseDescription}
          </p>

          <div className="mb-6 flex flex-wrap items-center gap-4">
            <span className="text-2xl font-bold text-yellow-500">
              {avgReviewCount.toFixed(1)}
            </span>
            <RatingStars rating={avgReviewCount} />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({courseDetail.ratingAndReviews.length} reviews)
            </span>
            <Badge variant="secondary">
              {courseDetail.studentsEnrolled.length} students
            </Badge>
          </div>

          <div className="mb-6">
            <p className="text-lg font-semibold">
              Created by {courseDetail.instructor.firstName}{" "}
              {courseDetail.instructor.lastName}
            </p>
          </div>

          <div className="mb-8 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              <p>
                Last updated{" "}
                {new Date(courseDetail.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              <p>English</p>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What you&apos;ll learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {courseDetail.whatYouWillLearn
                  .split("\n")
                  .map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                      <span>{item.trim()}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>

          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Course Content</h2>
            <div className="mb-4 flex justify-between text-sm">
              <span>
                {courseDetail.courseContent.length} sections •{" "}
                {courseDetail.courseContent.reduce(
                  (acc, item) => acc + item.subSection.length,
                  0
                )}{" "}
                lectures
              </span>
              <Button
                variant="link"
                onClick={() =>
                  setExpandedSections(
                    expandedSections.length
                      ? []
                      : courseDetail.courseContent.map((_, i) => `section-${i}`)
                  )
                }
              >
                {expandedSections.length
                  ? "Collapse all sections"
                  : "Expand all sections"}
              </Button>
            </div>
            <Accordion
              type="multiple"
              value={expandedSections}
              onValueChange={setExpandedSections}
              className="w-full"
            >
              {courseDetail.courseContent.map((section, index) => (
                <AccordionItem key={section._id} value={`section-${index}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center justify-between w-full">
                      <span>{section.sectionName}</span>
                      <span className="text-sm text-muted-foreground mr-2">
                        {section.subSection.length} lectures
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {section.subSection.map((subSection) => (
                      <div
                        key={subSection._id}
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                      >
                        <Video className="h-5 w-5 text-blue-500" />
                        <span>{subSection.title}</span>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Instructor</h2>
            <div className="flex items-start gap-4">
              <Image
                src={courseDetail.instructor.image}
                alt={`${courseDetail.instructor.firstName} ${courseDetail.instructor.lastName}`}
                width={80}
                height={80}
                className="rounded-full"
              />
              <div>
                <p className="text-xl font-semibold">
                  {courseDetail.instructor.firstName}{" "}
                  {courseDetail.instructor.lastName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {courseDetail.instructor.additionalDetails?.about}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-semibold">Student Reviews</h2>
            {courseDetail.ratingAndReviews.length > 0 ? (
              courseDetail.ratingAndReviews.map((review) => (
                <div
                  key={review.user._id}
                  className="mb-4 border-b border-gray-200 pb-4 last:border-b-0"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Image
                      src={review.user.image}
                      alt={`${review.user.firstName} ${review.user.lastName}`}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <p className="font-semibold">
                      {review.user.firstName} {review.user.lastName}
                    </p>
                  </div>
                  <RatingStars rating={review.rating} />
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {review.review}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-14">
            <CardContent className="p-6">
              <Image
                src={courseDetail.thumbnail}
                alt={courseDetail.courseName}
                width={400}
                height={225}
                className="mb-4 rounded-lg object-cover"
              />
              <p className="mb-4 text-3xl font-bold">₹{courseDetail.price}</p>
              {user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                <>
                  {alreadyEnrolled ? (
                    <Button
                      className="mb-4 w-full"
                      onClick={() => router.push("/dashboard/enrolled-courses")}
                    >
                      Go to Course
                    </Button>
                  ) : (
                    <>
                      <Button className="mb-4 w-full" onClick={handlePayment}>
                        Buy Now
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleAddToCart}
                      >
                        Add to Cart
                      </Button>
                    </>
                  )}
                </>
              )}
              <p className="mb-4 mt-6 text-center text-sm text-gray-500">
                30-Day Money-Back Guarantee
              </p>
              <div>
                <h3 className="mb-2 text-lg font-semibold">
                  This course includes:
                </h3>
                <ul className="space-y-2 text-sm">
                  {JSON.parse(courseDetail.instructions).map(
                    (item: string, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>{item}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
              <Separator className="my-6" />
              <Button
                variant="link"
                className="mx-auto flex items-center gap-2"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  toast.success("URL copied to clipboard")
                }}
              >
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function CourseDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-full mb-6" />
          <Skeleton className="h-6 w-1/2 mb-6" />
          <Skeleton className="h-24 w-full mb-8" />
          <Skeleton className="h-64 w-full mb-8" />
          <Skeleton className="h-48 w-full mb-8" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-48 w-full mb-4" />
              <Skeleton className="h-8 w-1/2 mb-4" />
              <Skeleton className="h-10 w-full mb-4" />
              <Skeleton className="h-10 w-full mb-6" />
              <Skeleton className="h-4 w-3/4 mx-auto mb-6" />
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
