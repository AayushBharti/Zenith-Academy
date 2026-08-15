"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@workspace/ui/components/drawer";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { cn } from "@workspace/ui/lib/utils";
import { FileText, Loader2, Video } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  useCreateSubSection,
  useUpdateSubSection,
} from "@/features/course/hooks/use-course-mutations";
import { useCourseStore } from "@/features/course/use-course-store";

import Upload from "./video-upload";

interface SubSection {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
}

interface SubsectionModalProps {
  modalData: string | SubSection | null;
  setModalData: (data: null) => void;
  add?: boolean;
  edit?: boolean;
  view?: boolean;
}

// Simple custom hook if you don't have 'usehooks-ts'
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const listener = () => setIsDesktop(media.matches);
    setIsDesktop(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);
  return isDesktop;
}

const SubsectionModal: React.FC<SubsectionModalProps> = ({
  modalData,
  setModalData,
  add = false,
  edit = false,
  view = false,
}) => {
  const { course, setCourse } = useCourseStore();
  const createSubSectionMutation = useCreateSubSection();
  const updateSubSectionMutation = useUpdateSubSection();
  const loading =
    createSubSectionMutation.isPending || updateSubSectionMutation.isPending;
  const isDesktop = useIsDesktop();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm();

  // --- Effect: Populate Data ---
  useEffect(() => {
    if ((view || edit) && typeof modalData === "object" && modalData !== null) {
      const data = modalData as SubSection;
      setValue("lecture", data.title);
      setValue("lectureDesc", data.description);
      setValue("lectureVideo", data.videoUrl);
    }
  }, [view, edit, modalData, setValue]);

  const handleClose = () => {
    reset();
    setModalData(null);
  };

  // --- Handlers ---
  const isFormUpdated = () => {
    const currentValues = getValues();
    const data = modalData as SubSection;
    return (
      currentValues.lecture !== data.title ||
      currentValues.lectureDesc !== data.description ||
      currentValues.lectureVideo !== data.videoUrl
    );
  };

  const handleEditSubsection = (data: Record<string, string>) => {
    if (!course) return;
    const currentValues = getValues();
    const sectionData = modalData as SubSection;

    const formData = new FormData();
    formData.append("SubsectionId", sectionData._id);

    if (currentValues.lecture !== sectionData.title) {
      formData.append("title", data.lecture ?? "");
    }
    if (currentValues.lectureDesc !== sectionData.description) {
      formData.append("description", data.lectureDesc ?? "");
    }
    if (currentValues.lectureVideo !== sectionData.videoUrl) {
      formData.append("videoFile", data.lectureVideo ?? "");
    }
    formData.append("courseId", course._id);

    updateSubSectionMutation.mutate(formData, {
      onSuccess: (result) => {
        setCourse(result);
        handleClose();
      },
    });
  };

  const onSubmit = (data: Record<string, string>) => {
    if (view) return;

    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No changes made", {
          description: "No changes were made to the lecture.",
        });
      } else {
        handleEditSubsection(data);
      }
    } else {
      if (!course) return;
      const formData = new FormData();
      formData.append("sectionId", modalData as string);
      formData.append("title", data.lecture ?? "");
      formData.append("description", data.lectureDesc ?? "");
      formData.append("videoFile", data.lectureVideo ?? "");
      formData.append("courseId", course._id);

      createSubSectionMutation.mutate(formData, {
        onSuccess: (result) => {
          setCourse(result);
          handleClose();
        },
      });
    }
  };

  // --- Shared Form Content ---
  const FormContent = (
    <form
      className="space-y-6"
      id="subsection-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div
        className={cn("grid gap-6", isDesktop ? "grid-cols-2" : "grid-cols-1")}
      >
        {/* Column 1: Video Upload */}
        <div className="space-y-2">
          <Upload
            editData={edit ? (modalData as SubSection)?.videoUrl : null}
            errors={errors}
            label="Lecture Video"
            name="lectureVideo"
            register={register}
            setValue={setValue}
            video={true}
            viewData={view ? (modalData as SubSection)?.videoUrl : null}
          />
        </div>

        {/* Column 2: Details */}
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="lecture">Lecture Title</Label>
            <Input
              id="lecture"
              placeholder="e.g. Introduction to Variables"
              {...register("lecture", {
                required: "Lecture Title is required",
              })}
              className="bg-background"
              disabled={view}
            />
            {errors.lecture && (
              <p className="font-medium text-destructive text-xs">
                {errors.lecture.message as string}
              </p>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <Label htmlFor="lectureDesc">Description</Label>
            <Textarea
              id="lectureDesc"
              placeholder="Summarize what the student will learn..."
              {...register("lectureDesc", {
                required: "Description is required",
              })}
              className={cn(
                "resize-none bg-background",
                isDesktop ? "h-[160px]" : "min-h-[120px]"
              )}
              disabled={view}
            />
            {errors.lectureDesc && (
              <p className="font-medium text-destructive text-xs">
                {errors.lectureDesc.message as string}
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );

  // --- Shared Footer Buttons ---
  const FooterButtons = (
    <>
      <Button onClick={handleClose} type="button" variant="outline">
        {view ? "Close" : "Cancel"}
      </Button>
      {!view && (
        <Button
          className="min-w-[100px]"
          disabled={loading}
          form="subsection-form"
          type="submit"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : edit ? (
            "Save Changes"
          ) : (
            "Create Lecture"
          )}
        </Button>
      )}
    </>
  );

  // --- Render ---

  if (isDesktop) {
    return (
      <Dialog onOpenChange={handleClose} open={Boolean(modalData)}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {view || add ? (
                <Video className="h-5 w-5 text-primary" />
              ) : (
                <FileText className="h-5 w-5 text-primary" />
              )}
              {view
                ? "Viewing Lecture"
                : add
                  ? "Add New Lecture"
                  : "Edit Lecture Details"}
            </DialogTitle>
            <DialogDescription>
              {view
                ? "Reviewing content details."
                : "Fill in the details below."}
            </DialogDescription>
          </DialogHeader>

          {FormContent}

          <DialogFooter>{FooterButtons}</DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      onOpenChange={(open) => !open && handleClose()}
      open={Boolean(modalData)}
    >
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              {view || add ? (
                <Video className="h-5 w-5 text-primary" />
              ) : (
                <FileText className="h-5 w-5 text-primary" />
              )}
              {view ? "View Lecture" : add ? "Add Lecture" : "Edit Lecture"}
            </DrawerTitle>
            <DrawerDescription>
              {view ? "Review details." : "Enter details below."}
            </DrawerDescription>
          </DrawerHeader>

          <div className="max-h-[70vh] overflow-y-auto p-4">{FormContent}</div>

          <DrawerFooter className="flex-row gap-2">
            {FooterButtons}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SubsectionModal;
