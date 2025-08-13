import express from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import { admin, auth } from "../middlewares/auth.js";
const router = express.Router();

router.post("/product", auth, admin, createProduct);
router.get("/products", getProducts);
router.get("/products/:id", getProduct);
router.patch("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;
