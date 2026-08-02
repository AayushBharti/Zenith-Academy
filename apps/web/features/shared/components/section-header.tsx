"use client";

import { Badge } from "@workspace/ui/components/badge";
import { motion } from "motion/react";
import type React from "react";

interface SectionHeaderProps {
  badge?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  badge,
  title,
  description,
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      className="mx-auto mb-12 flex max-w-3xl flex-col items-center space-y-4 text-center"
      initial={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {badge && (
        <Badge
          className="border-primary/30 bg-primary/10 px-4 py-1.5 font-medium text-primary text-sm"
          variant="outline"
        >
          {badge}
        </Badge>
      )}
      <h2 className="font-bold text-3xl tracking-tight md:text-4xl">{title}</h2>
      {description && (
        <p className="text-lg text-muted-foreground">{description}</p>
      )}
    </motion.div>
  );
}
