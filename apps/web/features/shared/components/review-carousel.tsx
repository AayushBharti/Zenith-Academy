"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel";
import { cn } from "@workspace/ui/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import { Quote, Star } from "lucide-react";
import type React from "react";
import { useRef } from "react";

// --- Types ---
interface Review {
  id: number;
  name: string;
  image: string;
  rating: number;
  review: string;
  role?: string;
  course?: string; // Added for more context
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Alina Johanson",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=150&h=150",
    rating: 5,
    role: "Full-Stack Developer",
    course: "Next.js Mastery",
    review:
      "The cohort model changed everything. Having peers review my Next.js projects caught bugs I'd never have found alone. Landed my dream job within three months.",
  },
  {
    id: 2,
    name: "Mark Robinson",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?fit=crop&w=150&h=150",
    rating: 5,
    role: "Junior ML Engineer",
    course: "Python for Data Science",
    review:
      "I came in knowing zero Python. My cohort kept me accountable through the tough weeks. Now I'm a junior ML engineer at a startup I admire.",
  },
  {
    id: 3,
    name: "Carol Williams",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=150&h=150",
    rating: 5,
    role: "Blockchain Dev",
    course: "Web3 & Solidity",
    review:
      "Best part isn't the videos — it's the weekly office hours. Getting my Web3 questions answered live by the instructor was invaluable.",
  },
  {
    id: 4,
    name: "David Chen",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=150&h=150",
    rating: 5,
    role: "Senior Engineer",
    course: "System Design",
    review:
      "Peer code reviews were intimidating at first. Now I review PRs at work with confidence I never had before. This platform trains real engineering instincts.",
  },
  {
    id: 5,
    name: "Eva Rodriguez",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?fit=crop&w=150&h=150",
    rating: 5,
    role: "Frontend Developer",
    course: "React & TypeScript",
    review:
      "Switched from marketing to frontend in 6 months. The community support made it possible — I wouldn't have survived self-study alone.",
  },
];

// --- Review Card Component ---
const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
  <Card className="relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
    <CardContent className="relative z-10 flex h-full flex-col p-6">
      <Quote className="absolute top-4 right-5 h-16 w-16 text-foreground/5" />

      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              className={cn(
                "h-4 w-4",
                i < review.rating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-muted text-muted-foreground/50"
              )}
              key={i}
            />
          ))}
        </div>

        <blockquote className="text-foreground/90 text-sm leading-relaxed">
          {review.review}
        </blockquote>
      </div>

      <div className="mt-6 flex items-center gap-4 border-border/50 border-t pt-5">
        <Avatar className="h-10 w-10">
          <AvatarImage alt={review.name} src={review.image} />
          <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-sm">
            {review.name}
          </h3>
          <p className="text-muted-foreground text-xs">
            {review.role}, on{" "}
            <span className="font-medium text-foreground/80">
              {review.course}
            </span>
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

import { SectionHeader } from "./section-header";

// --- Carousel Component ---
export default function ReviewsCarousel() {
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  return (
    <section className="relative w-full overflow-hidden bg-muted/30 py-20">
      {/* Background Glow */}
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2">
        <div className="h-[400px] w-[900px] rounded-full bg-gradient-to-r from-primary/5 via-background to-background blur-3xl" />
      </div>

      <div className="container relative">
        <SectionHeader
          badge="From the Community"
          description="Real results from real developers — career changes, promotions, and skills that stuck."
          title="Engineers Who Learned Here"
        />

        {/* Carousel */}
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
                className="basis-[90%] pl-4 md:basis-[48%] lg:basis-1/3"
                key={review.id}
              >
                <div className="h-full p-1">
                  <ReviewCard review={review} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="-left-4 -translate-y-1/2 absolute top-1/2 z-10 h-10 w-10" />
          <CarouselNext className="-right-4 -translate-y-1/2 absolute top-1/2 z-10 h-10 w-10" />
        </Carousel>
      </div>
    </section>
  );
}
