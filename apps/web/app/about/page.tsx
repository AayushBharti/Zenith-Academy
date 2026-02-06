import CTASection from "@/components/about/cta";
import FAQ from "@/components/about/faq";
// import HeroAbout from "@/components/about/hero-about"
import LearningGrid from "@/components/about/learning-grid";
// import Mission from "@/components/about/mission"
import Statistics from "@/components/about/statistics";
import VideoSection from "@/components/about/vIdeo-section";
import ReviewsCarousel from "@/components/common/review-carousel";

export default function PremiumDarkModeEdTechAboutPage() {
  return (
    <div className="min-h-screen bg-background pt-16 text-foreground">
      {/* <HeroAbout /> */}

      {/* <Mission /> */}

      <LearningGrid />

      <Statistics />

      <VideoSection />

      <FAQ />

      <CTASection />

      <ReviewsCarousel />
    </div>
  );
}
