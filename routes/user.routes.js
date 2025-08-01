import express from "express";
import {
  loginUser,
  logout,
  refreshToken,
  registerUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.post("/refreshToken", refreshToken);

export default router;
