import express from "express";
import {
  loginUser,
  logout,
  registerUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);

export default router;
