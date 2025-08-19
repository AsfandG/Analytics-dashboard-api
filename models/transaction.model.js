import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        total: {
          type: Number,
          required: true,
        },
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["cash", "paypal", "credit_card", "debit_card"],
      default: "cash",
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded", "cancelled"],
      default: "pending",
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

transactionSchema.pre("save", function (next) {
  this.products.forEach((item) => {
    item.total = item.price * item.quantity;
  });

  this.subTotal = this.products.reduce((sum, item) => sum + item.total, 0);
  this.grandTotal = this.subTotal + (this.tax || 0) - (this.discount || 0);

  next();
});

export default mongoose.model("Transaction", transactionSchema);
