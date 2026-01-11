"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils"; // Ensure this path matches your project structure
import HighlightText from "./highlighted-text";

const data = [
  {
    title: "Learn at Your Own Pace",
    content:
      "Enjoy the flexibility to learn whenever and wherever you want, with courses designed to fit your schedule. Whether you're a beginner or advancing, we have content suited for every skill level.",
    srcImage:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Interactive Projects",
    content:
      "Apply your learning through hands-on projects, quizzes, and real-world scenarios. Get instant feedback to help you understand concepts better and improve your skills.",
    srcImage:
      "https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Expert-Led Courses",
    content:
      "Learn from seasoned instructors and industry professionals with years of experience. Gain insights from their expertise and prepare for real-world challenges.",
    srcImage:
      "https://plus.unsplash.com/premium_photo-1661277604122-4324e519402a?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Get Certified",
    content:
      "Upon completing your course, receive a recognized certification that can enhance your resume and showcase your new skills to potential employers.",
    srcImage:
      "https://plus.unsplash.com/premium_photo-1682765673084-a37ffa743012?w=800&auto=format&fit=crop&q=80",
  },
];

export function Features() {
  const [featureOpen, setFeatureOpen] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 10);
    }, 10);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timer > 10_000) {
      // Cycle every 10 seconds (10,000ms)
      setFeatureOpen((prev) => (prev + 1) % data.length);
      setTimer(0);
    }
  }, [timer]);

  return (
    <section className="container relative my-24">
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-100/50 px-3 py-1 text-neutral-600 text-sm dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
          </span>
          <span className="font-semibold text-xs uppercase tracking-wider">
            Features Overview
          </span>
        </div>

        <h2 className="mb-4 font-bold text-4xl text-neutral-900 leading-tight tracking-tight md:text-5xl dark:text-neutral-100">
          Maximize Your <HighlightText text="Learning Experience" />
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          We provide the tools and resources you need to master new skills
          effectively.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        {/* Left Column: Text Accordion */}
        <div className="space-y-4">
          {data.map((item, index) => (
            <div
              className={cn(
                "group relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300",
                featureOpen === index
                  ? "border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900/50 dark:shadow-none"
                  : "border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900/20"
              )}
              key={item.title}
              onClick={() => {
                setFeatureOpen(index);
                setTimer(0);
              }}
            >
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-bold text-sm transition-colors",
                      featureOpen === index
                        ? "bg-primary text-primary-foreground" // Assuming you have standard shadcn variables
                        : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800"
                    )}
                  >
                    0{index + 1}
                  </span>
                  <h3
                    className={cn(
                      "font-semibold text-xl transition-colors",
                      featureOpen === index
                        ? "text-neutral-900 dark:text-white"
                        : "text-neutral-600 dark:text-neutral-400"
                    )}
                  >
                    {item.title}
                  </h3>
                </div>

                <div
                  className={cn(
                    "grid transition-all duration-500 ease-in-out",
                    featureOpen === index
                      ? "mt-4 grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="text-base text-neutral-600 leading-relaxed dark:text-neutral-400">
                      {item.content}
                    </p>

                    {/* Mobile Image (Visible only on small screens) */}
                    <div className="relative mt-6 block h-48 w-full overflow-hidden rounded-lg md:hidden">
                      <img
                        alt={item.title}
                        className="absolute inset-0 h-full w-full object-cover"
                        src={item.srcImage}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {featureOpen === index && (
                <div className="absolute bottom-0 left-0 h-1 w-full bg-neutral-100 dark:bg-neutral-800">
                  <motion.div
                    animate={{ width: `${(timer / 10_000) * 100}%` }}
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    transition={{ ease: "linear", duration: 0.05 }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Column: Desktop Image (Hidden on Mobile) */}
        <div className="relative hidden h-[500px] w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 md:block dark:border-neutral-800 dark:bg-neutral-900">
          <AnimatePresence mode="wait">
            <motion.img
              alt={data[featureOpen]?.title}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 h-full w-full object-cover"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0, scale: 1.05 }}
              key={data[featureOpen]?.srcImage}
              src={data[featureOpen]?.srcImage}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </AnimatePresence>

          {/* Overlay Gradient for better text contrast if needed */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
        </div>
      </div>
    </section>
  );
}
