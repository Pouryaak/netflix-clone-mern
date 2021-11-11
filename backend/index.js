import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/mongoose.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT || 5000;
// Let us to receive JSON in body
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Error Handlers Middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log("Server is running on port " + PORT));
