import express from "express" // Importing express and necessary types

import contactUs from "../controllers/ContactUs" // Import the controller that will handle the contact form logic

// Initialize the router
const router = express.Router()

/**
 * POST /contactUs
 * Route to handle the submission of the contact form.
 * This route will invoke the 'contactUs' controller to process the contact data.
 *
 * The contact form can include fields like email, name, and message.
 * This route expects the controller to handle business logic such as saving the data or sending emails.
 */
router.post("/contactUs", contactUs) // When a POST request is made to /contactUs, call the contactUs controller

// Export the router to use it in other parts of the application (e.g., app.ts)
export default router
