import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  createTransaction,
  getAllTransactions,
} from "../controllers/transaction.controller.js";

const router = express.Router();

router.post("/transaction", auth, createTransaction);
router.get("/transactions", auth, getAllTransactions);

export default router;
