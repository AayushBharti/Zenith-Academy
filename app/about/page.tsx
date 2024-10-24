import CTASection from "@/components/About/CTA"
import FAQ from "@/components/About/FAQ"
import HeroAbout from "@/components/About/HeroAbout"
import LearningGrid from "@/components/About/LearningGrid"
import Mission from "@/components/About/Mission"
import Statistics from "@/components/About/Statistics"
import VideoSection from "@/components/About/VIdeoSection"
import ReviewsCarousel from "@/components/Common/ReviewCarousel"

export default function PremiumDarkModeEdTechAboutPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <HeroAbout />

      <Mission />

      <LearningGrid />

      <Statistics />

      <VideoSection />

      <FAQ />

      <CTASection />

      <ReviewsCarousel />
    </div>
  )
}
