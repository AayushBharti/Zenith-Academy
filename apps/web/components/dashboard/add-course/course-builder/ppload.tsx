"use client"

import React, { useEffect, useState } from "react"
import { UploadIcon } from "lucide-react"
import { useDropzone } from "react-dropzone"

import { Button } from "@/components/ui/button"
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewSource, setPreviewSource] = useState<string>(
    viewData ?? editData ?? ""
  )

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setSelectedFile(file)
      previewFile(file)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: video
      ? { "video/*": [".mp4"] }
      : { "image/*": [".jpeg", ".jpg", ".png"] },
    onDrop,
    multiple: false,
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
    if (selectedFile) {
      setValue(name, selectedFile)
    }
  }, [selectedFile, setValue, name])

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label} {!viewData && <span className="text-destructive">*</span>}
      </Label>
      <div
        className={`flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dashed ${
          isDragActive ? "border-primary" : "border-muted-foreground"
        } ${isDragActive ? "bg-secondary" : "bg-background"}`}
        {...getRootProps()}
      >
        <input {...getInputProps()} id={name} />
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
                className="h-full w-full rounded-md max-h-[200px]"
              />
            )}
            {!viewData && (
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  setPreviewSource("")
                  setSelectedFile(null)
                  setValue(name, null)
                }}
                className="mt-3"
              >
                Remove {video ? "Video" : "Image"}
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center p-6 text-center">
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
        <p className="text-sm text-destructive">{label} is required</p>
      )}
    </div>
  )
}
