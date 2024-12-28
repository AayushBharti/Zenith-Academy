"use client"

import React, { useEffect, useState } from "react"
import {
  createSubSection,
  updateSubSection,
} from "@/services/courseDetailsService"
import { useAuthStore } from "@/store/useAuthStore"
import { useCourseStore } from "@/store/useCourseStore"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import Upload from "./Upload"

interface SubsectionModalProps {
  modalData: any
  setModalData: any
  add?: boolean
  edit?: boolean
  view?: boolean
}

const SubsectionModal: React.FC<SubsectionModalProps> = ({
  modalData,
  setModalData,
  add = false,
  edit = false,
  view = false,
}) => {
  const { token } = useAuthStore()
  const { course, setCourse } = useCourseStore()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm()

  useEffect(() => {
    if (view || edit) {
      setValue("lecture", modalData.title)
      setValue("lectureDesc", modalData.description)
      setValue("lectureVideo", modalData.videoUrl)
    }
  }, [view, edit, modalData, setValue])

  const isFormUpdated = () => {
    const currentValues = getValues()
    return (
      currentValues.lecture !== modalData.title ||
      currentValues.lectureDesc !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl
    )
  }

  const handleEditSubsection = async (data: any) => {
    const currentValues = getValues()
    const formData = new FormData()
    formData.append("SubsectionId", modalData._id)
    if (currentValues.lecture !== modalData.title) {
      formData.append("title", data.lecture)
    }
    if (currentValues.lectureDesc !== modalData.description) {
      formData.append("description", data.lectureDesc)
    }
    if (currentValues.lectureVideo !== modalData.videoUrl) {
      formData.append("videoFile", data.lectureVideo)
    }
    formData.append("courseId", course._id)

    const result = await updateSubSection(formData, token as string)
    if (result) {
      setCourse(result)
    }
    setModalData(null)
  }

  const onSubmit = async (data: any) => {
    if (view) return
    setLoading(true)
    try {
      if (edit) {
        if (!isFormUpdated()) {
          toast.error("No changes made")
        } else {
          await handleEditSubsection(data)
        }
      } else {
        const formData = new FormData()
        formData.append("sectionId", modalData)
        formData.append("title", data.lecture)
        formData.append("description", data.lectureDesc)
        formData.append("videoFile", data.lectureVideo)
        formData.append("courseId", course._id)

        const result = await createSubSection(formData, token as string)
        if (result) {
          setCourse(result)
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("An error occurred. Please try again.")
    } finally {
      setLoading(false)
      setModalData(null)
    }
  }

  return (
    <Dialog
      open={Boolean(modalData)}
      onOpenChange={() => !loading && setModalData(null)}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {view ? "Viewing" : add ? "Adding" : "Editing"} Lecture
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Upload
            name="lectureVideo"
            label="Lecture Video"
            register={register}
            setValue={setValue}
            errors={errors}
            video={true}
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}
          />
          <div className="space-y-2">
            <Label htmlFor="lecture">Lecture Title</Label>
            <Input
              id="lecture"
              placeholder="Enter Lecture Title"
              {...register("lecture", {
                required: "Lecture Title is required",
              })}
              disabled={view}
            />
            {errors.lecture && (
              <p className="text-sm text-destructive">
                {errors.lecture.message as string}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lectureDesc">Lecture Description</Label>
            <Textarea
              id="lectureDesc"
              placeholder="Enter Lecture Description"
              {...register("lectureDesc", {
                required: "Lecture Description is required",
              })}
              className="min-h-[130px]"
              disabled={view}
            />
            {errors.lectureDesc && (
              <p className="text-sm text-destructive">
                {errors.lectureDesc.message as string}
              </p>
            )}
          </div>
          {!view && (
            <Button type="submit" disabled={loading}>
              {loading ? "Loading..." : edit ? "Save Changes" : "Save"}
            </Button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default SubsectionModal
