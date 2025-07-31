import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

const auth = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Please login to continue" });
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decodedToken;

  next();
});

// Admin middleware
const admin = asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Access denied. only admin can access this resource" });
  }

  next();
});

export { auth, admin };
