"use client";

import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { cn } from "@/lib/utils";
import useCourseStore from "@/store/use-course-store";

import CourseBuilderForm from "./course-builder/course-builder";
import CourseInformationForm from "./course-information/course-informationForm";
import PublishCourseForm from "./publish-course";

const steps = [
  { id: 1, title: "Course Information" },
  { id: 2, title: "Course Builder" },
  { id: 3, title: "Publish Course" },
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
    <div className="mx-auto w-full max-w-5xl space-y-8">
      {/* --- Stepper Wrapper --- */}
      <div className="flex w-full flex-col">
        {/* Row 1: The Visual Track (Circles + Connectors) */}
        <div className="flex w-full items-center justify-between">
          {steps.map((item, index) => {
            const isCompleted = step > item.id;
            const isCurrent = step === item.id;
            const isLastStep = index === steps.length - 1;

            return (
              <React.Fragment key={item.id}>
                {/* The Step Circle */}
                <div className="relative z-10">
                  <motion.div
                    animate={{
                      backgroundColor:
                        isCompleted || isCurrent
                          ? "var(--primary)"
                          : "var(--background)",
                      borderColor:
                        isCompleted || isCurrent
                          ? "var(--primary)"
                          : "var(--muted-foreground)",
                      color:
                        isCompleted || isCurrent
                          ? "var(--primary-foreground)"
                          : "var(--muted-foreground)",
                      scale: isCurrent ? 1.1 : 1,
                    }}
                    className={cn(
                      "grid h-10 w-10 place-items-center rounded-full border-2 font-semibold text-sm shadow-xs",
                      // Fallback classes if JS/Animation fails
                      !(isCompleted || isCurrent) && "bg-secondary"
                    )}
                    initial={false}
                    transition={{ duration: 0.3 }}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span>{item.id}</span>
                    )}
                  </motion.div>
                </div>

                {/* The Connector Line (Rendered between steps only) */}
                {!isLastStep && (
                  <div className="relative mx-4 h-[2px] flex-1 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      animate={{
                        x: step > item.id ? "0%" : "-100%",
                      }}
                      className="absolute inset-0 bg-primary"
                      initial={{ x: "-100%" }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Row 2: The Labels (Grid to align perfectly with circles above) */}
        <div className="mt-4 grid grid-cols-3 text-center">
          {steps.map((item) => {
            // Determine alignment based on index to ensure text doesn't hang off edges
            const alignClass =
              item.id === 1
                ? "text-left pl-2"
                : item.id === steps.length
                  ? "text-right pr-2"
                  : "text-center";

            return (
              <div className={cn("flex flex-col", alignClass)} key={item.id}>
                <span
                  className={cn(
                    "font-medium text-sm transition-colors duration-300",
                    step >= item.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- Form Content Area with Animation --- */}
      <div className="">
        <AnimatePresence mode="wait">
          <motion.div
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -20, y: 10 }}
            initial={{ opacity: 0, x: 20, y: 10 }}
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
