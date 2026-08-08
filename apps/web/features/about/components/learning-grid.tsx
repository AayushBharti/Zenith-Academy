"use client";

import { Award, Calendar, GitPullRequest, Video } from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import HighlightText from "../../home/components/highlighted-text";
import { SectionHeader } from "../../shared/components/section-header";

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: GitPullRequest,
    title: "Peer Code Reviews",
    description:
      "Every project gets reviewed by 2+ peers before you move on. Real feedback from real developers.",
  },
  {
    icon: Calendar,
    title: "Cohort Deadlines",
    description:
      'No "watch later" graveyard. Fixed timelines with your group keep you accountable and on track.',
  },
  {
    icon: Video,
    title: "Live Office Hours",
    description:
      "Weekly sessions with instructors. Not pre-recorded Q&A — live debugging, live answers, live learning.",
  },
  {
    icon: Award,
    title: "Verified Credentials",
    description:
      "Credentials backed by project work and peer validation — not just a quiz score.",
  },
];

export default function LearningGrid() {
  return (
    <section className="py-24">
      <div className="container mx-auto max-w-5xl">
        <SectionHeader
          badge="The Nextdemy Difference"
          description="Most platforms sell videos. We build learning communities."
          title={
            <>
              Not Another <HighlightText text="Course Library" />
            </>
          }
        />

        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <motion.div
              className="flex gap-5 rounded-xl border border-border bg-background p-6 transition-colors hover:border-primary/40"
              initial={{ opacity: 0, y: 20 }}
              key={feature.title}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-lg">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
