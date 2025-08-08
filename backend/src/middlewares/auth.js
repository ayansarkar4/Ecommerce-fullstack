import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

const authUser = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new ApiError(401, "Token is required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return next(new ApiError(401, "Invalid Token"));
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error("User Auth Error:", error.message);
    return next(new ApiError(401, "Invalid or expired token"));
  }
};

export default authUser;
