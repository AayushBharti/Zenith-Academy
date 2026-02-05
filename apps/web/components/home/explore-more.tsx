"use client";

import { BarChart, BookOpen, Layers } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HomePageExplore } from "@/data/homepage-explore";
import { cn } from "@/lib/utils";
import HighlightText from "./highlighted-text";

const tabsName = ["Free Courses", "Trending Now", "Career Growth"];

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
  exit: { opacity: 0 },
};

const cardVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function ExploreMore() {
  const [currentTab, setCurrentTab] = useState(tabsName[0]);
  const [courses, setCourses] = useState(HomePageExplore[0]?.courses);

  const setMyCards = (value: string) => {
    setCurrentTab(value);
    const result = HomePageExplore.filter((course) => course.tag === value);
    setCourses(result[0]?.courses);
  };

  return (
    <section className="w-full bg-background py-20">
      <div className="container mx-auto flex flex-col items-center px-4">
        {/* Header Section */}
        <div className="mb-10 max-w-2xl space-y-4 text-center">
          <h2 className="font-bold text-3xl text-foreground tracking-tight md:text-4xl">
            Unlock Your <HighlightText text="Potential" />
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Curated learning paths designed to help you master new skills and
            advance your career.
          </p>
        </div>

        {/* Professional Segmented Tabs */}
        <div className="mb-12 inline-flex items-center justify-center rounded-full bg-muted p-1.5">
          {tabsName.map((tab) => {
            const isActive = currentTab === tab;
            return (
              <button
                className={cn(
                  "relative rounded-full px-6 py-2 font-medium text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isActive
                    ? "text-foreground" // Active text color (Dark in light mode)
                    : "text-muted-foreground hover:text-foreground" // Inactive text color
                )}
                key={tab}
                onClick={() => setMyCards(tab)}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-background shadow-sm"
                    layoutId="activeTab"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            );
          })}
        </div>

        {/* Cards Grid */}
        <div className="relative z-10 w-full max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div
              animate="visible"
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              exit="exit"
              initial="hidden"
              key={currentTab}
              variants={containerVariants}
            >
              {courses?.map((course, index) => (
                <motion.div key={index} variants={cardVariants as Variants}>
                  <Card className="flex h-full flex-col border border-border bg-background shadow-none transition-colors duration-300 hover:border-primary/40">
                    <CardHeader className="pb-3">
                      <div className="mb-3 flex items-center justify-between">
                        <Badge
                          className="bg-secondary/50 font-medium text-secondary-foreground hover:bg-secondary/60"
                          variant="secondary"
                        >
                          {course.level}
                        </Badge>
                        <div className="flex items-center gap-1.5 font-medium text-muted-foreground text-xs">
                          <Layers className="h-3.5 w-3.5" />
                          <span>Path</span>
                        </div>
                      </div>
                      <CardTitle className="font-bold text-foreground text-xl">
                        {course.heading}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-grow flex-col justify-between gap-6">
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {course.description}
                      </p>

                      {/* Meta Data Divider */}
                      <div className="mt-auto border-border border-t pt-4">
                        <div className="flex items-center gap-6 text-muted-foreground text-sm">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-primary" />
                            <span>{course.lessionNumber} Lessons</span>
                          </div>
                          {/* Optional: Add duration or other meta data here */}
                          <div className="flex items-center gap-2">
                            <BarChart className="h-4 w-4 text-primary" />
                            <span>Curated</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
