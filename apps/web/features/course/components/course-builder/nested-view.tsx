"use client";

import type {
  SectionResponse,
  SubSectionResponse,
} from "@workspace/shared-types";
import type React from "react";
import { useState } from "react";
import {
  useDeleteSection,
  useDeleteSubSection,
} from "@/features/course/hooks/use-course-mutations";
import { useCourseStore } from "@/features/course/use-course-store";

import ConfirmationModal from "./confirmation-modal";
import { SectionView } from "./section-view";
import SubSectionModal from "./subsection-modal";

interface ConfirmationModalData {
  text1: string;
  text2: string;
  btn1Text: string;
  btn2Text: string;
  btn1Handler: () => void;
  btn2Handler: () => void;
}

interface NestedViewProps {
  handleChangeEditSectionName: (sectionId: string, sectionName: string) => void;
}

const NestedView: React.FC<NestedViewProps> = ({
  handleChangeEditSectionName,
}) => {
  const { course, setCourse } = useCourseStore();
  const deleteSectionMutation = useDeleteSection();
  const deleteSubSectionMutation = useDeleteSubSection();

  // --- Modal State Management ---
  const [modalData, setModalData] = useState<{
    type: "add" | "edit" | "view" | null;
    data: string | SubSectionResponse | null;
  }>({ type: null, data: null });

  const [confirmationModal, setConfirmationModal] =
    useState<ConfirmationModalData | null>(null);

  // --- Logic Handlers ---

  const handleDeleteSection = (sectionId: string) => {
    if (!course) return;
    deleteSectionMutation.mutate(
      { sectionId, courseId: course._id },
      {
        onSuccess: (result) => {
          setCourse(result);
          setConfirmationModal(null);
        },
      }
    );
  };

  const handleDeleteSubSection = (subSectionId: string, sectionId: string) => {
    if (!course) return;
    deleteSubSectionMutation.mutate(
      {
        subSectionId,
        courseId: course._id,
        sectionId,
      },
      {
        onSuccess: (result) => {
          setCourse(result);
          setConfirmationModal(null);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* --- Render List of Sections --- */}
      {course?.courseContent?.map((section: SectionResponse) => (
        <SectionView
          key={section._id}
          onAddSubSection={() =>
            setModalData({ type: "add", data: section._id })
          }
          // 1. Section Actions
          onDelete={() =>
            setConfirmationModal({
              text1: "Delete this Section?",
              text2:
                "All lectures in this section will be permanently deleted.",
              btn1Text: "Delete",
              btn2Text: "Cancel",
              btn1Handler: () => handleDeleteSection(section._id),
              btn2Handler: () => setConfirmationModal(null),
            })
          }
          onDeleteSubSection={(subSectionId) =>
            setConfirmationModal({
              text1: "Delete this Lecture?",
              text2: "This lecture will be permanently removed.",
              btn1Text: "Delete",
              btn2Text: "Cancel",
              btn1Handler: () =>
                handleDeleteSubSection(subSectionId, section._id),
              btn2Handler: () => setConfirmationModal(null),
            })
          }
          // 2. SubSection Actions
          onEdit={() =>
            handleChangeEditSectionName(section._id, section.sectionName)
          }
          onEditSubSection={(subSection) =>
            setModalData({ type: "edit", data: subSection })
          }
          onViewSubSection={(subSection) =>
            setModalData({ type: "view", data: subSection })
          }
          section={section}
        />
      ))}

      {/* --- Modals (Rendered Conditionally) --- */}
      {modalData.type && (
        <SubSectionModal
          add={modalData.type === "add"}
          edit={modalData.type === "edit"}
          modalData={modalData.data}
          setModalData={() => setModalData({ type: null, data: null })}
          view={modalData.type === "view"}
        />
      )}

      {confirmationModal && (
        <ConfirmationModal
          isOpen={!!confirmationModal}
          onClose={() => setConfirmationModal(null)}
          {...confirmationModal}
        />
      )}
    </div>
  );
};

export default NestedView;
