"use client"

import { useState } from "react"
import { HomePageExplore } from "@/data/homepage-explore"
import { BookOpen } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import HighlightText from "./highlighted-text"

const tabsName = ["Free Courses", "Trending Now", "Career Growth"]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
}

export default function ExploreMore() {
  const [currentTab, setCurrentTab] = useState(tabsName[1])
  const [courses, setCourses] = useState(HomePageExplore[0].courses)

  const setMyCards = (value: string) => {
    setCurrentTab(value)
    const result = HomePageExplore.filter((course) => course.tag === value)
    setCourses(result[0].courses)
  }

  return (
    <section className="py-20 container mx-auto px-4 flex flex-col justify-between items-center">
      <p className="mb-2 font-medium tracking-wider text-neutral-500 text-sm uppercase">
        Explore Our Learning Paths
      </p>

      <h2 className="mb-8 font-semibold text-4xl text-neutral-800 tracking-tighter dark:text-neutral-300">
        Discover and Unlock Your <HighlightText text="Potential" />
      </h2>

      <div className="relative mb-12 flex justify-center">
        <div className="inline-flex rounded-full p-1 bg-muted">
          {tabsName.map((tab) => (
            <button
              key={tab}
              onClick={() => setMyCards(tab)}
              className={`relative rounded-full px-3 py-1.5 text-sm font-medium transition focus-visible:outline-2 ${
                currentTab === tab
                  ? "text-background"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {currentTab === tab && (
                <motion.span
                  layoutId="bubble"
                  className="absolute inset-0 z-10 bg-primary rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-20">{tab}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentTab}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {courses.map((course, index) => (
            <motion.div key={index} variants={cardVariants}>
              <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle>{course.heading}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">{course.level}</Badge>
                    <div className="flex items-center text-muted- text-blue-400">
                      <BookOpen className="w-4 h-4 mr-2" />
                      <span className="text-sm ">
                        {course.lessionNumber} lessons
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
