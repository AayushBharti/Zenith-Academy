"use client";

import type React from "react";
import { useState } from "react";
import {
  deleteSection,
  deleteSubSection,
} from "@/services/course-details-service";
import { useAuthStore } from "@/store/use-auth-store";
import { useCourseStore } from "@/store/use-course-store";

import ConfirmationModal from "./confirmation-modal";
import { SectionView } from "./section-view";
import SubSectionModal from "./subsection-modal";

interface NestedViewProps {
  handleChangeEditSectionName: (sectionId: string, sectionName: string) => void;
}

const NestedView: React.FC<NestedViewProps> = ({
  handleChangeEditSectionName,
}) => {
  const { token } = useAuthStore();
  const { course, setCourse } = useCourseStore();

  // --- Modal State Management ---
  const [modalData, setModalData] = useState<{
    type: "add" | "edit" | "view" | null;
    data: any;
  }>({ type: null, data: null });

  const [confirmationModal, setConfirmationModal] = useState<any>(null);

  // --- Logic Handlers ---

  const handleDeleteSection = async (sectionId: string) => {
    const result = await deleteSection(
      { sectionId, courseId: course._id },
      token as string
    );
    if (result) {
      setCourse(result);
      setConfirmationModal(null);
    }
  };

  const handleDeleteSubSection = async (
    subSectionId: string,
    sectionId: string
  ) => {
    const result = await deleteSubSection(
      { subSectionId, courseId: course._id, sectionId },
      token as string
    );
    if (result) {
      setCourse(result);
      setConfirmationModal(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* --- Render List of Sections --- */}
      {course?.courseContent?.map((section: any) => (
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
