import express from "express";
import cors from "cors";
import productsRouter from "./routes/products.js";
import logger from "./middleware/logger.js"
import errorHandler from "./middleware/errorHandler.js";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import orderRoutes from "./routes/orderRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import path from "path";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

app.use(cors());
app.use(express.json());
app.use(
    "/uploads",
    express.static(path.join(process.cwd(), "uploads"))
);
app.use(logger);

connectDB();

app.use("/products", productsRouter);
app.use("/auth", authRouter);
app.use("/dashboard", dashboardRoutes);
app.use("/orders", orderRoutes);
app.use("/payments", paymentRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});