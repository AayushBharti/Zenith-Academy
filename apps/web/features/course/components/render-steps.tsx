"use client";

import { cn } from "@workspace/ui/lib/utils";
import { Check, FileText, LayoutDashboard, Rocket } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import useCourseStore from "@/features/course/use-course-store";

import CourseBuilderForm from "./course-builder/course-builder";
import CourseInformationForm from "./course-information/course-information-form";
import PublishCourseForm from "./publish-course";

const steps = [
  {
    id: 1,
    title: "Information",
    description: "Basic details",
    icon: FileText,
  },
  {
    id: 2,
    title: "Builder",
    description: "Sections & lectures",
    icon: LayoutDashboard,
  },
  {
    id: 3,
    title: "Publish",
    description: "Review & launch",
    icon: Rocket,
  },
];

export function RenderSteps() {
  const { step } = useCourseStore();

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <CourseInformationForm />;
      case 2:
        return <CourseBuilderForm />;
      case 3:
        return <PublishCourseForm />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Stepper */}
      <div className="relative">
        {/* Background track connecting steps */}
        <div className="absolute top-6 right-12 left-12 hidden h-px bg-border sm:block" />

        <div className="relative grid grid-cols-3">
          {steps.map((item) => {
            const isCompleted = step > item.id;
            const isCurrent = step === item.id;
            const Icon = item.icon;

            return (
              <div
                className="flex flex-col items-center gap-2 text-center"
                key={item.id}
              >
                {/* Circle */}
                <motion.div
                  animate={{
                    scale: isCurrent ? 1 : 1,
                  }}
                  className={cn(
                    "relative z-10 grid size-12 place-items-center rounded-full border-2 transition-colors duration-300",
                    isCompleted &&
                      "border-primary bg-primary text-primary-foreground",
                    isCurrent &&
                      "border-primary bg-primary/10 text-primary",
                    !isCompleted &&
                      !isCurrent &&
                      "border-muted-foreground/30 bg-background text-muted-foreground/50"
                  )}
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  {isCompleted ? (
                    <motion.div
                      animate={{ scale: 1, rotate: 0 }}
                      initial={{ scale: 0, rotate: -90 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <Check className="size-5" strokeWidth={3} />
                    </motion.div>
                  ) : (
                    <Icon className="size-5" />
                  )}

                  {/* Active ring pulse */}
                  {isCurrent && (
                    <motion.div
                      animate={{ opacity: [0.5, 0], scale: [1, 1.6] }}
                      className="absolute inset-0 rounded-full border-2 border-primary"
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeOut",
                      }}
                    />
                  )}
                </motion.div>

                {/* Label */}
                <div className="space-y-0.5">
                  <p
                    className={cn(
                      "font-semibold text-sm transition-colors duration-300",
                      isCompleted || isCurrent
                        ? "text-foreground"
                        : "text-muted-foreground/60"
                    )}
                  >
                    {item.title}
                  </p>
                  <p
                    className={cn(
                      "hidden text-xs transition-colors duration-300 sm:block",
                      isCompleted || isCurrent
                        ? "text-muted-foreground"
                        : "text-muted-foreground/40"
                    )}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Animated progress overlay on the track */}
        <div className="absolute top-6 right-12 left-12 hidden h-px sm:block">
          <motion.div
            animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            className="h-full bg-primary"
            initial={false}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Form content */}
      <div className="rounded-xl border bg-card p-6 shadow-sm md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            initial={{ opacity: 0, y: 12 }}
            key={step}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
