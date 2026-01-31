"use client";

import ReviewsCarousel from "@/components/common/review-carousel";
import { CodeBlocksSection } from "@/components/home/code-blocks";
import ExploreMore from "@/components/home/explore-more";
import { Features } from "@/components/home/features";
import Hero from "@/components/home/hero";
import InstructorSection from "@/components/home/instructor-section";

export default function Home() {
  return (
    <main className="relative mx-auto overflow-x-hidden dark:bg-black-100">
      <Hero />
      <Features />
      <CodeBlocksSection />
      <ExploreMore />
      <InstructorSection />
      <ReviewsCarousel />
    </main>
  );
}
