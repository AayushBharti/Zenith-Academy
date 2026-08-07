"use client";

import { Separator } from "@workspace/ui/components/separator";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const STATS: Stat[] = [
  { value: 10_000, suffix: "+", label: "Active Learners" },
  { value: 250, suffix: "+", label: "Expert Instructors" },
  { value: 500, suffix: "+", label: "Hands-On Courses" },
  { value: 50, suffix: "+", label: "Countries" },
];

const ANIMATION_DURATION_MS = 1500;
const FRAME_INTERVAL_MS = 16;

/** Formats a number with locale-aware comma separators. */
function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

/** Animates a number from 0 to `target` over a fixed duration while `active` is true. */
function useCountUp(target: number, active: boolean): number {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!active) return;

    const totalFrames = Math.ceil(ANIMATION_DURATION_MS / FRAME_INTERVAL_MS);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const eased = 1 - (1 - progress) ** 3; // ease-out cubic
      setCurrent(Math.round(eased * target));

      if (frame >= totalFrames) {
        clearInterval(timer);
        setCurrent(target);
      }
    }, FRAME_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [target, active]);

  return current;
}

function StatItem({ stat, active }: { stat: Stat; active: boolean }) {
  const count = useCountUp(stat.value, active);

  return (
    <div className="flex flex-col items-center gap-1 px-6 py-2">
      <span className="font-bold text-3xl tabular-nums tracking-tight md:text-4xl">
        {formatNumber(count)}
        {stat.suffix}
      </span>
      <span className="text-muted-foreground text-sm">{stat.label}</span>
    </div>
  );
}

/** A horizontal bar displaying animated count-up statistics. */
export function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.section
      className="border-b bg-muted/30 py-10"
      initial={{ opacity: 0 }}
      ref={ref}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1 }}
    >
      <div className="container mx-auto flex flex-wrap items-center justify-center gap-6 md:justify-between md:gap-0">
        {STATS.map((stat, index) => (
          <div className="flex items-center" key={stat.label}>
            {index > 0 && (
              <Separator
                className="mr-6 hidden h-12 md:block"
                orientation="vertical"
              />
            )}
            <StatItem active={isInView} stat={stat} />
          </div>
        ))}
      </div>
    </motion.section>
  );
}
