"use client";

import {
  AlertCircle,
  Award,
  Check,
  ChevronDown,
  Clock,
  Globe,
  Info,
  Lock,
  MonitorPlay,
  Share2,
  Video,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RatingStars } from "@/components/ui/rating-stars";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ACCOUNT_TYPE } from "@/data/constants";
import { fetchCourseDetails } from "@/services/course-details-service";
import { buyCourse } from "@/services/payment-service";
import { useAuthStore } from "@/store/use-auth-store";
import { useCartStore } from "@/store/use-cart-store";
import { useProfileStore } from "@/store/use-profile-store";
import type { CourseDetails as CourseDetailsType } from "@/types/course";
import getAvgRating from "@/utils/avg-rating";

export default function CourseDetails() {
  const { token } = useAuthStore();
  const { user } = useProfileStore();
  const { addToCart } = useCartStore();
  const router = useRouter();
  const { courseId } = useParams();

  const [course, setCourse] = useState<CourseDetailsType | null>(null);
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- Data Fetching ---
  useEffect(() => {
    const getCourseDetails = async () => {
      if (!courseId) return;
      setIsLoading(true);
      try {
        const response = await fetchCourseDetails(courseId as string);
        setCourse(response);

        if (response?.ratingAndReviews?.length) {
          setAvgReviewCount(getAvgRating(response.ratingAndReviews));
        }

        if (response && user) {
          setAlreadyEnrolled(response.studentsEnrolled?.includes(user._id));
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
        toast.error("Failed to load course details");
      } finally {
        setIsLoading(false);
      }
    };
    getCourseDetails();
  }, [courseId, user]);

  // --- Handlers ---
  const handlePayment = () => {
    if (token && courseId) {
      buyCourse(token, [courseId as string], user, router.push);
    } else {
      toast.error("Please login to purchase course");
      router.push("/login");
    }
  };

  const handleAddToCart = () => {
    if (token && course) {
      addToCart(course);
      toast.success("Added to cart");
    } else {
      toast.error("Please login to add to cart");
      router.push("/login");
    }
  };

  // --- Formatting ---
  const totalLectures = useMemo(
    () =>
      course?.courseContent?.reduce(
        (acc, sec) => acc + sec.subSection.length,
        0
      ) || 0,
    [course]
  );

  if (isLoading) return <CourseDetailsSkeleton />;
  if (!course) return <ErrorState />;

  return (
    <div className="mt-16 min-h-screen bg-background pb-20">
      {/* ================= HERO SECTION ================= */}
      <div className="relative bg-slate-900 px-4 pt-10 pb-12 text-white md:px-8">
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {/* Breadcrumb-ish */}
            <div className="mb-4 flex items-center gap-2 text-slate-300 text-sm">
              <span>Home</span> <span className="text-slate-500">/</span>
              <span>Course</span> <span className="text-slate-500">/</span>
              <span className="font-medium text-primary">
                {course.category?.name}
              </span>
            </div>

            <h1 className="font-bold text-3xl leading-tight md:text-4xl">
              {course.courseName}
            </h1>
            <p className="max-w-2xl text-lg text-slate-300">
              {course.courseDescription}
            </p>

            {/* Ratings & Enrolled */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-sm">
              <div className="flex items-center gap-1">
                <span className="font-bold text-amber-400 text-base">
                  {avgReviewCount.toFixed(1)}
                </span>
                <RatingStars maxRating={5} rating={avgReviewCount} />
                <span className="cursor-pointer text-slate-400 underline">
                  ({course.ratingAndReviews.length} ratings)
                </span>
              </div>
              <div className="text-slate-300">
                {course.studentsEnrolled.length.toLocaleString()} students
              </div>
            </div>

            {/* Author & Meta */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-slate-300 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Created by</span>
                <span className="text-white underline decoration-2 decoration-primary underline-offset-4">
                  {course.instructor.firstName} {course.instructor.lastName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                <span>
                  Last updated {new Date(course.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>English</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-10 px-4 md:px-8 lg:grid-cols-3">
        {/* --- LEFT COLUMN --- */}
        <div className="space-y-10 lg:col-span-2">
          {/* What You Will Learn */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-6 font-bold text-2xl">What you&apos;ll learn</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {course.whatYouWillLearn.split("\n").map((item, i) => (
                <div className="flex items-start gap-3" key={i}>
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-muted-foreground text-sm leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Content (Curriculum) */}
          <div className="space-y-4">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <h2 className="font-bold text-2xl">Course Content</h2>
              <div className="flex gap-2 text-muted-foreground text-sm">
                <span>{course.courseContent.length} sections</span> •
                <span>{totalLectures} lectures</span>
              </div>
            </div>

            {/* Custom Accordion Replacement */}
            <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
              {course.courseContent.map((section) => (
                <CurriculumSection key={section._id} section={section} />
              ))}
            </div>
          </div>

          {/* Instructor */}
          <div className="space-y-4">
            <h2 className="font-bold text-2xl">Instructor</h2>
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/10">
                <AvatarImage src={course.instructor.image} />
                <AvatarFallback>
                  {course.instructor.firstName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="font-bold text-lg text-primary">
                  {course.instructor.firstName} {course.instructor.lastName}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {course.instructor.additionalDetails?.about ||
                    "Experienced Instructor specializing in modern web technologies."}
                </p>

                <div className="flex gap-4 pt-2">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                    <Award className="h-4 w-4" /> Instructor Rating:{" "}
                    {avgReviewCount.toFixed(1)}
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                    <MonitorPlay className="h-4 w-4" />{" "}
                    {course.studentsEnrolled.length} Students
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN (Sticky Sidebar) --- */}
        <div className="relative lg:col-span-1">
          <div className="space-y-6 lg:sticky lg:top-24">
            {/* Floating Buy Card (Moved up via negative margin on desktop to overlap Hero) */}
            <Card className="lg:-mt-[200px] relative z-20 overflow-hidden border-0 shadow-xl">
              <div className="group relative aspect-video w-full cursor-pointer overflow-hidden bg-slate-900">
                <Image
                  alt={course.courseName}
                  className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                  fill
                  src={course.thumbnail}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/40">
                  <div className="scale-90 rounded-full bg-white/90 p-4 shadow-lg transition-transform group-hover:scale-100">
                    <MonitorPlay className="ml-1 h-8 w-8 text-primary" />
                  </div>
                </div>
              </div>

              <CardContent className="space-y-6 p-6">
                <div className="space-y-1">
                  <div className="font-bold text-3xl text-foreground">
                    ₹{course.price}
                  </div>
                </div>

                {user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                  <div className="space-y-3">
                    {alreadyEnrolled ? (
                      <Button
                        className="h-11 w-full font-semibold text-base"
                        onClick={() =>
                          router.push("/dashboard/enrolled-courses")
                        }
                      >
                        Go to Course
                      </Button>
                    ) : (
                      <>
                        <Button
                          className="h-11 w-full font-semibold text-base"
                          onClick={handlePayment}
                        >
                          Buy Now
                        </Button>
                        <Button
                          className="h-11 w-full border-primary/20 font-semibold text-base hover:bg-primary/5 hover:text-primary"
                          onClick={handleAddToCart}
                          variant="outline"
                        >
                          Add to Cart
                        </Button>
                      </>
                    )}
                    <div className="pt-1 text-center text-muted-foreground text-xs">
                      30-Day Money-Back Guarantee
                    </div>
                  </div>
                )}

                <div className="space-y-4 pt-2">
                  <p className="font-bold text-sm">This course includes:</p>
                  <ul className="space-y-3 text-muted-foreground text-sm">
                    <li className="flex items-center gap-3">
                      <Clock className="h-4 w-4" /> Lifetime access
                    </li>
                    <li className="flex items-center gap-3">
                      <MonitorPlay className="h-4 w-4" /> Access on mobile and
                      TV
                    </li>
                    <li className="flex items-center gap-3">
                      <Award className="h-4 w-4" /> Certificate of completion
                    </li>
                  </ul>
                </div>

                <Separator />

                <div className="flex items-center justify-between font-medium text-sm">
                  <button
                    className="flex items-center gap-2 text-primary hover:underline"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copied to clipboard");
                    }}
                  >
                    <Share2 className="h-4 w-4" /> Share
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: Curriculum Section (No Accordion) ---
function CurriculumSection({ section }: { section: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-card">
      {/* Header */}
      <div
        className="flex cursor-pointer select-none items-center justify-between p-4 transition-colors hover:bg-secondary/20"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
          <span className="font-semibold text-sm md:text-base">
            {section.sectionName}
          </span>
        </div>
        <div className="text-muted-foreground text-xs md:text-sm">
          {section.subSection.length} lectures
        </div>
      </div>

      {/* Content Body */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            className="overflow-hidden"
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="pb-2">
              {section.subSection.map((sub: any) => (
                <div
                  className="flex items-start gap-3 px-4 py-3 pl-11 transition-colors hover:bg-secondary/10"
                  key={sub._id}
                >
                  <div className="mt-0.5">
                    <Video className="h-4 w-4 text-primary/70" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-foreground text-sm">
                      {sub.title}
                    </p>
                    <p className="line-clamp-1 text-muted-foreground text-xs">
                      {sub.description || "Video lecture"}
                    </p>
                  </div>
                  <div className="mt-0.5 text-muted-foreground text-xs">
                    <Lock className="h-3 w-3" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Loading & Error States ---

function ErrorState() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
      <AlertCircle className="h-12 w-12 text-muted-foreground" />
      <h2 className="font-bold text-xl">Course not found</h2>
      <Button
        onClick={() => (window.location.href = "/catalog")}
        variant="outline"
      >
        Browse Courses
      </Button>
    </div>
  );
}

function CourseDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Skeleton */}
      <div className="h-[300px] w-full animate-pulse bg-slate-900" />

      <div className="-mt-20 mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 md:px-8 lg:grid-cols-3">
        <div className="space-y-8 pt-20 lg:col-span-2">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-[400px] w-full rounded-xl shadow-xl" />
        </div>
      </div>
    </div>
  );
}
