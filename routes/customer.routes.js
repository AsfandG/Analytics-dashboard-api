import express from "express";
import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
} from "../controllers/customer.controller.js";

const router = express.Router();

router.post("/customer", createCustomer);
router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomer);
router.patch("/customers/:id", updateCustomer);
router.delete("/customers/:id", deleteCustomer);

export default router;
