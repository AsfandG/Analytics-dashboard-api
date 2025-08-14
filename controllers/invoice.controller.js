import asyncHandler from "express-async-handler";

const createInvoice = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true });
});

export { createInvoice };
