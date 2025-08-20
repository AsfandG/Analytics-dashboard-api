import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Transaction from "../models/transaction.model.js";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

export const createTransaction = asyncHandler(async (req, res) => {
  // const session = await mongoose.startSession();
  // session.startTransaction();

  try {
    const {
      customer,
      products,
      paymentMethod,
      status,
      transactionDate,
      tax,
      discount,
      notes,
    } = req.body;

    const foundCustomer = await Customer.findById(customer);
    if (!foundCustomer) {
      return res.status(400).json({
        success: false,
        message: "Customer not found",
      });
    }

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Transaction must have at least one product",
      });
    }

    // 2️ Validate products & handle stock
    const validatedProducts = [];
    for (const item of products) {
      const { product: productId, quantity, price } = item;

      const productDoc = await Product.findById(productId);
      if (!productDoc) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${productId} not found`,
        });
      }

      // Optional: stock check
      if (productDoc.stock !== undefined && productDoc.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for product: ${productDoc.name}`,
        });
      }

      // decrement stock if tracking
      if (productDoc.stock !== undefined) {
        productDoc.stock -= quantity;
        await productDoc.save();
      }

      validatedProducts.push({
        product: productDoc._id,
        quantity,
        price,
      });
    }

    const transaction = new Transaction({
      customer: foundCustomer._id,
      products: validatedProducts,
      paymentMethod,
      status,
      transactionDate,
      tax,
      discount,
      notes,
    });

    await transaction.save();

    // await session.commitTransaction();
    // session.endSession();

    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();
    res.status(400).json({ success: false, message: error.message });
  }
});

export const getAllTransactions = asyncHandler(async (req, res) => {
  const status = req.query.status || "";
  const filter = {};
  if (status) {
    filter.status = status;
  }
  const [transactions, total] = await Promise.all([
    Transaction.find(filter),
    Transaction.countDocuments(filter),
  ]);

  if (!transactions || transactions.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No transactions found!",
    });
  }

  res.status(200).json({ success: true, total, transactions });
});
