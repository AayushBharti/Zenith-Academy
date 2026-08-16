"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@workspace/ui/components/form";
import { cn } from "@workspace/ui/lib/utils";
import {
  ArrowLeft,
  BookOpen,
  Globe,
  Image as ImageIcon,
  Layers,
  Lock,
  Loader2,
  Save,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { COURSE_STATUS } from "@/data/constants";
import {
  useAddCourseToCategory,
  useEditCourse,
} from "@/features/course/hooks/use-course-mutations";
import { useCourseStore } from "@/features/course/use-course-store";

const formSchema = z.object({
  public: z.boolean(),
});

const PublishCourseForm = () => {
  const router = useRouter();
  const { course, setEditCourse, setStep } = useCourseStore();
  const editCourseMutation = useEditCourse();
  const addToCategoryMutation = useAddCourseToCategory();
  const loading =
    editCourseMutation.isPending || addToCategoryMutation.isPending;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      public: course?.status === COURSE_STATUS.PUBLISHED,
    },
  });

  const isPublic = form.watch("public");

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

  const handlePublish = (data: z.infer<typeof formSchema>) => {
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

    if (!course) return;

    const formData = new FormData();
    formData.append("courseId", course._id);
    formData.append(
      "status",
      data.public ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT
    );

    editCourseMutation.mutate(formData, {
      onSuccess: () => {
        const categoryId =
          typeof course.category === "object"
            ? course.category?._id
            : course.category;
        if (data.public && categoryId) {
          addToCategoryMutation.mutate({ categoryId, courseId: course._id });
        }

        goToMyCourses();
        setStep(1);
        setEditCourse(false);
      },
    });
  };

  const sectionCount = course?.courseContent?.length || 0;
  const lectureCount =
    course?.courseContent?.reduce(
      (acc: number, s: { subSection: unknown[] }) =>
        acc + (s.subSection?.length || 0),
      0
    ) || 0;

  return (
    <div className="space-y-8">
      {/* Course preview card */}
      <div className="overflow-hidden rounded-xl border">
        <div className="flex flex-col sm:flex-row">
          {/* Thumbnail */}
          <div className="relative aspect-video w-full shrink-0 bg-muted sm:aspect-auto sm:h-auto sm:w-48">
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
              <div className="flex h-full min-h-32 w-full items-center justify-center">
                <ImageIcon className="size-10 text-muted-foreground/30" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-1 flex-col justify-center gap-3 p-5">
            <div>
              <h3 className="font-semibold text-lg leading-snug">
                {course?.courseName || "Untitled Course"}
              </h3>
              {course?.courseDescription && (
                <p className="mt-1 line-clamp-2 text-muted-foreground text-sm">
                  {course.courseDescription}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge className="gap-1.5" variant="secondary">
                <Layers className="size-3" />
                {sectionCount} {sectionCount === 1 ? "Section" : "Sections"}
              </Badge>
              <Badge className="gap-1.5" variant="secondary">
                <BookOpen className="size-3" />
                {lectureCount} {lectureCount === 1 ? "Lecture" : "Lectures"}
              </Badge>
              <Badge className="gap-1.5" variant="secondary">
                {(course?.price ?? 0) > 0 ? `INR ${course?.price}` : "Free"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Visibility toggle */}
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
                  className={cn(
                    "flex cursor-pointer items-start gap-4 rounded-xl border-2 p-5 transition-all duration-200",
                    field.value
                      ? "border-primary/50 bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  )}
                  onClick={() => field.onChange(!field.value)}
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      className="mt-0.5 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1">
                    <FormLabel className="flex cursor-pointer items-center gap-2 font-semibold">
                      {field.value ? (
                        <Globe className="size-4 text-primary" />
                      ) : (
                        <Lock className="size-4" />
                      )}
                      Make this course public
                    </FormLabel>
                    <FormDescription>
                      {field.value
                        ? "Your course will be visible to everyone and available for purchase."
                        : "The course stays as a draft. Only you can view and edit it."}
                    </FormDescription>
                  </div>
                </div>
              </FormItem>
            )}
          />
        </form>
      </Form>

      {/* Navigation footer */}
      <div className="flex justify-between border-t pt-6">
        <Button disabled={loading} onClick={goBack} type="button" variant="ghost">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <Button
          animation="swap"
          disabled={loading}
          form="publish-form"
          type="submit"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : isPublic ? (
            <>
              Save & Publish
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Save as Draft
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PublishCourseForm;
