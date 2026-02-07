import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import fileUpload from "express-fileupload";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";

// Configuration & DB
import { CloudinaryConnect } from "./config/cloudinary";
import { DBconnect } from "./config/database";
// Routes
import contactRoutes from "./routes/contact-us-route";
import courseRoutes from "./routes/course-route";
import paymentRoutes from "./routes/payments-route";
import profileRoutes from "./routes/profile-route";
import userRoutes from "./routes/user-route";

// --- 1. CONFIGURATION ---
dotenv.config();
const app: Express = express();
const PORT: number = Number(process.env.PORT) || 5000;

// Set the application to trust the reverse proxy
// app.set("trust proxy", 1);

// Connect to External Services
DBconnect();
CloudinaryConnect();

// --- 2. SECURITY MIDDLEWARE ---

// Helmet: Sets various HTTP headers for security (XSS, Clickjacking, etc.)
app.use(helmet());

// CORS: Restrict access to your frontend domain
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Rate Limiting: Prevent DDoS and brute-force attacks
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 250, // Limit each IP to 250 requests per windowMs
  message: "Too many requests from this IP, please try again after 10 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter); // Apply only to API routes

// Data Sanitization
app.use(mongoSanitize()); // Prevent NoSQL Injection
app.use(hpp()); // Prevent HTTP Parameter Pollution

// --- 3. STANDARD MIDDLEWARE ---

app.use(morgan("dev"));
app.use(compression());

// Parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// File Upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
    limits: { fileSize: 50 * 1024 * 1024 },
    abortOnLimit: true,
  })
);

// --- 4. ROUTES ---
app.use("/api/v2/auth", userRoutes);
app.use("/api/v2/payment", paymentRoutes);
app.use("/api/v2/profile", profileRoutes);
app.use("/api/v2/course", courseRoutes);
app.use("/api/v2/contact", contactRoutes);

// --- 5. HEALTH CHECK / ROOT ROUTE ---
app.get("/", (req: Request, res: Response) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: "Zenith Academy API is operational",
    timestamp: new Date().toISOString(),
    status: "OK",
    env: process.env.NODE_ENV,
  };

  res.status(200).json(healthCheck);
});

// --- 6. GLOBAL ERROR HANDLING ---

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`[Error]: ${err.message}`);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// --- 7. SERVER START & GRACEFUL SHUTDOWN ---
const server = app.listen(PORT, () => {
  console.log(`
  ################################################
  🛡️  Server listening on port: ${PORT} 🛡️
  ################################################
  `);
});

if (process.env.NODE_ENV === "production") {
  // Handle unhandled promise rejections (e.g., DB connection fail)
  process.on("unhandledRejection", (err: Error) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    server.close(() => process.exit(1));
  });

  // Handle graceful shutdown (e.g., Render spinning down)
  process.on("SIGTERM", () => {
    console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
    server.close(() => console.log("💥 Process terminated!"));
  });
}
