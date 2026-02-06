"use client";

import { FileText, Loader2, Video } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  createSubSection,
  updateSubSection,
} from "@/services/course-details-service";
import { useAuthStore } from "@/store/use-auth-store";
import { useCourseStore } from "@/store/use-course-store";

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
  const { token } = useAuthStore();
  const { course, setCourse } = useCourseStore();
  const [loading, setLoading] = useState(false);
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

  const handleEditSubsection = async (data: any) => {
    const currentValues = getValues();
    const sectionData = modalData as SubSection;

    const formData = new FormData();
    formData.append("SubsectionId", sectionData._id);

    if (currentValues.lecture !== sectionData.title) {
      formData.append("title", data.lecture);
    }
    if (currentValues.lectureDesc !== sectionData.description) {
      formData.append("description", data.lectureDesc);
    }
    if (currentValues.lectureVideo !== sectionData.videoUrl) {
      formData.append("videoFile", data.lectureVideo);
    }
    formData.append("courseId", course._id);

    const result = await updateSubSection(formData, token as string);
    if (result) {
      setCourse(result);
      handleClose();
      toast.success("Lecture Updated", {
        description: "Lecture updated successfully.",
      });
    }
  };

  const onSubmit = async (data: any) => {
    if (view) return;

    setLoading(true);
    try {
      if (edit) {
        if (!isFormUpdated()) {
          toast.error("No changes made", {
            description: "No changes were made to the lecture.",
          });
        } else {
          await handleEditSubsection(data);
        }
      } else {
        const formData = new FormData();
        formData.append("sectionId", modalData as string);
        formData.append("title", data.lecture);
        formData.append("description", data.lectureDesc);
        formData.append("videoFile", data.lectureVideo);
        formData.append("courseId", course._id);

        const result = await createSubSection(formData, token as string);
        if (result) {
          setCourse(result);
          handleClose();
          toast.success("Lecture added successfully");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to save lecture");
    } finally {
      setLoading(false);
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
          ) : (
            <>{edit ? "Save Changes" : "Create Lecture"}</>
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
