import express from "express";
import {
  createProduct,
  getProducts,
} from "../controllers/product.controller.js";
import { admin, auth } from "../middlewares/auth.js";
const router = express.Router();

router.post("/product", auth, admin, createProduct);
router.get("/products", getProducts);

export default router;
