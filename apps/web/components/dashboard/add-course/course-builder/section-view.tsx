"use client";

import {
  ChevronRight,
  Folder,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SubSectionView } from "./sub-section-view";

interface SectionViewProps {
  section: any;
  onEdit: () => void;
  onDelete: () => void;
  onAddSubSection: () => void;
  onEditSubSection: (subSection: any) => void;
  onDeleteSubSection: (subSectionId: string) => void;
  onViewSubSection: (subSection: any) => void;
}

export const SectionView: React.FC<SectionViewProps> = ({
  section,
  onEdit,
  onDelete,
  onAddSubSection,
  onEditSubSection,
  onDeleteSubSection,
  onViewSubSection,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:shadow-xs">
      {/* --- Header Section --- */}
      <div
        className="group flex cursor-pointer select-none items-center justify-between border-border/50 border-b bg-secondary/10 p-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {/* Rotating Chevron */}
          <div
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-90" : ""
            }`}
          >
            <ChevronRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
          </div>

          {/* Icon & Title */}
          <div className="flex items-center gap-2">
            <Folder className="h-5 w-5 text-primary/80" />
            <span className="font-semibold text-base text-foreground">
              {section.sectionName}
            </span>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          <Badge
            className="font-normal text-muted-foreground text-xs"
            variant="secondary"
          >
            {section.subSection?.length || 0} Lectures
          </Badge>

          {/* Action Menu (Stop Propagation prevents toggling the section) */}
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="h-8 w-8" size="icon" variant="ghost">
                  <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit Section Name
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={onDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Section
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* --- Expandable Body --- */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="space-y-3 p-4">
              {/* List of Subsections */}
              <div className="ml-3 space-y-2 border-border/50 border-l-2 pl-4">
                {section.subSection && section.subSection.length > 0 ? (
                  section.subSection.map((subSection: any) => (
                    <SubSectionView
                      key={subSection._id}
                      onDelete={() => onDeleteSubSection(subSection._id)}
                      onEdit={() => onEditSubSection(subSection)}
                      onView={() => onViewSubSection(subSection)}
                      subSection={subSection}
                    />
                  ))
                ) : (
                  <div className="py-2 pl-2 text-muted-foreground text-sm italic">
                    No lectures in this section yet.
                  </div>
                )}
              </div>

              {/* Add Lecture Button */}
              <Button
                className="w-full gap-2 border-primary/20 border-dashed text-primary hover:border-primary hover:bg-primary/5"
                onClick={onAddSubSection}
                variant="outline"
              >
                <Plus className="h-4 w-4" /> Add Lecture
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
