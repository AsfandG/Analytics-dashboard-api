import asyncHandler from "express-async-handler";

const createCustomer = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true });
});

const getCustomers = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true });
});
const getCustomer = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true });
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
