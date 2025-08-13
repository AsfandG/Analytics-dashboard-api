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

  res.status(201).json({
    success: true,
    message: "Customer created successfully",
    customer: newCustomer,
  });
});

const getCustomers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  const sortBy = req.query.sortBy || "createdAt";
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

  const sortObj = {};
  sortObj[sortBy] = sortOrder;

  const [customers, total] = await Promise.all([
    Customer.find().skip(skip).limit(limit).sort(sortObj),
    Customer.countDocuments(),
  ]);

  const totalPages = Math.ceil(total / limit);

  if (!customers) {
    return res
      .status(404)
      .json({ success: false, message: "No customers exist" });
  }

  res.status(200).json({
    success: true,
    currentPage: page,
    totalPages,
    totalCustomers: total,
    customers,
  });
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
  const { name, email, phone, address } = req.body;
  const id = req.params.id;

  const updatedCustomer = await Customer.findByIdAndUpdate(
    id,
    { name, email, phone, address },
    { new: true }
  );

  if (!updatedCustomer) {
    return res.status(400).json({
      success: false,
      message: "something went wrong while updating customer!",
    });
  }

  res.status(200).json({ success: true, customer: updatedCustomer });
});

const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true },
    { new: true }
  );

  if (!customer) {
    return res
      .status(404)
      .json({ success: false, message: "Customer not found!" });
  }

  res.status(200).json({ success: true, message: "Customer soft deleted!" });
});

export {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
};
