"use client";

import {
  ArrowLeft,
  ArrowRight,
  Edit2,
  LayoutDashboard,
  Loader2,
  PlusCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  createSection,
  updateSection,
} from "@/services/course-details-service";
import { useAuthStore } from "@/store/use-auth-store";
import { useCourseStore } from "@/store/use-course-store";

import NestedView from "./nested-view";

type FormData = {
  sectionName: string;
};

const CourseBuilderForm = () => {
  const { token } = useAuthStore();
  const { course, setCourse, setEditCourse, setStep } = useCourseStore();
  const [editSectionName, setEditSectionName] = useState<string | false>(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  // --- Handlers ---

  const goNext = () => {
    if (course.courseContent.length === 0) {
      toast.error("Empty Curriculum", {
        description: "Please add at least one section to the course.",
      });
      return;
    }

    if (
      course.courseContent.some((section: any) => section.subSection.length > 0)
    ) {
      setStep(3);
    } else {
      toast.error("Missing Content", {
        description: "Please add at least one lecture/video to a section.",
      });
    }
  };

  const onSubmit = async (data: FormData) => {
    let result = null;
    setLoading(true);

    try {
      if (editSectionName) {
        result = await updateSection(
          {
            sectionName: data.sectionName,
            courseId: course._id,
            sectionId: editSectionName,
          },
          token as string
        );
      } else {
        result = await createSection(
          {
            sectionName: data.sectionName,
            courseId: course._id,
          },
          token as string
        );
      }

      if (result) {
        setCourse(result);
        setValue("sectionName", "");
        setEditSectionName(false);
        toast.success(editSectionName ? "Section Updated" : "Section Created", {
          description: editSectionName
            ? "Section name changed successfully."
            : "New section added to curriculum.",
        });
      }
    } catch (error) {
      console.error("Error creating/updating section:", error);
      toast.error("Failed to save section");
    } finally {
      setLoading(false);
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
    <motion.div
      animate={{ opacity: 1, x: 0 }}
      className="mx-auto w-full max-w-3xl"
      initial={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-muted-foreground/10 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-bold text-2xl text-primary">
            <LayoutDashboard className="h-6 w-6" /> Course Builder
          </CardTitle>
          <CardDescription>
            Structure your course by creating sections and adding lectures.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* --- Section Creation Form --- */}
          <div
            className={`rounded-xl border p-6 transition-all duration-300 ${
              editSectionName
                ? "border-primary/30 bg-primary/5"
                : "border-border/50 bg-secondary/20"
            }`}
          >
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label
                  className="flex items-center justify-between font-medium text-foreground"
                  htmlFor="sectionName"
                >
                  <span>
                    {editSectionName ? "Edit Section Name" : "New Section Name"}
                  </span>
                  {editSectionName && (
                    <span className="text-muted-foreground text-xs">
                      Editing Mode
                    </span>
                  )}
                </Label>
                <div className="flex flex-col gap-3 md:flex-row">
                  <div className="flex-1">
                    <Input
                      className="bg-background"
                      disabled={loading}
                      id="sectionName"
                      placeholder="e.g. Introduction to React"
                      {...register("sectionName", {
                        required: "Section name is required",
                      })}
                    />
                    {errors.sectionName && (
                      <p className="mt-1 ml-1 text-destructive text-xs">
                        {errors.sectionName.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-start gap-2">
                    <Button
                      className={
                        !editSectionName
                          ? "border-2 border-dashed hover:border-primary hover:text-primary"
                          : ""
                      }
                      disabled={loading}
                      type="submit"
                      variant={editSectionName ? "default" : "outline"}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          {editSectionName ? (
                            <Edit2 className="mr-2 h-4 w-4" />
                          ) : (
                            <PlusCircle className="mr-2 h-4 w-4" />
                          )}
                          {editSectionName ? "Update" : "Create Section"}
                        </>
                      )}
                    </Button>

                    {editSectionName && (
                      <Button
                        className="text-muted-foreground hover:text-destructive"
                        onClick={cancelEdit}
                        type="button"
                        variant="ghost"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* --- Nested View (The List) --- */}
          <div className="space-y-4">
            {course?.courseContent?.length > 0 ? (
              <NestedView
                handleChangeEditSectionName={handleChangeEditSectionName}
              />
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-secondary/10 py-12 text-center text-muted-foreground">
                <LayoutDashboard className="mb-3 h-10 w-10 opacity-20" />
                <p className="font-medium">No sections yet</p>
                <p className="text-sm">
                  Create a section above to start building your curriculum.
                </p>
              </div>
            )}
          </div>
        </CardContent>

        <Separator className="bg-border/50" />

        {/* --- Navigation Footer --- */}
        <CardFooter className="flex justify-between pt-6 pb-6">
          <Button
            className="flex items-center gap-2"
            onClick={() => {
              setEditCourse(true);
              setStep(1);
            }}
            variant="ghost"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Information
          </Button>

          <Button
            className="flex min-w-[120px] items-center gap-2"
            onClick={goNext}
          >
            Next Step <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CourseBuilderForm;
