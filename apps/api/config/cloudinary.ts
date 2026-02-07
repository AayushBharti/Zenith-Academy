import cloudinary from "cloudinary";

// Define a helper function to validate required environment variables
const validateEnvVariables = (): boolean => {
  if (
    !(process.env.CLOUD_NAME && process.env.API_KEY && process.env.API_SECRET)
  ) {
    console.error(
      "Cloudinary configuration missing: CLOUD_NAME, API_KEY, and API_SECRET are required."
    );
    return false;
  }
  return true;
};

// Function to connect to Cloudinary
export const CloudinaryConnect = (): void => {
  try {
    // Validate environment variables before proceeding
    if (!validateEnvVariables()) {
      throw new Error("Missing required Cloudinary environment variables.");
    }

    // Cloudinary connection configuration
    cloudinary.v2.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    console.log("Cloudinary connected successfully.");
  } catch (error) {
    // Enhanced error logging
    console.error(
      "Error connecting to Cloudinary:",
      error instanceof Error ? error.message : error
    );
  }
};
