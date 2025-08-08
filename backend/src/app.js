import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
import { errorMiddleware } from "./utils/ApiError.js";
dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));

);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); //for static files
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Api is running");
});
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);

app.use(errorMiddleware);
export default app;
