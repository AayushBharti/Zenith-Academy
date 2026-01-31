"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlignLeft,
  ArrowRight,
  CircleDollarSign,
  FileText,
  ImageIcon,
  IndianRupee,
  Layers,
  ListChecks,
  Loader2,
  Save,
  Tags,
  Type,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator"; // Standard Shadcn separator
import { Textarea } from "@/components/ui/textarea";
import { COURSE_STATUS } from "@/data/constants";
import {
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
} from "@/services/course-details-service";
import { useAuthStore } from "@/store/use-auth-store";
import useCourseStore from "@/store/use-course-store";
import type { Category } from "@/types/category";

import ChipInput from "./chip-input";
import Upload from "./upload";

// --- Zod Schema ---
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

export default function CourseInformationForm() {
  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState<Category[]>([]);
  const { token } = useAuthStore();
  const { course, editCourse, setCourse, setStep, setEditCourse } =
    useCourseStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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

  // --- Effects ---
  useEffect(() => {
    const getCategories = async () => {
      const categories = await fetchCourseCategories();
      if (categories.length > 0) {
        setCourseCategories(categories);
      }
    };

    getCategories();

    if (editCourse && course) {
      form.reset({
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        price: course.price,
        category: course.category._id,
        tag: course.tag,
        whatYouWillLearn: course.whatYouWillLearn,
        instructions: course.instructions,
        thumbnailImage: course.thumbnail,
      });
    }
  }, [editCourse, course, form]);

  // --- Submit Handler ---
  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
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

      let result;
      if (editCourse) {
        formData.append("courseId", course._id);
        result = await editCourseDetails(formData, token as string);
        if (result) {
          setEditCourse(false);
          setCourse(result);
          setStep(2);
        }
      } else {
        formData.append("status", COURSE_STATUS.DRAFT);
        result = await addCourseDetails(formData, token as string);
        if (result) {
          setCourse(result);
          setStep(2);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save course details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="w-full border-muted-foreground/10 shadow-lg">
        <CardHeader>
          <CardTitle className="font-bold text-2xl text-primary">
            {editCourse ? "Edit Course Information" : "Basic Information"}
          </CardTitle>
          <CardDescription>
            Fill in the core details about your course to get started.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              {/* ================= SECTION 1: BASIC DETAILS ================= */}
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="courseName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-foreground/80">
                          <Type className="h-4 w-4" /> Course Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Master React 19"
                            {...field}
                          />
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
                        <FormLabel className="flex items-center gap-2 text-foreground/80">
                          <Layers className="h-4 w-4" /> Category
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {courseCategories.map((category) => (
                              <SelectItem
                                key={category._id}
                                value={category._id}
                              >
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
                      <FormLabel className="flex items-center gap-2 text-foreground/80">
                        <AlignLeft className="h-4 w-4" /> Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[120px] resize-y"
                          placeholder="Describe what makes this course special..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="bg-border/60" />

              {/* ================= SECTION 2: SETTINGS (Price & Tags) ================= */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-2 font-medium text-foreground text-lg">
                  <CircleDollarSign className="h-5 w-5 text-primary" /> Settings
                </h3>

                {/* PRICE - Half width on Desktop */}
                <div className="w-full md:w-1/2">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-foreground/80">
                          <IndianRupee className="h-4 w-4" /> Price
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute top-2.5 left-3 font-semibold text-muted-foreground text-sm">
                              ₹
                            </span>
                            <Input
                              className="pl-8"
                              placeholder="0.00"
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  Number.parseFloat(e.target.value)
                                )
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

                {/* TAGS - Full Width Row */}
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="tag"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-foreground/80">
                          <Tags className="h-4 w-4" /> Tags
                        </FormLabel>
                        <FormControl>
                          <ChipInput
                            onChange={field.onChange}
                            placeholder="Type keywords & Press Enter"
                            value={field.value}
                          />
                        </FormControl>
                        <FormDescription>
                          Add keywords to help students find your course.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator className="bg-border/60" />

              {/* ================= SECTION 3: CURRICULUM ================= */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-2 font-medium text-foreground text-lg">
                  <ListChecks className="h-5 w-5 text-primary" /> Curriculum
                  Details
                </h3>

                <div className="space-y-6 rounded-lg border border-border/40 bg-secondary/10 p-6">
                  <FormField
                    control={form.control}
                    name="whatYouWillLearn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-foreground/80">
                          <FileText className="h-4 w-4" /> What will students
                          learn?
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            className="min-h-[100px] bg-background"
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
                        <FormLabel className="flex items-center gap-2 text-foreground/80">
                          <ListChecks className="h-4 w-4" /> Requirements
                        </FormLabel>
                        <FormControl>
                          <ChipInput
                            className="bg-background"
                            onChange={field.onChange}
                            placeholder="Add a requirement & Press Enter"
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* ================= SECTION 4: MEDIA ================= */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 font-medium text-foreground text-lg">
                  <ImageIcon className="h-5 w-5 text-primary" /> Media
                </h3>
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

              {/* ================= FOOTER ================= */}
              <div className="flex items-center justify-end gap-4 border-t pt-6">
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
                  className="min-w-[140px]"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {editCourse ? (
                        <>
                          <Save className="mr-2 h-4 w-4" /> Save Changes
                        </>
                      ) : (
                        <>
                          Next <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
