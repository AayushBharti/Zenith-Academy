"use client"

import { useEffect, useRef, useState } from "react"
import { useCourseStore } from "@/store/useCourseStore"
import { Upload as UploadIcon } from "lucide-react"
import { useDropzone } from "react-dropzone"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface UploadProps {
  name: string
  label: string
  register: any
  setValue: any
  errors: any
  video?: boolean
  viewData?: string | null
  editData?: string | null
}

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}: UploadProps) {
  const { course } = useCourseStore()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewSource, setPreviewSource] = useState<string>(
    viewData ? viewData : editData ? editData : ""
  )
  const inputRef = useRef<HTMLInputElement>(null)

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      previewFile(file)
      setSelectedFile(file)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: !video
      ? { "image/*": [".jpeg", ".jpg", ".png"] }
      : { "video/*": [".mp4"] },
    onDrop,
  })

  const previewFile = (file: File) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSource(reader.result as string)
    }
  }

  useEffect(() => {
    register(name, { required: true })
  }, [register, name])

  useEffect(() => {
    setValue(name, selectedFile)
  }, [selectedFile, setValue, name])

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm text-richblack-5">
        {label} {!viewData && <span className="text-pink-200">*</span>}
      </Label>
      <div
        className={`flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dashed ${
          isDragActive ? "border-primary" : "border-muted-foreground"
        } ${isDragActive ? "bg-secondary" : "bg-background"}`}
        {...getRootProps()}
      >
        {previewSource ? (
          <div className="flex w-full flex-col p-6">
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <video
                src={previewSource}
                controls
                className="h-full w-full rounded-md"
              />
            )}
            {!viewData && (
              <Button
                type="button"
                variant="link"
                onClick={() => {
                  setPreviewSource("")
                  setSelectedFile(null)
                  setValue(name, null)
                }}
                className="mt-3 text-muted-foreground"
              >
                Cancel
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center p-6 text-center">
            <Input
              {...getInputProps()}
              ref={inputRef}
              id={name}
              className="sr-only"
            />
            <div className="mb-4 rounded-full bg-secondary p-2">
              <UploadIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="mb-2 text-sm text-muted-foreground">
              Drag and drop an {!video ? "image" : "video"}, or click to browse
            </p>
            <Button type="button" variant="secondary" size="sm">
              Select File
            </Button>
            <ul className="mt-4 flex list-disc justify-between space-x-12 text-xs text-muted-foreground">
              <li>Aspect ratio 16:9</li>
              <li>Recommended size 1024x576</li>
            </ul>
          </div>
        )}
      </div>
      {errors[name] && (
        <p className="text-xs text-destructive">{label} is required</p>
      )}
    </div>
  )
}
