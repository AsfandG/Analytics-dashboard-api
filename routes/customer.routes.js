import express from "express";
import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
} from "../controllers/customer.controller.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/customer", auth, createCustomer);
router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomer);
router.patch("/customers/:id", auth, updateCustomer);
router.delete("/customers/:id", auth, deleteCustomer);

export default router;
