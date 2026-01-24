"use client";

import {
  CloudUpload,
  FileVideo,
  Image as ImageIcon,
  PlayCircle,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface UploadProps {
  name: string;
  label: string;
  register: any;
  setValue: any;
  errors: any;
  video?: boolean;
  viewData?: string | null;
  editData?: string | null;
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
  const [previewSource, setPreviewSource] = useState<string | null>(
    viewData || editData || null
  );

  // Register the field in react-hook-form
  useEffect(() => {
    register(name, { required: true });
  }, [register, name]);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      previewFile(file);
      setValue(name, file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: video
      ? { "video/*": [".mp4", ".mov", ".webm"] }
      : { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    onDrop,
    multiple: false,
    disabled: !!viewData, // Disable dropzone in view-only mode
  });

  // Generate a preview URL
  const previewFile = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setPreviewSource(objectUrl);

    // Cleanup memory when component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewSource(null);
    setValue(name, null);
  };

  return (
    <div className="space-y-3">
      <Label
        className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        htmlFor={name}
      >
        {label} {!viewData && <span className="text-destructive">*</span>}
      </Label>

      <div
        {...getRootProps()}
        className={cn(
          "relative flex min-h-[260px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-background transition-all duration-300 ease-in-out",
          isDragActive
            ? "scale-[1.01] border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-secondary/20",
          errors[name] && "border-destructive/50 bg-destructive/5",
          viewData ? "cursor-default border-border" : "cursor-pointer"
        )}
      >
        <input {...getInputProps()} id={name} />

        <AnimatePresence mode="wait">
          {previewSource ? (
            <motion.div
              animate={{ opacity: 1 }}
              className="relative flex h-full w-full items-center justify-center bg-black/5"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key="preview"
            >
              {/* --- MEDIA PREVIEW --- */}
              {video ? (
                <div className="group relative flex h-full min-h-[260px] w-full items-center justify-center bg-black">
                  <video
                    className="h-full max-h-[400px] w-full object-contain"
                    controls={!!viewData} // Only show native controls in view mode
                    src={previewSource}
                  />
                  {!viewData && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <PlayCircle className="h-16 w-16 text-white/50 transition-colors group-hover:text-white/80" />
                    </div>
                  )}
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt="Preview"
                  className="h-full min-h-[260px] w-full bg-black/80 object-contain"
                  src={previewSource}
                />
              )}

              {/* --- REMOVE BUTTON (Only if not viewData) --- */}
              {!viewData && (
                <motion.div
                  animate={{ opacity: 1 }}
                  className="absolute top-3 right-3 z-10"
                  initial={{ opacity: 0 }}
                >
                  <Button
                    className="h-8 w-8 rounded-full opacity-90 shadow-lg hover:opacity-100"
                    onClick={handleRemove}
                    size="icon"
                    type="button"
                    variant="destructive"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                </motion.div>
              )}

              {/* --- REPLACE OVERLAY (Only if not viewData) --- */}
              {!viewData && (
                <div className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/60 text-white opacity-0 transition-opacity duration-300 hover:opacity-100">
                  <CloudUpload className="mb-2 h-10 w-10" />
                  <span className="font-medium text-sm">
                    Click or drop to replace
                  </span>
                </div>
              )}
            </motion.div>
          ) : (
            /* --- UPLOAD PLACEHOLDER --- */
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center space-y-4 p-8 text-center"
              exit={{ opacity: 0, y: -10 }}
              initial={{ opacity: 0, y: 10 }}
              key="placeholder"
            >
              <div
                className={cn(
                  "rounded-full p-4 transition-colors duration-300",
                  isDragActive ? "bg-primary/20" : "bg-secondary"
                )}
              >
                {video ? (
                  <FileVideo
                    className={cn(
                      "h-8 w-8 transition-colors duration-300",
                      isDragActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                ) : (
                  <ImageIcon
                    className={cn(
                      "h-8 w-8 transition-colors duration-300",
                      isDragActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                )}
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-foreground text-sm">
                  {isDragActive
                    ? "Drop file here"
                    : `Click or drag ${video ? "video" : "image"} to upload`}
                </p>
                <p className="text-muted-foreground text-xs">
                  {video
                    ? "MP4, MOV, WEBM (Max 500MB)"
                    : "JPG, PNG, WEBP (16:9 recommended)"}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {errors[name] && (
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 font-medium text-[0.8rem] text-destructive"
          initial={{ opacity: 0, y: -5 }}
        >
          {label} is required
        </motion.p>
      )}
    </div>
  );
}
