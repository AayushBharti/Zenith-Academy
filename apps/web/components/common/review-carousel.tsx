"use client";

import Autoplay from "embla-carousel-autoplay";
import { CheckCircle2, Quote, Star } from "lucide-react";
import type React from "react";
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

// --- Types ---
interface Review {
  id: number;
  name: string;
  image: string;
  rating: number;
  review: string;
  role?: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Alice Johnson",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=150&h=150",
    rating: 5,
    role: "Full-Stack Dev",
    review:
      "Absolutely love this platform! It has made my learning journey so much easier. The attention to detail in the courses is impressive.",
  },
  {
    id: 2,
    name: "Bob Smith",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?fit=crop&w=150&h=150",
    rating: 4,
    role: "Student",
    review:
      "Great value for money. The instructors explain complex topics simply. Would definitely recommend to others.",
  },
  {
    id: 3,
    name: "Carol Williams",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=150&h=150",
    rating: 5,
    role: "Product Designer",
    review:
      "Top-notch quality and excellent support. I've been using this for months to upskill and it still works like new.",
  },
  {
    id: 4,
    name: "David Brown",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=150&h=150",
    rating: 4,
    role: "Backend Engineer",
    review:
      "Very satisfied with my purchase. The project-based learning approach exceeded my expectations in many ways.",
  },
  {
    id: 5,
    name: "Eva Davis",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?fit=crop&w=150&h=150",
    rating: 5,
    role: "Freelancer",
    review:
      "Exceeded my expectations. Truly a game-changer! I can't imagine going back to my old study routine without it.",
  },
];

// --- Review Card Component ---
const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
  <Card className="group relative h-full overflow-hidden border-none bg-black/10 shadow-md transition-all duration-300 hover:shadow-lg dark:bg-white/10">
    <CardContent className="relative z-10 flex h-full flex-col p-6">
      {/* Decorative Quote - Fixed Visibility */}
      <div className="absolute top-4 right-6 text-primary/10 transition-colors duration-300 group-hover:text-primary/20">
        <Quote className="h-12 w-12 fill-current" />
      </div>

      {/* Header: Avatar & Info */}
      <div className="mb-4 flex items-center gap-4">
        <div className="relative">
          <Avatar className="h-12 w-12 border-2 border-background shadow-xs">
            <AvatarImage
              alt={review.name}
              className="object-cover"
              src={review.image}
            />
            <AvatarFallback className="bg-primary/10 font-bold text-primary">
              {review.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {/* Verified Badge */}
          <div className="-bottom-1 -right-1 absolute rounded-full bg-background p-0.5">
            <CheckCircle2 className="h-4 w-4 fill-emerald-50 text-emerald-500" />
          </div>
        </div>

        <div>
          <h3 className="font-bold text-foreground text-sm">{review.name}</h3>
          <p className="text-muted-foreground text-xs">
            {review.role || "Student"}
          </p>
        </div>
      </div>

      {/* Rating Stars */}
      <div
        aria-label={`Rated ${review.rating} out of 5 stars`}
        className="mb-4 flex items-center gap-0.5"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            className={cn(
              "h-4 w-4",
              i < review.rating
                ? "fill-amber-400 text-amber-400"
                : "fill-muted-foreground/20 text-muted-foreground/20"
            )}
            key={i}
          />
        ))}
      </div>

      {/* Review Text */}
      <blockquote className="flex-1">
        <p className="line-clamp-4 text-[15px] text-muted-foreground leading-relaxed">
          {review.review}
        </p>
      </blockquote>
    </CardContent>
  </Card>
);

// --- Carousel Component ---
export default function ReviewsCarousel() {
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  return (
    <section className="w-full bg-background py-20">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-center space-y-4 text-center">
          <Badge
            className="border-primary/20 bg-primary/5 px-3 py-1 text-primary"
            variant="outline"
          >
            Reviews
          </Badge>
          <h2 className="font-bold text-3xl tracking-tight md:text-4xl">
            Loved by students worldwide
          </h2>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Don&apos;t just take our word for it. See what our community has to
            say about their learning experience.
          </p>
        </div>

        {/* Carousel with CourseSlider Logic */}
        <Carousel
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[plugin.current]}
        >
          <CarouselContent className="-ml-4 pb-4">
            {reviews.map((review) => (
              <CarouselItem
                className="basis-[85%] pl-4 md:basis-[45%] lg:basis-[32%] xl:basis-[25%]"
                // "Peeking" logic matches CourseSlider
                key={review.id}
              >
                <div className="h-full p-1">
                  <ReviewCard review={review} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Controls */}
          <div className="mt-4 hidden justify-end gap-2 pr-4 md:flex">
            <CarouselPrevious className="static h-10 w-10 translate-y-0 border-muted-foreground/20 transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground" />
            <CarouselNext className="static h-10 w-10 translate-y-0 border-muted-foreground/20 transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
