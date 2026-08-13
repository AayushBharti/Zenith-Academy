"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  ArrowLeft,
  Edit2,
  LayoutDashboard,
  Loader2,
  PlusCircle,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  useCreateSection,
  useUpdateSection,
} from "@/features/course/hooks/use-course-mutations";
import { useCourseStore } from "@/features/course/use-course-store";

import NestedView from "./nested-view";

type FormData = {
  sectionName: string;
};

const CourseBuilderForm = () => {
  const { course, setCourse, setEditCourse, setStep } = useCourseStore();
  const [editSectionName, setEditSectionName] = useState<string | false>(false);

  const createSectionMutation = useCreateSection();
  const updateSectionMutation = useUpdateSection();
  const loading =
    createSectionMutation.isPending || updateSectionMutation.isPending;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const goNext = () => {
    if (!course?.courseContent?.length) {
      toast.error("Empty Curriculum", {
        description: "Please add at least one section to the course.",
      });
      return;
    }

    if (
      course.courseContent.some(
        (section: { subSection: unknown[] }) => section.subSection.length > 0
      )
    ) {
      setStep(3);
    } else {
      toast.error("Missing Content", {
        description: "Please add at least one lecture/video to a section.",
      });
    }
  };

  const onSubmit = (data: FormData) => {
    if (!course) return;

    // biome-ignore lint/suspicious/noExplicitAny: mutation result type
    const onMutationSuccess = (result: any) => {
      setCourse(result);
      setValue("sectionName", "");
      setEditSectionName(false);
    };

    if (editSectionName) {
      updateSectionMutation.mutate(
        {
          sectionName: data.sectionName,
          courseId: course._id,
          sectionId: editSectionName,
        },
        { onSuccess: onMutationSuccess }
      );
    } else {
      createSectionMutation.mutate(
        {
          sectionName: data.sectionName,
          courseId: course._id,
        },
        { onSuccess: onMutationSuccess }
      );
    }
  };

  const handleChangeEditSectionName = (
    sectionId: string,
    sectionName: string
  ) => {
    if (editSectionName === sectionId) {
      cancelEdit();
      return;
    }
    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  };

  const cancelEdit = () => {
    setEditSectionName(false);
    setValue("sectionName", "");
  };

  return (
    <div className="space-y-8">
      {/* Section creation form */}
      <div
        className={`rounded-xl border-2 border-dashed p-5 transition-all duration-300 ${
          editSectionName
            ? "border-primary/40 bg-primary/5"
            : "border-border bg-muted/20"
        }`}
      >
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <Label
            className="flex items-center justify-between text-sm"
            htmlFor="sectionName"
          >
            <span className="font-semibold">
              {editSectionName ? "Edit Section" : "Add Section"}
            </span>
            {editSectionName && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary text-xs">
                Editing
              </span>
            )}
          </Label>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex-1">
              <Input
                disabled={loading}
                id="sectionName"
                placeholder="e.g. Introduction to React"
                {...register("sectionName", {
                  required: "Section name is required",
                })}
              />
              {errors.sectionName && (
                <p className="mt-1 text-destructive text-xs">
                  {errors.sectionName.message}
                </p>
              )}
            </div>

            <div className="flex items-start gap-2">
              <Button disabled={loading} type="submit">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {editSectionName ? (
                      <Edit2 className="mr-1.5 h-4 w-4" />
                    ) : (
                      <PlusCircle className="mr-1.5 h-4 w-4" />
                    )}
                    {editSectionName ? "Update" : "Create"}
                  </>
                )}
              </Button>

              {editSectionName && (
                <Button
                  onClick={cancelEdit}
                  type="button"
                  variant="ghost"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Sections list */}
      {(course?.courseContent?.length ?? 0) > 0 ? (
        <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <div className="mb-4 rounded-full bg-muted/50 p-4">
            <LayoutDashboard className="size-8 text-muted-foreground/40" />
          </div>
          <p className="font-semibold text-muted-foreground">No sections yet</p>
          <p className="mt-1 text-muted-foreground/60 text-sm">
            Create a section above to start building your curriculum.
          </p>
        </div>
      )}

      {/* Navigation footer */}
      <div className="flex justify-between border-t pt-6">
        <Button
          onClick={() => {
            setEditCourse(true);
            setStep(1);
          }}
          variant="ghost"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <Button animation="slide-in" onClick={goNext}>
          Next Step
        </Button>
      </div>
    </div>
  );
};

export default CourseBuilderForm;
