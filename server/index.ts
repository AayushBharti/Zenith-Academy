import cookieParser from "cookie-parser" // Import cookie parser
import cors from "cors" // Import CORS for cross-origin resource sharing
import dotenv from "dotenv" // Import dotenv to handle environment variables
import express, { Request, Response } from "express" // Import express and types for request/response

import fileUpload from "express-fileupload" // Import express-fileupload for handling file uploads

// Import database connection and cloudinary config
import { cloudnairyconnect } from "./config/cloudinary"
import { DBconnect } from "./config/database"
import contactRoutes from "./routes/ContactUs"
import CourseRoutes from "./routes/Course"
import paymentRoutes from "./routes/Payments"
import profileRoutes from "./routes/Profile"
// Import routes
import userRoutes from "./routes/User"

// Initialize express app
const app = express()

// Initialize dotenv configuration
dotenv.config()

// Get the port from environment variables, or use 5000 as default
const PORT: number = Number(process.env.PORT) || 5000

// Connect to the database
DBconnect()

// Middleware setup
app.use(express.json()) // For parsing application/json
app.use(cookieParser()) // For parsing cookies

// CORS setup to allow cross-origin requests
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // Allow CORS from specified origins
    credentials: true, // Enable credentials
    maxAge: 14400, // Cache pre-flight response for 4 hours
  })
)

// File upload configuration
app.use(
  fileUpload({
    useTempFiles: true, // Use temporary files
    tempFileDir: "/tmp", // Temporary file directory
  })
)

// Cloudinary connection setup
cloudnairyconnect()

// Define route handlers
app.use("/api/v1/auth", userRoutes) // User-related routes
app.use("/api/v1/payment", paymentRoutes) // Payment-related routes
app.use("/api/v1/profile", profileRoutes) // Profile-related routes
app.use("/api/v1/course", CourseRoutes) // Course-related routes
app.use("/api/v1/contact", contactRoutes) // Contact Us routes

// Simple GET route for testing
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the API", // Default message when accessing the root endpoint
  })
})

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
