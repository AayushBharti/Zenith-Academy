"use client";

import { CloudUpload, Image as ImageIcon, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface UploadProps {
  onChange: (file: File | null) => void;
  value: File | string | null;
}

const Upload: React.FC<UploadProps> = ({ onChange, value }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle Preview Generation
  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }

    // If it's a string (URL from DB), use it directly
    if (typeof value === "string") {
      setPreview(value);
    }
    // If it's a File object, create a temporary URL
    else if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);

      // Cleanup memory when component unmounts or file changes
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleFile = (file: File) => {
    // Basic validation for image types
    if (file && file.type.startsWith("image/")) {
      onChange(file);
    }
  };

  // --- Drag & Drop Handlers ---
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the click handler of the container
    onChange(null);
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = ""; // Reset input so same file can be selected again
    }
  };

  return (
    <div className="w-full space-y-2">
      <div
        className={cn(
          "group relative flex min-h-[250px] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-input/30 transition-all duration-300 ease-in-out",
          isDragOver
            ? "scale-[1.01] border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30",
          preview ? "border-none p-0" : "p-6"
        )}
        onClick={() => inputRef.current?.click()}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          accept="image/png, image/jpeg, image/jpg, image/webp"
          className="hidden"
          onChange={handleFileChange}
          ref={inputRef}
          type="file"
        />

        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              animate={{ opacity: 1 }}
              className="relative aspect-video h-full w-full"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key="preview"
            >
              {/* Image */}
              <Image
                alt="Course thumbnail"
                className="rounded-xl object-cover"
                fill
                src={preview}
              />

              {/* Overlay for Remove Button */}
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/0 transition-colors duration-300 group-hover:bg-black/40">
                <button
                  className="scale-90 rounded-full bg-destructive/90 p-3 text-white opacity-0 shadow-lg transition-all duration-300 hover:bg-destructive group-hover:scale-100 group-hover:opacity-100"
                  onClick={handleRemove}
                  type="button"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center space-y-4 text-center"
              exit={{ opacity: 0, y: -10 }}
              initial={{ opacity: 0, y: 10 }}
              key="upload-ui"
            >
              <div
                className={cn(
                  "rounded-full p-4 transition-colors duration-300",
                  isDragOver ? "bg-primary/20" : "bg-secondary"
                )}
              >
                <CloudUpload
                  className={cn(
                    "h-8 w-8 transition-colors duration-300",
                    isDragOver ? "text-primary" : "text-muted-foreground"
                  )}
                />
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-foreground text-sm">
                  {isDragOver
                    ? "Drop image here"
                    : "Click to upload or drag and drop"}
                </p>
                <p className="text-muted-foreground text-xs">
                  SVG, PNG, JPG or WEBP (max. 800x400px)
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Helper text outside the dropzone */}
      {!preview && (
        <div className="flex items-center justify-between px-1 text-muted-foreground text-xs">
          <span className="flex items-center gap-1">
            <ImageIcon className="h-3 w-3" />
            Aspect ratio 16:9 recommended
          </span>
        </div>
      )}
    </div>
  );
};

export default Upload;
