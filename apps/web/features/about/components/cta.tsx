import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { SectionHeader } from "../../shared/components/section-header";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      <div className="container relative z-10">
        <SectionHeader
          description="Join thousands of engineers learning, reviewing, and growing together."
          title="Start Building With Your First Cohort"
        />
        <div className="flex justify-center gap-4">
          <Button animation="swap" asChild size="lg" variant="default">
            <Link href="/signup">Start Learning Free</Link>
          </Button>
          <Button animation="slide-in" asChild size="lg" variant="outline">
            <Link href="/catalog">Explore Paths</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
