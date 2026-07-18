import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import morgan from "morgan";
import env from "./configs/env";
// Routes
import authRoutes from "./modules/auth/auth.routes";
import contactRoutes from "./modules/contact/contact.routes";
import courseRoutes from "./modules/course/course.routes";
import healthRoutes from "./modules/health/health.routes";
import paymentRoutes from "./modules/payment/payment.routes";
import profileRoutes from "./modules/profile/profile.routes";
import uploadRoutes from "./modules/upload/upload.routes"; // Import upload routes
// Middlewares
import { errorHandler } from "./shared/middlewares/error-handler";
import { notFoundHandler } from "./shared/middlewares/not-found-handler";
import { rateLimiter } from "./shared/middlewares/rate-limiter";

const app: Express = express();

// Apply the rate limiting middleware to all requests
app.use(rateLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(helmet());
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

app.use(mongoSanitize());

// ROUTES
app.get("/", (req: Request, res: Response) => {
  res.redirect("/api/v2/health");
});

app.use("/api/v2/auth", authRoutes);
app.use("/api/v2/course", courseRoutes);
app.use("/api/v2/payment", paymentRoutes);
app.use("/api/v2/profile", profileRoutes);
app.use("/api/v2/contact", contactRoutes);
app.use("/api/v2/health", healthRoutes);
app.use("/api/v2/upload", uploadRoutes);

// Not found handler (should be after routes)
app.use(notFoundHandler);

// Global error handler (should be last)
app.use(errorHandler);

export default app;
