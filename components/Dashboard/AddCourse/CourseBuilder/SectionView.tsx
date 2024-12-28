import React from "react"
import { Pencil, Trash2 } from "lucide-react"

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

import { SubSectionView } from "./SubSectionView"

interface SectionViewProps {
  section: any
  onEdit: () => void
  onDelete: () => void
  onAddSubSection: () => void
  onEditSubSection: (subSection: any) => void
  onDeleteSubSection: (subSectionId: string) => void
  onViewSubSection: (subSection: any) => void
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
  return (
    <AccordionItem value={section._id}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center justify-between w-full">
          <span className="font-semibold">{section.sectionName}</span>
          <div className="flex items-center gap-x-2 mr-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
            >
              <Pencil className="size-4 text-primary" />
              <span className="sr-only">Edit section</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
            >
              <Trash2 className="size-4 text-primary" />
              <span className="sr-only">Delete section</span>
            </Button>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2">
          {section.subSection.map((subSection: any) => (
            <SubSectionView
              key={subSection._id}
              subSection={subSection}
              onView={() => onViewSubSection(subSection)}
              onEdit={() => onEditSubSection(subSection)}
              onDelete={() => onDeleteSubSection(subSection._id)}
            />
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 text-primary bg-primary-foreground"
            onClick={onAddSubSection}
          >
            Add Lecture
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
