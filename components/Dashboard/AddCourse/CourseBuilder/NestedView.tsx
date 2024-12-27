import React, { useState } from "react"
import {
  deleteSection,
  deleteSubSection,
} from "@/services/courseDetailsService"
import { useAuthStore } from "@/store/useAuthStore"
import { useCourseStore } from "@/store/useCourseStore"

import { Accordion } from "@/components/ui/accordion"

import ConfirmationModal from "./ConfirmationModal"
import { SectionView } from "./SectionView"
import SubSectionModal from "./SubsectionModal"

interface NestedViewProps {
  handleChangeEditSectionName: (sectionId: string, sectionName: string) => void
}

const NestedView: React.FC<NestedViewProps> = ({
  handleChangeEditSectionName,
}) => {
  const { token } = useAuthStore()
  const { course, setCourse } = useCourseStore()

  const [modalState, setModalState] = useState<{
    type: "add" | "edit" | "view" | null
    data: any
  }>({ type: null, data: null })
  const [confirmationModal, setConfirmationModal] = useState<{
    isModalOpen: boolean
    text1: string
    text2: string
    btn1Text: string
    btn2Text: string
    btn1Handler: () => void
    btn2Handler: () => void
  } | null>(null)

  const handleDeleteSection = async (sectionId: string) => {
    const result = await deleteSection(
      { sectionId, courseId: course._id },
      token as string
    )
    if (result) {
      setCourse(result)
      setConfirmationModal(null)
    }
  }

  const handleDeleteSubSection = async (
    subSectionId: string,
    sectionId: string
  ) => {
    const result = await deleteSubSection(
      { subSectionId, courseId: course._id, sectionId },
      token as string
    )
    if (result) {
      setCourse(result)
      setConfirmationModal(null)
    }
  }

  const showConfirmationModal = (
    text1: string,
    text2: string,
    btn1Text: string,
    btn2Text: string,
    btn1Handler: () => void,
    btn2Handler: () => void
  ) => {
    setConfirmationModal({
      isModalOpen: true,
      text1,
      text2,
      btn1Text,
      btn2Text,
      btn1Handler,
      btn2Handler,
    })
  }

  const closeConfirmationModal = () => {
    setConfirmationModal(null)
  }

  return (
    <div className="space-y-4">
      <Accordion type="multiple" className="w-full">
        {course.courseContent.map((section: any) => (
          <SectionView
            key={section._id}
            section={section}
            onEdit={() =>
              handleChangeEditSectionName(section._id, section.sectionName)
            }
            onDelete={() =>
              showConfirmationModal(
                "Delete this Section?",
                "All the lectures in this section will be deleted",
                "Delete",
                "Cancel",
                () => handleDeleteSection(section._id),
                closeConfirmationModal
              )
            }
            onAddSubSection={() =>
              setModalState({ type: "add", data: section._id })
            }
            onEditSubSection={(subSection) =>
              setModalState({ type: "edit", data: subSection })
            }
            onDeleteSubSection={(subSectionId) =>
              showConfirmationModal(
                "Delete this Sub-Section?",
                "Selected lecture will be deleted",
                "Delete",
                "Cancel",
                () => handleDeleteSubSection(subSectionId, section._id),
                closeConfirmationModal
              )
            }
            onViewSubSection={(subSection) =>
              setModalState({ type: "view", data: subSection })
            }
          />
        ))}
      </Accordion>
      {modalState.type && (
        <SubSectionModal
          modalData={modalState.data}
          setModalData={() => setModalState({ type: null, data: null })}
          add={modalState.type === "add"}
          edit={modalState.type === "edit"}
          view={modalState.type === "view"}
        />
      )}
      {confirmationModal && (
        <ConfirmationModal
          isOpen={confirmationModal.isModalOpen}
          onClose={closeConfirmationModal}
          {...confirmationModal}
        />
      )}
    </div>
  )
}

export default NestedView

// import React, { useState } from "react"
// import {
//   deleteSection,
//   deleteSubSection,
// } from "@/services/courseDetailsService"
// import { useAuthStore } from "@/store/useAuthStore"
// import { useCourseStore } from "@/store/useCourseStore"
// import {
//   ChevronDown,
//   ChevronRight,
//   Menu,
//   Pencil,
//   Plus,
//   Trash2,
// } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"

// import ConfirmationModal from "./ConfirmationModal"
// import SubSectionModal from "./SubsectionModal"

// interface NestedViewProps {
//   handleChangeEditSectionName: (sectionId: string, sectionName: string) => void
// }

// const NestedView: React.FC<NestedViewProps> = ({
//   handleChangeEditSectionName,
// }) => {
//   const { token } = useAuthStore()
//   const { course, setCourse } = useCourseStore()

//   const [viewSubSection, setViewSubSection] = useState(null)
//   const [addSubSection, setAddSubSection] = useState<string | null>(null)
//   const [editSubsection, setEditSubsection] = useState(null)
//   const [confirmationModal, setConfirmationModal] = useState<null | {
//     text1: string
//     text2: string
//     btn1Text: string
//     btn2Text: string
//     btn1Handler: () => void
//     btn2Handler: () => void
//   }>(null)
//   const [expandedSections, setExpandedSections] = useState<string[]>([])

