"use client";

import { CodeBlocksSection } from "@/features/home/components/code-blocks";
import { CommunitySpotlight } from "@/features/home/components/community-spotlight";
import ExploreMore from "@/features/home/components/explore-more";
import Hero from "@/features/home/components/hero";
import { HowItWorks } from "@/features/home/components/how-it-works";
import InstructorSection from "@/features/home/components/instructor-section";
import { StatsBar } from "@/features/home/components/stats-bar";
import ReviewsCarousel from "@/features/shared/components/review-carousel";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Hero />
      <StatsBar />
      <HowItWorks />
      <CodeBlocksSection />
      <ExploreMore />
      <CommunitySpotlight />
      <InstructorSection />
      <ReviewsCarousel />
    </main>
  );
}
