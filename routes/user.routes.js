import express from "express";
import {
  changePassword,
  loginUser,
  logout,
  refreshToken,
  registerUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.post("/refreshToken", refreshToken);
router.post("/change-password", auth, changePassword);

export default router;
