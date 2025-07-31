import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
dotenv.config();
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error-handler.js";
import { admin, auth } from "./middlewares/auth.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", auth, admin, (req, res) => {
  res.status(200).json({ message: "healty" });
});

app.use("/auth", userRoutes);

const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

startServer();

app.use(errorHandler);
