import { ArrowRight, CheckCircle2 } from "lucide-react";
import * as motion from "motion/react-client";
import { Button } from "@/components/ui/button";
import HighlightText from "./highlighted-text";

export default function InstructorSection() {
  return (
    <section className="relative w-full overflow-hidden bg-background py-24">
      {/* Background Decoration */}
      <div className="-z-10 -translate-y-1/2 absolute top-1/2 left-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="container mx-auto px-5 md:px-10">
        <div className="flex flex-col-reverse items-center gap-16 lg:flex-row lg:gap-24">
          {/* --- Image Section --- */}
          <motion.div
            className="relative w-full lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            {/* Decorative Backing */}
            <div className="-left-4 -top-4 absolute h-full w-full rounded-3xl border-2 border-primary/20 border-dashed" />

            <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-neutral-200/50 dark:shadow-black/50">
              <img // Or <Image /> if you have Next.js image config set up
                alt="ZenithAcademy Instructor"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                src="/assets/instructor-pic.png"
                style={{ maxHeight: "600px" }}
              />

              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 rounded-xl bg-white/90 p-4 shadow-lg backdrop-blur-sm dark:bg-neutral-900/90">
                <div className="flex items-center gap-3">
                  <div className="-space-x-3 flex">
                    {[1, 2, 3].map((i) => (
                      <div
                        className="h-8 w-8 rounded-full border-2 border-white bg-neutral-200 dark:border-neutral-800"
                        key={i}
                      />
                    ))}
                  </div>
                  <div className="font-semibold text-xs">
                    <span className="block text-primary">250+</span>
                    <span className="text-neutral-500">Instructors</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* --- Content Section --- */}
          <motion.div
            className="flex flex-col gap-8 lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <div className="space-y-4">
              <h2 className="font-bold text-4xl text-neutral-900 leading-[1.1] tracking-tight sm:text-5xl dark:text-neutral-100">
                Become an <br />
                <HighlightText text="Instructor" />
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed dark:text-neutral-400">
                Join a global community of educators and teach millions of
                students from around the world. ZenithAcademy gives you the
                tools to create courses, share your knowledge, and grow your
                teaching career.
              </p>
            </div>

            {/* Feature List (Optional visual break) */}
            <div className="grid grid-cols-1 gap-3 font-medium text-neutral-700 text-sm sm:grid-cols-2 dark:text-neutral-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Teach your way</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Inspire learners</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Earn money</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Join our community</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                className="h-12 px-8 text-base shadow-lg shadow-primary/25 transition-all hover:scale-105 active:scale-95"
                size="lg"
              >
                Start Teaching Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
