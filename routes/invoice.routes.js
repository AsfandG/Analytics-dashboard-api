import express from "express";
import { createInvoice } from "../controllers/invoice.controller.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/invoice", auth, createInvoice);

export default router;
