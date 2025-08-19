import express from "express";
import { auth } from "../middlewares/auth.js";
import { createTransaction } from "../controllers/transaction.controller.js";

const router = express.Router();

router.post("/transaction", auth, createTransaction);

export default router;
