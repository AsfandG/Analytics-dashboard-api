import mongoose, { Schema } from "mongoose";

const customerSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Customer name is required!"],
      trim: true,
      minlength: [2, "Name must be at least 10 characters long"],
      maxlength: [20, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[0-9]{7,15}$/, "Please provide a valid phone number"], // allows + and 7-15 digits
    },
    address: {
      type: String,
      trim: true,
      maxlength: [200, "Address cannot exceed 200 characters"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

customerSchema.index({ name: 1 });
customerSchema.index({ email: 1 });

export default mongoose.model("Customer", customerSchema);
