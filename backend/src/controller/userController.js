import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/userModel.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//route for register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if ([name, email, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }
  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }
  if (!email.includes("@")) {
    throw new ApiError(400, "Invalid email format");
  }
  const normalizedEmail = email.toLowerCase();
  const existedUser = await User.findOne({ email: normalizedEmail });
  if (existedUser) {
    throw new ApiError(400, "User already exists");
  }
  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
  });
  const registeredUser = await User.findById(user._id).select("-password");
  if (!registeredUser) {
    throw new ApiError(404, "User not found");
  }
  const token = generateToken(user._id);
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("token", token, options)
    .json(
      new ApiResponse(200, "User registered successfully", {
        user: registeredUser,
        token,
      })
    );
});
//route for login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if ([email, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }
  const normalizedEmail = email.toLowerCase();
  const existedUser = await User.findOne({ email: normalizedEmail });
  if (!existedUser) {
    throw new ApiError(404, "User not found");
  }
  const passwordCorrect = await existedUser.isPasswordCorrect(password);
  if (!passwordCorrect) {
    throw new ApiError(400, "Invalid email or password");
  }
  const token = generateToken(existedUser._id);
  const options = {
    httpOnly: true,
    secure: true,
  };
  const loggedInUser = await User.findById(existedUser._id).select("-password");
  return res
    .status(200)
    .cookie("token", token, options)
    .json(
      new ApiResponse(200, "User logged in successfully", {
        user: loggedInUser,
        token,
      })
    );
});

// route for admin login
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    throw new ApiError(401, "Invalid admin credentials");
  }

  // Sign with an object, not just a string
  const token = jwt.sign(email + password, process.env.JWT_SECRET);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("token", token, options)
    .json(new ApiResponse(200, { token }, "Admin logged in successfully"));
});

export { registerUser, loginUser, adminLogin };
