"use client";

import { BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { RatingStars } from "@/components/ui/rating-stars";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { CourseDetails } from "@/types/course";
import getAvgRating from "@/utils/avg-rating";

interface CourseCardProps {
  course: CourseDetails;
  className?: string;
}

export function CourseCard({ course, className }: CourseCardProps) {
  const [avgReviewCount, setAvgReviewCount] = useState(0);

  useEffect(() => {
    const count = getAvgRating(course.ratingAndReviews);
    setAvgReviewCount(count);
  }, [course]);

  // Helper to format price
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <Link
      className={cn("block h-full outline-hidden", className)}
      href={`/courses/${course._id}`}
    >
      <Card className="group flex h-full flex-col overflow-hidden border-border/60 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
        {/* --- Image Section --- */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            alt={course.courseName}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={course.thumbnail}
          />

          {/* Category Badge (Top Left) */}
          {course.category?.name && (
            <div className="absolute top-3 left-3">
              <Badge
                className="bg-background/90 shadow-xs backdrop-blur-xs hover:bg-background/90"
                variant="secondary"
              >
                {course.category.name}
              </Badge>
            </div>
          )}
        </div>

        {/* --- Content Section --- */}
        <CardContent className="flex flex-1 flex-col gap-4 p-5">
          {/* Title */}
          <div className="space-y-2">
            <h3 className="line-clamp-2 font-bold text-lg leading-tight transition-colors group-hover:text-primary">
              {course.courseName}
            </h3>
            {/* Optional: Add lesson count if available in your type, otherwise visual spacer */}
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{course.courseContent?.length || 0} Sections</span>
            </div>
          </div>

          {/* Instructor Info */}
          <div className="mt-auto flex items-center gap-3 pt-2">
            <Avatar className="h-8 w-8 border border-border">
              <AvatarImage
                alt={course.instructor?.firstName}
                src={course.instructor?.image}
              />
              <AvatarFallback className="text-xs">
                {course.instructor?.firstName?.[0]}
                {course.instructor?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <p className="line-clamp-1 font-medium text-muted-foreground text-sm">
              {course.instructor.firstName} {course.instructor.lastName}
            </p>
          </div>
        </CardContent>

        <Separator className="bg-border/60" />

        {/* --- Footer Section --- */}
        <CardFooter className="flex items-center justify-between bg-secondary/5 p-4">
          {/* Ratings */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-foreground text-sm">
                {avgReviewCount.toFixed(1)}
              </span>
              <RatingStars rating={avgReviewCount} size={14} />
            </div>
            <span className="text-muted-foreground text-xs">
              ({course.ratingAndReviews.length} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="flex items-center justify-end font-bold text-lg text-primary">
              {course.price === 0 ? "Free" : formatPrice(course.price)}
            </p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
