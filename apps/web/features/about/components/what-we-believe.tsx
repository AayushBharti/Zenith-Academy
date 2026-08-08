"use client";

import { Globe, Target, Users } from "lucide-react";
import { motion } from "motion/react";

import HighlightText from "../../home/components/highlighted-text";
import { SectionHeader } from "../../shared/components/section-header";

const principles = [
  {
    icon: Users,
    title: "Community Over Content",
    description:
      "Videos don't teach — people do. Every course includes peer cohorts, code reviews, and live instructor access.",
  },
  {
    icon: Target,
    title: "Outcomes Over Certificates",
    description:
      "We measure success by career moves, not completion rates. Our learners get hired, promoted, and build real products.",
  },
  {
    icon: Globe,
    title: "Access Over Exclusivity",
    description:
      "World-class engineering education shouldn't require a world-class budget. Quality paths start free, always.",
  },
];

export function WhatWeBelieve() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-4">
        <SectionHeader
          badge="Our Principles"
          title={
            <>
              What <HighlightText text="Drives Us" />
            </>
          }
        />

        <div className="grid gap-8 md:grid-cols-3">
          {principles.map((principle, index) => (
            <motion.div
              key={principle.title}
              className="rounded-xl border border-border bg-background p-8 text-center transition-colors hover:border-primary/40"
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-primary/10">
                <principle.icon className="size-7 text-primary" />
              </div>
              <h3 className="mb-3 font-semibold text-xl">{principle.title}</h3>
              <p className="leading-relaxed text-muted-foreground">
                {principle.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
