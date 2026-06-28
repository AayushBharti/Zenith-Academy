import express, { type Router } from "express";

import * as ContactController from "./controllers/contact.controller";

const router: Router = express.Router();

router.post("/contactUs", ContactController.contactUs);

export default router;
