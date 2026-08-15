"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Textarea } from "@workspace/ui/components/textarea";
import { Loader2, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { COURSE_STATUS } from "@/data/constants";
import {
  useAddCourse,
  useEditCourse,
} from "@/features/course/hooks/use-course-mutations";
import { useCourseCategories } from "@/features/course/hooks/use-course-queries";
import useCourseStore from "@/features/course/use-course-store";

import ChipInput from "./chip-input";
import Upload from "./upload";

const formSchema = z.object({
  courseName: z.string().min(1, "Course Title is required"),
  courseDescription: z
    .string()
    .min(10, "Description should be at least 10 characters"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  category: z.string().min(1, "Course Category is required"),
  tag: z.array(z.string()).min(1, "At least one tag is required"),
  whatYouWillLearn: z.string().min(10, "Please provide detailed benefits"),
  instructions: z
    .array(z.string())
    .min(1, "At least one requirement is required"),
  thumbnailImage: z.union([z.instanceof(File), z.string()]).optional(),
});

type FormValues = z.infer<typeof formSchema>;

function SectionHeading({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 font-bold text-primary text-sm">
        {number}
      </span>
      <div className="space-y-0.5">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}

export default function CourseInformationForm() {
  const { course, editCourse, setCourse, setStep, setEditCourse } =
    useCourseStore();
  const { data: courseCategories = [] } = useCourseCategories();
  const addCourseMutation = useAddCourse();
  const editCourseMutation = useEditCourse();
  const loading = addCourseMutation.isPending || editCourseMutation.isPending;

  const form = useForm<FormValues>({
    // biome-ignore lint/suspicious/noExplicitAny: zodResolver type mismatch with react-hook-form generics
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      courseName: "",
      courseDescription: "",
      price: 0,
      category: "",
      tag: [],
      whatYouWillLearn: "",
      instructions: [],
    },
  });

  useEffect(() => {
    if (editCourse && course) {
      const categoryId =
        typeof course.category === "object"
          ? (course.category?._id ?? "")
          : (course.category ?? "");
      form.reset({
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        price: course.price,
        category: categoryId,
        tag: course.tag ?? [],
        whatYouWillLearn: course.whatYouWillLearn ?? "",
        instructions: course.instructions ?? [],
        thumbnailImage: course.thumbnail,
      });
    }
  }, [editCourse, course, form]);

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "tag" || key === "instructions") {
        formData.append(key, JSON.stringify(value));
      } else if (key === "thumbnailImage") {
        if (value instanceof File) {
          formData.append(key, value);
        }
      } else {
        formData.append(key, value.toString());
      }
    });

    if (editCourse && course) {
      formData.append("courseId", course._id);
      editCourseMutation.mutate(formData, {
        onSuccess: (result) => {
          setEditCourse(false);
          setCourse(result);
          setStep(2);
        },
      });
    } else {
      formData.append("status", COURSE_STATUS.DRAFT);
      addCourseMutation.mutate(formData, {
        onSuccess: (result) => {
          setCourse(result);
          setStep(2);
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-10" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Section 1: Basic Details */}
        <section className="space-y-6">
          <SectionHeading
            description="Give your course a name and describe what students will get."
            number="1"
            title="Basic Details"
          />

          <div className="space-y-5 pl-12">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="courseName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Master React 19" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courseCategories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="courseDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-28 resize-y"
                      placeholder="Describe what makes this course special..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <div className="h-px bg-border/60" />

        {/* Section 2: Pricing & Tags */}
        <section className="space-y-6">
          <SectionHeading
            description="Set a price and add keywords to help students find your course."
            number="2"
            title="Pricing & Tags"
          />

          <div className="space-y-5 pl-12">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="-translate-y-1/2 absolute top-1/2 left-3 font-semibold text-muted-foreground text-sm">
                          INR
                        </span>
                        <Input
                          className="pl-12"
                          placeholder="0"
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number.parseFloat(e.target.value))
                          }
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Set to 0 for a free course.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <ChipInput
                      onChange={field.onChange}
                      placeholder="Type a keyword and press Enter"
                      value={field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    Add keywords to help students discover your course.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <div className="h-px bg-border/60" />

        {/* Section 3: Curriculum Details */}
        <section className="space-y-6">
          <SectionHeading
            description="Outline what students will learn and any prerequisites."
            number="3"
            title="Curriculum Details"
          />

          <div className="space-y-5 pl-12">
            <FormField
              control={form.control}
              name="whatYouWillLearn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What will students learn?</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-24"
                      placeholder="List the key takeaways..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requirements</FormLabel>
                  <FormControl>
                    <ChipInput
                      onChange={field.onChange}
                      placeholder="Add a requirement and press Enter"
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <div className="h-px bg-border/60" />

        {/* Section 4: Thumbnail */}
        <section className="space-y-6">
          <SectionHeading
            description="Upload a cover image. 16:9 aspect ratio recommended."
            number="4"
            title="Thumbnail"
          />

          <div className="pl-12">
            <FormField
              control={form.control}
              name="thumbnailImage"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Upload
                      onChange={(file) => field.onChange(file)}
                      value={field.value as File}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t pt-6">
          {editCourse && (
            <Button
              disabled={loading}
              onClick={() => setStep(2)}
              type="button"
              variant="ghost"
            >
              Continue Without Saving
            </Button>
          )}

          <Button
            animation="swap"
            className="min-w-35"
            disabled={loading}
            type="submit"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : editCourse ? (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </>
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
