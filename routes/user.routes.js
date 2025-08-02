import express from "express";
import {
  changePassword,
  deleteUser,
  loginUser,
  logout,
  refreshToken,
  registerUser,
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

export default router;
