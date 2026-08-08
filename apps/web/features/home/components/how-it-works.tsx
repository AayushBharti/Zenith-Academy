"use client";

import { Award, Code, Users } from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import { SectionHeader } from "../../shared/components/section-header";
import HighlightText from "./highlighted-text";

interface Step {
  icon: React.ElementType;
  label: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: Users,
    label: "STEP 01",
    title: "Join a Cohort",
    description:
      "Match with peers at your level. Learn on a shared timeline with built-in accountability.",
  },
  {
    icon: Code,
    label: "STEP 02",
    title: "Build With Peers",
    description:
      "Tackle real-world projects, review each other's code, and grow through collaboration.",
  },
  {
    icon: Award,
    label: "STEP 03",
    title: "Get Certified",
    description:
      "Complete your path, earn credentials, and showcase verified skills to employers.",
  },
];

export function HowItWorks() {
  return (
    <section className="container relative my-24">
      <SectionHeader
        badge="How It Works"
        description="A structured path from your first lesson to a verified credential — with peers by your side at every step."
        title={
          <>
            From First Lesson to <HighlightText text="Career-Ready" />
          </>
        }
      />

      <div className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
        {/* Connecting dashed line spanning all 3 circles (desktop only) */}
        <div className="absolute top-16 hidden w-full items-center px-24 md:flex lg:px-32">
          <div className="h-0 w-full border-primary/30 border-t-2 border-dashed" />
        </div>

        {steps.map((step, index) => (
          <motion.div
            className="relative flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 30 }}
            key={step.label}
            transition={{
              duration: 0.5,
              delay: index * 0.15,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            {/* Icon circle */}
            <div className="relative z-10 mb-4 flex size-32 items-center justify-center rounded-full border-2 border-primary/30 bg-background shadow-lg">
              <step.icon className="size-10 text-primary" strokeWidth={1.5} />
            </div>

            {/* Step label */}
            <span className="mb-2 font-semibold text-primary text-xs uppercase tracking-widest">
              {step.label}
            </span>

            {/* Title */}
            <h3 className="mb-2 font-bold text-xl">{step.title}</h3>

            {/* Description */}
            <p className="max-w-xs text-muted-foreground leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
