import express, { type Router } from "express";
import { detailedHealthCheck, healthCheck } from "./health.controller";

const router: Router = express.Router();

router.get("/", healthCheck);
router.get("/detailed", detailedHealthCheck);

export default router;
