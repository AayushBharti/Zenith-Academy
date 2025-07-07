import { ChevronRight } from "lucide-react"

import { Button } from "../ui/button"

export default function CTASection() {
  return (
    <section className="py-20 sm:py-32 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Ready to Transform Your Learning Journey?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground mb-8">
            Join a global community of learners and unlock your full potential
            with ZenithAcademy.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="default" size="lg" className="group">
              Start Learning Now
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg">
              View Course Catalog
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
