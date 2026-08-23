import { AboutHero } from "@/features/about/components/about-hero";
import CTASection from "@/features/about/components/cta";
import FAQ from "@/features/about/components/faq";
import LearningGrid from "@/features/about/components/learning-grid";
import { WhatWeBelieve } from "@/features/about/components/what-we-believe";
import { StatsBar } from "@/features/home/components/stats-bar";
import ReviewsCarousel from "@/features/shared/components/review-carousel";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-16">
      <AboutHero />
      <StatsBar />
      <WhatWeBelieve />
      <LearningGrid />
      <FAQ />
      <CTASection />
      <ReviewsCarousel />
    </div>
  );
}
