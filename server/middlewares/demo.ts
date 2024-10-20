/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Response } from "express"

// Check if the user is a demo user
export const isDemo = async (req: any, res: Response, next: NextFunction) => {
  try {
    // Ensure that req.user exists and has an email property
    if (
      req.user &&
      (req.user?.email === "demoUser@gmail.com" ||
        req.user?.email === "demoIns@gmail.com")
    ) {
      return res.status(401).json({
        success: false,
        message: "This is a Demo User",
      })
    }
    // If the user is not a demo user, proceed to the next middleware
    next()
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Something went wrong while checking demo user",
    })
  }
}
