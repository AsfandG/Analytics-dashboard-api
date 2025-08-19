import asyncHandler from "express-async-handler";

const createTransaction = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, message: "transaction created!" });
});

export { createTransaction };
