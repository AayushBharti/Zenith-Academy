// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request } from "express"
import { UploadedFile } from "express-fileupload"

// Extend the Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        accountType: string
      }
      files?: {
        thumbnailImage?: UploadedFile
        videoFile?: UploadedFile
      }
    }
  }
}
