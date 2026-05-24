import { v2 } from "cloudinary";
import env from "./env";

v2.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const cloudinary = v2;

export default cloudinary;
