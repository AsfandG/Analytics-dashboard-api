import asyncHandler from "express-async-handler";
import Product from "../models/product.model.js";

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, isService } = req.body;

  const product = await Product.create({
    name,
    description,
    price,
    isService,
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

  const search = req.query.search || "";
  const isService = req.query.isService;

  const filter = {
    ...(search && { name: { $regex: search, $options: "i" } }),
    ...(isService !== undefined && { isService: isService === "true" }),
  };

  const [products, total] = await Promise.all([
    Product.find(filter).skip(skip).limit(limit),
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

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "createdBy",
    "name email role avatar"
  );

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Products not found!",
    });
  }
  res.status(200).json({ success: true, product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!product) {
    return res.status(400).json({
      success: false,
      message: "something went wrong while updating product. Try Again!",
    });
  }

  res.status(200).json({ success: true, message: "product updated!", product });
});
const deleteProduct = asyncHandler(async (req, res) => {
  // TODO: Prevent deletion if the product exists in any invoice
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true },
    { new: true }
  );

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found!" });
  }

  res.status(200).json({ success: true, message: "Product soft deleted!" });
});

export { createProduct, getProducts, getProduct, updateProduct, deleteProduct };
