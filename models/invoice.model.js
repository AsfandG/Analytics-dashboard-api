import mongoose, { Schema } from "mongoose";

const invoiceItemsSchema = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
    taxPercent: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    lineTotal: {
      type: Number,
      required: true, //
    },
  },
  { _id: false }
);

const paymentSchema = new Schema(
  {
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now, required: true },
    method: { type: String, required: true },
    transactionId: { type: String },
  },
  { _id: false }
);

/* 
lineTotal is just the total amount for that single item line in your invoice.

Think of an invoice like this:

Item	Unit Price	Qty	Tax %	Discount	Line Total
Wireless Mouse	250	2	10	20	510

--------------------

For each item:

lineTotal=(unitPrice×qty)+taxAmount−discount
*/

const invoiceSchema = new Schema(
  {
    invoiceNo: {
      type: String,
      unique: true,
      trim: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [invoiceItemsSchema],
      validate: [
        (arr) => arr.length > 0,
        "Invoice must have at least one item",
      ],
    },
    subTotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    taxTotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountTotal: {
      type: Number,
      min: 0,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["draft", "sent", "paid", "partial", "overdue", "cancelled"],
      default: "draft",
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
    payments: {
      type: [paymentSchema],
      default: [],
    },
    attachments: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Generate auto invoice Number
invoiceSchema.pre("save", async function (next) {
  if (!this.invoiceNo) {
    const lastInvoice = await mongoose.model.Invoice.findOne({})
      .sort({ createdAt: -1 })
      .lean();
    const lastNumber = lastInvoice?.invoiceNumber
      ? parseInt(lastInvoice.invoiceNumber.replace("INV-", ""))
      : 0;

    this.invoiceNo = `INV-${lastNumber + 1}`;
  }

  let subTotal = 0;
  let taxTotal = 0;
  let discountTotal = 0;

  this.items.forEach((item) => {
    const lineSubTotal = item.unitPrice * item.qty;
    const lineTax = (lineSubTotal * item.taxPercent) / 100;

    subTotal += lineSubTotal;
    taxTotal += lineTax;
    discountTotal += item.discount || 0;
  });

  this.subTotal = subTotal;
  this.taxTotal = taxTotal;
  this.discountTotal = discountTotal;
  this.total = subTotal + taxTotal - discountTotal;

  next();
});
export default mongoose.model("Invoice", invoiceSchema);
