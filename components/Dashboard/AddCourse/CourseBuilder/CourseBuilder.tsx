"use client"

import React, { useState } from "react"
import { createSection, updateSection } from "@/services/courseDetailsService"
import { useAuthStore } from "@/store/useAuthStore"
import { useCourseStore } from "@/store/useCourseStore"
import { ChevronRight, Plus } from "lucide-react"
import { useForm } from "react-hook-form"

import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import NestedView from "./NestedView"

type FormData = {
  sectionName: string
}

const CourseBuilderForm = () => {
  const { token } = useAuthStore()
  const { course, setCourse, setEditCourse, setStep } = useCourseStore()
  const { toast } = useToast()
  const [editSectionName, setEditSectionName] = useState<string | false>(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>()

  const goNext = () => {
    if (course.courseContent.length > 0) {
      if (
        course.courseContent.some(
          (section: any) => section.subSection.length > 0
        )
      ) {
        setStep(3)
      } else {
        toast({
          title: "Error",
          description: "Please add at least one section to continue",
          variant: "destructive",
        })
        return
      }
    } else {
      toast({
        title: "Error",
        description: "Please add at least one section to continue",
        variant: "destructive",
      })
    }
  }

  const onSubmit = async (data: FormData) => {
    let result = null
    setLoading(true)
    if (editSectionName) {
      result = await updateSection(
        {
          sectionName: data.sectionName,
          courseId: course._id,
          sectionId: editSectionName,
        },
        token as string
      )
    } else {
      result = await createSection(
        {
          sectionName: data.sectionName,
          courseId: course._id,
        },
        token as string
      )
    }
    if (result) {
      setCourse(result)
      setValue("sectionName", "")
      setEditSectionName(false)
    }
    setLoading(false)
  }

  const handleChangeEditSectionName = (
    sectionId: string,
    sectionName: string
  ) => {
    if (editSectionName === sectionId) {
      setEditSectionName(false)
      setValue("sectionName", "")
      return
    }
    setEditSectionName(sectionId)
    setValue("sectionName", sectionName)
  }

  return (
    <div className="bg-card text-card-foreground">
      <div className="text-xl mb-4 font-bold">Course Builder</div>

      <div className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sectionName">
              Section Name<span className="text-destructive">*</span>
            </Label>
            <Input
              id="sectionName"
              placeholder="Add a section to build your course"
              {...register("sectionName", {
                required: "This field is required",
              })}
            />
            {errors.sectionName && (
              <p className="text-sm text-destructive">
                {errors.sectionName.message}
              </p>
            )}
          </div>
          <div className="flex items-center gap-x-4">
            <Button type="submit" disabled={loading}>
              <Plus className="mr-2 h-4 w-4" />
              {editSectionName ? "Edit Section Name" : "Create Section"}
            </Button>
            {editSectionName && (
              <Button
                variant="ghost"
                onClick={() => {
                  setEditSectionName(false)
                  setValue("sectionName", "")
                }}
              >
                Cancel Edit
              </Button>
            )}
          </div>
        </form>

        {course?.courseContent?.length > 0 && (
          <NestedView
            handleChangeEditSectionName={handleChangeEditSectionName}
          />
        )}

        <div className="flex justify-end gap-x-3">
          <Button
            variant="outline"
            onClick={() => {
              setEditCourse(true)
              setStep(1)
            }}
          >
            Back
          </Button>
          <Button onClick={goNext}>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CourseBuilderForm
