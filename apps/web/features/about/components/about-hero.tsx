"use client";

import { Badge } from "@workspace/ui/components/badge";
import { motion } from "motion/react";
import HighlightText from "../../home/components/highlighted-text";

export function AboutHero() {
  return (
    <section className="bg-muted/30 py-24 md:py-32">
      <motion.div
        className="mx-auto flex max-w-3xl flex-col items-center space-y-6 px-4 text-center"
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <Badge
          className="border-primary/30 bg-primary/10 px-4 py-1.5 font-medium text-primary text-sm"
          variant="outline"
        >
          About Nextdemy
        </Badge>

        <h1 className="font-bold text-4xl tracking-tight md:text-5xl lg:text-6xl">
          Built for Engineers Who Learn Better{" "}
          <HighlightText text="Together" />
        </h1>

        <p className="text-lg text-muted-foreground md:text-xl">
          Nextdemy is a community-driven learning platform where developers join
          cohorts, build real projects, review each other&apos;s code, and earn
          credentials that matter.
        </p>
      </motion.div>
    </section>
  );
}
