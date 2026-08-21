"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center space-y-6 rounded-2xl border-2 border-muted border-dashed bg-secondary/10 py-16 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-2 flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
        <Icon className="h-12 w-12 text-muted-foreground" />
      </div>

      <div className="mx-auto max-w-md space-y-2 px-4">
        <h2 className="font-bold text-2xl tracking-tight">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
}
