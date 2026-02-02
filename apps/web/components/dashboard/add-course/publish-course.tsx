"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Globe,
  Image as ImageIcon,
  Lock,
  Rocket,
  Save,
} from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { COURSE_STATUS } from "@/data/constants";
import {
  addCourseToCategory,
  editCourseDetails,
} from "@/services/course-details-service";
import { useAuthStore } from "@/store/use-auth-store";
import { useCourseStore } from "@/store/use-course-store";

const formSchema = z.object({
  public: z.boolean().default(false),
});

const PublishCourseForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { token } = useAuthStore();
  const { course, setEditCourse, setStep } = useCourseStore();

  // Use form hook with zod validation schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      public: course?.status === COURSE_STATUS.PUBLISHED,
    },
  });

  // Watch the public value to update UI dynamically
  const isPublic = form.watch("public");

  // Sync form values with course status
  useEffect(() => {
    if (course?.status === COURSE_STATUS.PUBLISHED) {
      form.setValue("public", true);
    }
  }, [course, form]);

  const goBack = () => {
    setStep(2);
  };

  const goToMyCourses = () => {
    router.push("/dashboard/my-courses");
  };

  const handlePublish = async (data: z.infer<typeof formSchema>) => {
    // If no changes in status, just redirect
    if (
      (course?.status === COURSE_STATUS.PUBLISHED && data.public) ||
      (course?.status === COURSE_STATUS.DRAFT && !data.public)
    ) {
      goToMyCourses();
      setStep(1);
      setEditCourse(false);
      toast.success("Saved", {
        description: "No changes were made to the status.",
      });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("courseId", course._id);
      formData.append(
        "status",
        data.public ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT
      );

      const result = await editCourseDetails(formData, token as string);

      // Only add to category if we are publishing for the first time or if logic requires it
      if (data.public) {
        await addCourseToCategory(
          { categoryId: course.category, courseId: course._id },
          token as string
        );
      }

      if (result) {
        goToMyCourses();
        setStep(1);
        setEditCourse(false);
        toast.success(data.public ? "Course Published!" : "Saved as Draft", {
          description: data.public
            ? "Your course is now live."
            : "Your course is saved and can be edited later.",
        });
      }
    } catch (error) {
      console.error("Error publishing course:", error);
      toast.error("Error", { description: "Failed to update course status" });
    } finally {
      setLoading(false);
    }
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
            <Rocket className="h-6 w-6" /> Publish Settings
          </CardTitle>
          <CardDescription>
            You are almost done! Review your course and choose visibility.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* --- Course Summary Preview --- */}
          <div className="flex flex-col items-center gap-4 rounded-xl border border-border/50 bg-secondary/10 p-4 md:flex-row md:items-start">
            <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-lg border border-border bg-background shadow-xs">
              {course?.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt="Course Thumbnail"
                  className="h-full w-full object-cover"
                  src={
                    typeof course.thumbnail === "string"
                      ? course.thumbnail
                      : URL.createObjectURL(course.thumbnail)
                  }
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <ImageIcon className="h-8 w-8" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-1 text-center md:text-left">
              <h3 className="font-semibold text-lg leading-tight">
                {course?.courseName || "Untitled Course"}
              </h3>
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm md:justify-start">
                <Badge variant="outline">
                  {course?.courseContent?.length || 0} Sections
                </Badge>
                <Badge variant="outline">
                  {course?.price > 0 ? `₹${course.price}` : "Free"}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* --- Form Section --- */}
          <Form {...form}>
            <form
              className="space-y-6"
              id="publish-form"
              onSubmit={form.handleSubmit(handlePublish)}
            >
              <FormField
                control={form.control}
                name="public"
                render={({ field }) => (
                  <FormItem>
                    <div
                      className={`flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-6 transition-all duration-300 ${field.value ? "border-primary bg-primary/5" : "border-muted bg-transparent"}
                         `}
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          className="mt-1 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div
                        className="cursor-pointer space-y-1 leading-none"
                        onClick={() => field.onChange(!field.value)}
                      >
                        <FormLabel className="flex cursor-pointer items-center gap-2 font-semibold text-base">
                          {field.value ? (
                            <Globe className="h-4 w-4 text-primary" />
                          ) : (
                            <Lock className="h-4 w-4" />
                          )}
                          Make this course public
                        </FormLabel>
                        <FormDescription className="pt-1">
                          {field.value
                            ? "Your course will be publicly visible and available for students to purchase."
                            : "The course will remain a draft. Only you can view and edit it."}
                        </FormDescription>
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-between border-t bg-secondary/5 pt-6">
          <Button
            className="flex items-center gap-2"
            disabled={loading}
            onClick={goBack}
            type="button"
            variant="ghost"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Builder
          </Button>

          <div className="flex gap-4">
            <Button
              className="min-w-[140px]"
              disabled={loading} // Connects button to form
              form="publish-form"
              type="submit"
              variant={isPublic ? "default" : "secondary"}
            >
              {loading
                ? "Processing..."
                : isPublic
                  ? "Save & Publish"
                  : "Save as Draft"}
              {!loading && <Save className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PublishCourseForm;
