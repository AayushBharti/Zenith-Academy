/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from "dotenv";
import type { NextFunction, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

dotenv.config();

interface DecodedToken {
  id: string;
  email: string;
  accountType: string;
}

// Type guard to check if the decoded token is of type DecodedToken
function isDecodedToken(payload: JwtPayload | string): payload is DecodedToken {
  return (
    typeof payload !== "string" &&
    "id" in payload &&
    "email" in payload &&
    "accountType" in payload
  );
}

//auth
export const auth = async (req: any, res: Response, next: NextFunction) => {
  try {
    // Extract token from cookies, body, or headers
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorisation")?.replace("Bearer ", "");

    // If token is missing, return response
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    // Verify the token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET as string);

      // Use the type guard to check the payload type
      if (isDecodedToken(decode)) {
        req.user = decode; // Now TypeScript understands this is a DecodedToken
        console.log("decode = ", decode);
      } else {
        // If the token is not of expected type
        return res.status(401).json({
          success: false,
          message: "Token is invalid",
        });
      }
    } catch (err) {
      // Verification issue
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

//isStudent
export const isStudent = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user?.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Students only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};

//isInstructor
export const isInstructor = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user?.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Instructor only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};

//isAdmin
export const isAdmin = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (req.user?.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Admin only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};
