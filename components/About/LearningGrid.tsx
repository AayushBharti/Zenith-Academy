"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  BarChart,
  Book,
  Briefcase,
  ChevronRight,
  Users,
  Zap,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const learningFeatures = [
  {
    icon: Book,
    title: "Industry-Driven Curriculum",
    description:
      "Our curriculum is meticulously crafted to align with current industry demands, ensuring you learn skills that are immediately applicable in the workplace.",
    stats: { courses: 500, hours: 10000 },
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    icon: Users,
    title: "Collaborative Learning",
    description:
      "Engage in group projects, peer reviews, and discussion forums to enhance your learning experience through collaboration with peers worldwide.",
    stats: { students: 100000, countries: 190 },
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
  },
  {
    icon: Book,
    title: "Accredited Certifications",
    description:
      "Earn industry-recognized certifications upon course completion, boosting your credentials and enhancing your professional profile.",
    stats: { certifications: 50, partners: 275 },
    image:
      "https://images.unsplash.com/photo-1589330273594-fade1ee91647?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    icon: BarChart,
    title: "AI-Powered Analytics",
    description:
      "Benefit from our advanced AI-driven analytics that provide personalized learning paths and real-time performance insights to optimize your learning journey.",
    stats: { dataPoints: "1M+", accuracy: "99.9%" },
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    icon: Briefcase,
    title: "Career Services",
    description:
      "Access our comprehensive career services, including resume reviews, mock interviews, and job placement assistance to jumpstart your career.",
    stats: { jobPlacements: 50000, avgSalaryIncrease: "35%" },
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
  },
  {
    icon: Zap,
    title: "Adaptive Learning",
    description:
      "Experience a personalized learning journey with our adaptive learning technology that adjusts to your pace, style, and performance in real-time.",
    stats: { adaptivePaths: 1000, efficiencyGain: "40%" },
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1422&q=80",
  },
]

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof learningFeatures)[0]
  index: number
}) {
  const [isHovered, setIsHovered] = useState(false)
  const Icon = feature.icon

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="h-full overflow-hidden">
        <CardHeader className="relative z-10">
          <div className="flex items-center space-x-2 mb-2">
            <Icon className="w-6 h-6 text-primary" />
            <Badge variant="outline">
              {Object.keys(feature.stats)[0]}: {Object.values(feature.stats)[0]}
            </Badge>
          </div>
          <CardTitle>{feature.title}</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <CardDescription className="mb-4">
            {feature.description}
          </CardDescription>
          <Button variant="outline" size="sm">
            Learn More <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-cover bg-center z-0"
              style={{ backgroundImage: `url(${feature.image})` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}

export default function LearningGrid() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Discover the ZenithMinds{" "}
            <span className="text-primary">Advantage</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock your potential with our cutting-edge learning platform,
            designed to propel your career to new heights.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {learningFeatures.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Button size="lg" className="animate-pulse">
            Start Your Learning Journey
          </Button>
        </div>
      </div>
    </section>
  )
}
