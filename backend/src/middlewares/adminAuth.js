import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const adminAuth = (req, res, next) => {
  try {
    // Check cookies first, then Authorization header
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new ApiError(401, "Token is required"));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check admin email
    if (decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return next(new ApiError(403, "Unauthorized access"));
    }

    next();
  } catch (error) {
    console.error("Admin Auth Error:", error.message);
    return next(new ApiError(401, "Invalid or expired token"));
  }
};

export default adminAuth;