//   // Delete Section
//   const handleDeleteSection = async (sectionId: string) => {
//     const result = await deleteSection(
//       { sectionId, courseId: course._id },
//       token as string
//     )
//     if (result) {
//       setCourse(result)
//       setConfirmationModal(null)
//     }
//   }

//   // Delete Sub-Section
//   const handleDeleteSubSection = async (
//     subSectionId: string,
//     sectionId: string
//   ) => {
//     const result = await deleteSubSection(
//       { subSectionId, courseId: course._id, sectionId },
//       token as string
//     )
//     if (result) {
//       setCourse(result)
//       setConfirmationModal(null)
//     }
//   }

//   // Handle Confirmation Modal
//   const handleShowConfirmation = (
//     text1: string,
//     text2: string,
//     btn1Text: string,
//     btn2Text: string,
//     btn1Handler: () => void,
//     btn2Handler: () => void
//   ) => {
//     setConfirmationModal({
//       text1,
//       text2,
//       btn1Text,
//       btn2Text,
//       btn1Handler,
//       btn2Handler,
//     })
//   }

//   // Toggle Section Expansion
//   const toggleSection = (sectionId: string) => {
//     setExpandedSections((prev) =>
//       prev.includes(sectionId)
//         ? prev.filter((id) => id !== sectionId)
//         : [...prev, sectionId]
//     )
//   }

//   return (
//     <div className="space-y-4">
//       {course.courseContent.map((section: any) => (
//         <Card key={section._id}>
//           <CardContent className="p-0">
//             <div className="flex items-center justify-between p-4">
//               <div className="flex items-center gap-x-3">
//                 <Menu className="h-5 w-5 text-muted-foreground" />
//                 <span className="font-semibold">{section.sectionName}</span>
//               </div>
//               <div className="flex items-center gap-x-2">
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() =>
//                     handleChangeEditSectionName(
//                       section._id,
//                       section.sectionName
//                     )
//                   }
//                 >
//                   <Pencil className="h-4 w-4" />
//                   <span className="sr-only">Edit section</span>
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => {
//                     setConfirmationModal({
//                       text1: "Delete this Section?",
//                       text2: "All the lectures in this section will be deleted",
//                       btn1Text: "Delete",
//                       btn2Text: "Cancel",
//                       btn1Handler: () => handleDeleteSection(section._id),
//                       btn2Handler: () => setConfirmationModal(null),
//                     })
//                   }}
//                 >
//                   <Trash2 className="h-4 w-4" />
//                   <span className="sr-only">Delete section</span>
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => toggleSection(section._id)}
//                 >
//                   {expandedSections.includes(section._id) ? (
//                     <ChevronDown className="h-4 w-4" />
//                   ) : (
//                     <ChevronRight className="h-4 w-4" />
//                   )}
//                   <span className="sr-only">Toggle section</span>
//                 </Button>
//               </div>
//             </div>
//             {expandedSections.includes(section._id) && (
//               <div className="border-t border-border">
//                 {section.subSection.map((subSection: any) => (
//                   <div
//                     key={subSection._id}
//                     className="flex items-center justify-between p-4 hover:bg-accent"
//                   >
//                     <div className="flex items-center gap-x-3">
//                       <Menu className="h-5 w-5 text-muted-foreground" />
//                       <span>{subSection.title}</span>
//                     </div>
//                     <div className="flex items-center gap-x-2">
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => setViewSubSection(subSection)}
//                       >
//                         <ChevronRight className="h-4 w-4" />
//                         <span className="sr-only">View subsection</span>
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() =>
//                           handleChangeEditSectionName(
//                             section._id,
//                             section.sectionName
//                           )
//                         }
//                       >
//                         <Pencil className="h-4 w-4" />
//                         <span className="sr-only">Edit subsection</span>
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() =>
//                           handleShowConfirmation(
//                             "Delete this Sub-Section?",
//                             "Selected lecture will be deleted",
//                             "Delete",
//                             "Cancel",
//                             () =>
//                               handleDeleteSubSection(
//                                 subSection._id,
//                                 section._id
//                               ),
//                             () => setConfirmationModal(null)
//                           )
//                         }
//                       >
//                         <Trash2 className="h-4 w-4" />
//                         <span className="sr-only">Delete subsection</span>
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="m-4 text-primary"
//                   onClick={() => setAddSubSection(section._id)}
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Lecture
//                 </Button>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       ))}
//       {addSubSection && (
//         <SubSectionModal
//           modalData={addSubSection}
//           setModalData={setAddSubSection}
//           add={true}
//         />
//       )}
//       {editSubsection && (
//         <SubSectionModal
//           modalData={editSubsection}
//           setModalData={setEditSubsection}
//           edit={true}
//         />
//       )}
//       {viewSubSection && (
//         <SubSectionModal
//           modalData={viewSubSection}
//           setModalData={setViewSubSection}
//           view={true}
//         />
//       )}
//       {confirmationModal && <ConfirmationModal {...confirmationModal} />}
//     </div>
//   )
// }

// export default NestedView
