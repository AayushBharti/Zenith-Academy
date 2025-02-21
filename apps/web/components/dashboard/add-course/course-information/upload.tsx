import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Upload as UploadIcon, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface UploadProps {
  onChange: (file: File | null) => void
  value: File | null
}

const Upload: React.FC<UploadProps> = ({ onChange, value }) => {
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (value instanceof File) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(value)
    } else {
      setPreview(null)
    }
  }, [value])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    onChange(file)
  }

  const handleRemove = () => {
    onChange(null)
    setPreview(null)
  }

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative">
          <Image
            src={preview}
            alt="Course thumbnail"
            width={1024}
            height={576}
            className="rounded-md object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6">
          <Input
            type="file"
            accept="image/*,.jpeg,.jpg,.png"
            onChange={handleFileChange}
            className="hidden"
            id="course-image-upload"
          />
          <label
            htmlFor="course-image-upload"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <div className="rounded-full bg-blue-100 p-4">
              <UploadIcon className="h-6 w-6 text-blue-600" />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Drag and drop an image, or click to browse
            </p>
          </label>
        </div>
      )}
      <div className="text-xs text-gray-500 space-y-1">
        <p>Aspect ratio 16:9</p>
        <p>Recommended size 1024x576</p>
      </div>
    </div>
  )
}

export default Upload
