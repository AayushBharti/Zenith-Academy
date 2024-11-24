"use client"

import { useEffect, useState } from "react"
import { COURSE_STATUS } from "@/data/constants"
import {
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
} from "@/services/courseDetailsService"
import { useAuthStore } from "@/store/useAuthStore"
import useCourseStore from "@/store/useCourseStore"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import * as z from "zod"

import { Category } from "@/types/category"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import ChipInput from "./ChipInput"
import Upload from "./Upload"

const formSchema = z.object({
  courseName: z.string().min(1, "Course Title is required"),
  courseDescription: z.string().min(1, "Course Description is required"),
  price: z.number().min(0, "Price must be a positive number"),
  category: z.string().min(1, "Course Category is required"),
  tag: z.array(z.string()).min(1, "At least one tag is required"),
  whatYouWillLearn: z.string().min(1, "Course benefits are required"),
  instructions: z
    .array(z.string())
    .min(1, "At least one requirement is required"),
  thumbnailImage: z.instanceof(File).optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function CourseInformationForm() {
  const [loading, setLoading] = useState(false)
  const [courseCategories, setCourseCategories] = useState([])
  const { token } = useAuthStore()
  const { course, editCourse, setCourse, setStep, setEditCourse } =
    useCourseStore()

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
  })

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true)
      const categories = await fetchCourseCategories()
      if (categories.length > 0) {
        setCourseCategories(categories)
      }
      setLoading(false)
    }

    if (editCourse) {
      form.reset({
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        price: course.price,
        category: course.category._id,
        tag: course.tag,
        whatYouWillLearn: course.whatYouWillLearn,
        instructions: course.instructions,
      })
    }
    getCategories()
  }, [editCourse, course, form])

  //handles next button click
  const onSubmit = async (data: FormValues) => {
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (key === "tag" || key === "instructions") {
          formData.append(key, JSON.stringify(value))
        } else if (key === "thumbnailImage" && value instanceof File) {
          formData.append("thumbnailImage", value)
        } else {
          formData.append(key, value.toString())
        }
      })

      if (editCourse) {
        formData.append("courseId", course._id)
        const result = await editCourseDetails(formData, token as string)
        if (result) {
          setEditCourse(false)
          setStep(2)
          setCourse(result)
        }
      } else {
        formData.append("status", COURSE_STATUS.DRAFT)
        const result = await addCourseDetails(formData, token as string)
        if (result) {
          setStep(2)
          setCourse(result)
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Failed to submit course information")
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-xl mb-4 font-bold">
        {editCourse ? "Edit Course Information" : "Create New Course"}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="courseName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Course Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="courseDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter Course Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter Course Price"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
                <FormLabel>Course Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courseCategories.map((category: Category) => (
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

          <FormField
            name="tag"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Tags</FormLabel>
                <FormControl>
                  <ChipInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter tags and press Enter"
                  />
                </FormControl>
                <FormDescription>
                  Enter tags and press Enter to add
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="whatYouWillLearn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Benefits</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter Course Benefits" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="instructions"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Requirements</FormLabel>
                <FormControl>
                  <ChipInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter requirements and press Enter"
                  />
                </FormControl>
                <FormDescription>
                  Enter requirements and press Enter to add
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="thumbnailImage"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Image</FormLabel>
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

          <div className="flex justify-between">
            {editCourse && (
              <Button variant="outline" onClick={() => setStep(2)}>
                Continue Without Saving
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                <>{editCourse ? "Save Changes" : "Next"}</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
