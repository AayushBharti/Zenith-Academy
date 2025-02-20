import React from "react"
import { EyeIcon, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"

interface SubSectionViewProps {
  subSection: any
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

export const SubSectionView: React.FC<SubSectionViewProps> = ({
  subSection,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex items-center justify-between p-2 px-4 rounded-md bg-blue-600/10 hover:bg-blue-600/20">
      <span className="text-sm">{subSection.title}</span>
      <div className="flex items-center gap-x-2">
        <Button variant="ghost" size="sm" onClick={onView}>
          <EyeIcon className="size-4 text-blue-600" />
          <span className="sr-only">View subsection</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Pencil className="size-4 text-blue-600" />
          <span className="sr-only">Edit subsection</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="size-4 text-blue-600" />
          <span className="sr-only">Delete subsection</span>
        </Button>
      </div>
    </div>
  )
}
