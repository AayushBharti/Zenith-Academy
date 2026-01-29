"use client";

import { Eye, Pencil, Trash2, Video } from "lucide-react";
import type React from "react";

import { Button } from "@/components/ui/button";

interface SubSectionViewProps {
  subSection: any;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const SubSectionView: React.FC<SubSectionViewProps> = ({
  subSection,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="group flex items-center justify-between rounded-lg border border-transparent p-3 transition-all duration-200 hover:border-border/50 hover:bg-secondary/40">
      {/* Left: Icon & Title */}
      <div
        className="flex flex-1 cursor-pointer items-center gap-3"
        onClick={onView}
      >
        <Video className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
        <span className="font-medium text-foreground/80 text-sm group-hover:text-foreground">
          {subSection.title}
        </span>
      </div>

      {/* Right: Actions (Visible on Hover) */}
      <div
        className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        onClick={(e) => e.stopPropagation()} // Prevent triggering view when clicking buttons
      >
        <Button
          className="h-7 w-7 text-muted-foreground hover:text-primary"
          onClick={onView}
          size="icon"
          title="View Lecture"
          variant="ghost"
        >
          <Eye className="h-3.5 w-3.5" />
          <span className="sr-only">View</span>
        </Button>

        <Button
          className="h-7 w-7 text-muted-foreground hover:text-primary"
          onClick={onEdit}
          size="icon"
          title="Edit Details"
          variant="ghost"
        >
          <Pencil className="h-3.5 w-3.5" />
          <span className="sr-only">Edit</span>
        </Button>

        <Button
          className="h-7 w-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={onDelete}
          size="icon"
          title="Delete Lecture"
          variant="ghost"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </div>
  );
};
