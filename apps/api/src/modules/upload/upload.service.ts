import type { DeleteApiResponse } from "cloudinary";
import cloudinary from "@/configs/cloudinary";
import env from "@/configs/env";

export interface UploadOptions {
  folder: string;
  resource_type?: "image" | "video" | "raw" | "auto";
}

export interface CloudinaryUploadResult {
  url: string;
  public_id: string;
  size: number;
}

export const uploadToCloudinary = (
  buffer: Buffer,
  options: UploadOptions
): Promise<CloudinaryUploadResult> =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || env.FOLDER_NAME || "uploads",
        resource_type: options.resource_type || "auto",
      },
      (error, result) => {
        if (error || !result) {
          return reject(error);
        }
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          size: result.bytes,
        });
      }
    );

    stream.end(buffer);
  });

export const deleteFileFromCloudinary = (
  publicIds: string[]
): Promise<DeleteApiResponse> =>
  new Promise((resolve, reject) => {
    cloudinary.api.delete_resources(publicIds, (error, result) => {
      if (error || !result) {
        return reject(error);
      }
      resolve(result);
    });
  });
