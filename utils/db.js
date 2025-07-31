import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connection successful ");
  } catch (error) {
    console.log("connection failed ", error.message);
    process.exit(1);
  }
};

export default connectDB;
