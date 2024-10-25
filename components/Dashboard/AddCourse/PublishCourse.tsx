"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { COURSE_STATUS } from "@/data/constants"
import {
  addCourseToCategory,
  editCourseDetails,
} from "@/services/courseDetailsService"
import { useAuthStore } from "@/store/useAuthStore"
import { useCourseStore } from "@/store/useCourseStore"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"

const formSchema = z.object({
  public: z.boolean().default(false),
})

const PublishCourseForm = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { token } = useAuthStore()
  const { course, setEditCourse, setStep } = useCourseStore()
  const { toast } = useToast()

  // Use form hook with zod validation schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      public: course?.status === COURSE_STATUS.PUBLISHED,
    },
  })

  // Sync form values with course status
  useEffect(() => {
    if (course?.status === COURSE_STATUS.PUBLISHED) {
      form.setValue("public", true)
    }
  }, [course, form])

  const goBack = () => {
    setStep(2)
  }

  const goToMyCourses = () => {
    router.push("/dashboard/my-courses")
  }

  const handlePublish = async (data: z.infer<typeof formSchema>) => {
    if (
      (course?.status === COURSE_STATUS.PUBLISHED && data.public) ||
      (course?.status === COURSE_STATUS.DRAFT && !data.public)
    ) {
      goToMyCourses()
      setStep(1)
      setEditCourse(false)
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append("courseId", course._id)
      formData.append(
        "status",
        data.public ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT
      )

      const result = await editCourseDetails(formData, token as string)
      const addCourseCategory = await addCourseToCategory(
        { categoryId: course.category, courseId: course._id },
        token as string
      )

      if (result && addCourseCategory) {
        goToMyCourses()
        setStep(1)
        setEditCourse(false)
        toast({
          title: "Success",
          description: "Course published successfully",
        })
      } else {
        toast({ title: "Error", description: "Something went wrong" })
      }
    } catch (error) {
      console.error("Error publishing course:", error)
      toast({ title: "Error", description: "Failed to publish course" })
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    handlePublish(data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Publish Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="public"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Make this course public</FormLabel>
                    <FormDescription>
                      This will make your course visible to all users.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                disabled={loading}
              >
                Back
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default PublishCourseForm
