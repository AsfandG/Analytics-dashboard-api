import asyncHandler from "express-async-handler";
import Product from "../models/product.model.js";

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price } = req.body;

  const product = await Product.create({
    name,
    description,
    price,
    createdBy: req.user._id,
  });

  if (!product) {
    return res.status(400).json({
      success: false,
      message: "something went wrong while creating new product",
    });
  }

  res
    .status(201)
    .json({ success: true, message: "New product created", product });
});

const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find().skip(skip).limit(limit),
    Product.countDocuments(),
  ]);

  const totalPages = Math.ceil(total / limit);

  if (!products) {
    return res.status(404).json({
      success: false,
      message: "Products not found!",
    });
  }

  res.status(200).json({
    success: true,
    currentPage: page,
    totalPages,
    totalProducts: total,
    products,
  });
});

export { createProduct, getProducts };
