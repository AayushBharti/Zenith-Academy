import cloudinary from "cloudinary"

// Ensure the `v2` is imported for Cloudinary
const cloudinaryV2 = cloudinary.v2

interface UploadOptions {
  folder?: string
  height?: number
  quality?: string | number
  resource_type?: "image" | "video" | "raw" | "auto" // Restrict to allowed values
}

export const uploadImageToCloudinary = async (
  file: { tempFilePath: string },
  // Define the type for the `file` object
  folder: string,
  height?: number,
  quality?: string | number
) => {
  const options: UploadOptions = { folder }

  if (height) {
    options.height = height
  }
  if (quality) {
    options.quality = quality
  }
  options.resource_type = "auto"

  // Upload to Cloudinary using the provided file and options
  return await cloudinaryV2.uploader.upload(file.tempFilePath, options)
}
