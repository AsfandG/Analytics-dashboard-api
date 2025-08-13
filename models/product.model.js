import mongoose, { Schema } from "mongoose";
import generateSku from "../utils/generate-sku.js";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "product name is required"],
      trim: true,
      minLength: 3,
      maxLength: 50,
    },
    sku: {
      type: String,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 500,
    },
    price: {
      type: Number,
      required: true,
    },
    taxPercent: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "stock cannot be negative"],
    },
    isService: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

productSchema.index({ name: 1 });

productSchema.pre("save", async function (next) {
  if (!this.sku) {
    let newSku;
    let exists = true;
    while (exists) {
      newSku = generateSku();
      exists = await mongoose.models.Product.exists({ sku: newSku });
    }

    this.sku = newSku;
  }
  next();
});

export default mongoose.model("Product", productSchema);
