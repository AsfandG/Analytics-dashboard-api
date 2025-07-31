import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../utils/generate-token.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((field) => field?.trim() === "")) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required!" });
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    return res
      .status(400)
      .json({ success: false, message: "User already exist!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ name, email, password: hashedPassword });
  const refreshToken = generateAccessToken(user._id, user.role);
  user.refreshToken = refreshToken;
  await user.save();

  const accessToken = generateAccessToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: "User registered successfully!",
    accessToken,
  });
});

// Login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field?.trim() === "")) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required!" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ success: false, message: "User not found" });
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid credentials" });
  }

  const token = generateToken(user._id, user.role);
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
  res.status(200).json({ success: true, token });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", { httpOnly: true });

  res.status(200).json({ success: true, message: "User Logged Out!" });
});

export { registerUser, loginUser, logout };
