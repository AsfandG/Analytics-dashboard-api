import asyncHandler from "express-async-handler";
import Customer from "../models/customer.model.js";

const createCustomer = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  const { name, email, phone, address } = req.body;

  if (email) {
    const existingCustomer = await Customer.findOne({
      email,
      createdBy: req.user._id,
    });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: "Customer with this email already exists",
      });
    }
  }

  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "customer name is required" });
  }

  const newCustomer = await Customer.create({
    name,
    email,
    phone,
    address,
    createdBy: req.user._id,
  });

  res.status(200).json({
    success: true,
    message: "Customer created successfully",
    customer: newCustomer,
  });
});

const getCustomers = asyncHandler(async (req, res) => {
  const [customers, total] = await Promise.all([
    Customer.find(),
    Customer.countDocuments(),
  ]);

  if (!customers) {
    return res
      .status(404)
      .json({ success: false, message: "No customers exist" });
  }

  res.status(200).json({ success: true, total, customers });
});

const getCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    return res
      .status(404)
      .json({ success: false, message: "Customer not found!" });
  }

  res.status(200).json({ success: true, customer });
});

const updateCustomer = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true });
});
const deleteCustomer = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true });
});

export {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
};
