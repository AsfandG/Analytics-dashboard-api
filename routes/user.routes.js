import express from "express";
import {
  changePassword,
  deleteUser,
  forgetPassword,
  getUsers,
  loginUser,
  logout,
  refreshToken,
  registerUser,
  resetPassword,
  verifyEmail,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { admin, auth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.post("/refreshToken", refreshToken);
router.post("/change-password", auth, changePassword);
router.delete("/delete-user/:id", auth, admin, deleteUser);
router.get("/users", auth, getUsers);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/verify-email/:token", verifyEmail);

export default router;
