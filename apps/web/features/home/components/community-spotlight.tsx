"use client";

import { GitPullRequest, MessageCircle, Users } from "lucide-react";
import { motion } from "motion/react";

import { SectionHeader } from "../../shared/components/section-header";
import HighlightText from "./highlighted-text";

const features = [
  {
    icon: GitPullRequest,
    title: "Peer Code Reviews",
    description:
      "Every project gets reviewed by 2+ peers. Give feedback, receive feedback, sharpen your eye for quality code.",
  },
  {
    icon: Users,
    title: "Cohort-Based Learning",
    description:
      "Join a group of 20-30 learners on the same path. Shared deadlines, group discussions, real accountability.",
  },
  {
    icon: MessageCircle,
    title: "Instructor Office Hours",
    description:
      "Weekly live sessions with course instructors. Ask questions, debug together, go deeper than any recording allows.",
  },
] as const;

export function CommunitySpotlight() {
  return (
    <section className="relative overflow-hidden bg-muted/30 py-24">
      {/* Centered blur glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container relative mx-auto max-w-6xl px-4">
        <SectionHeader
          badge="Built Around Community"
          description="Nextdemy isn't a library of videos. It's a network of engineers who learn, build, and grow together."
          title={
            <>
              Learning Is a <HighlightText text="Team Sport" />
            </>
          }
        />

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              className="rounded-xl border border-border bg-background p-8 text-center transition-colors hover:border-primary/40"
              initial={{ opacity: 0, y: 30 }}
              key={feature.title}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-primary/10">
                <feature.icon className="size-7 text-primary" />
              </div>
              <h3 className="mb-3 font-semibold text-xl">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
