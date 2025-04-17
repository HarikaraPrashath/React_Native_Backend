import express from "express";
import "dotenv/config";
import { connectDB } from "./src/lib/dbConfig.js";
import cors from "cors";
import path from "path"; // Add path for static file serving (if needed)

import authRoutes from "./src/routes/authRoutes.js";
import bookRoutes from "./src/routes/bookRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests (important for POST requests)
app.use(express.json());
app.use(cors());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

// Root route to check if the server is running
app.get("/", (req, res) => {
  res.send("Backend is up and running!");
});

// DB connection and server startup
app.listen(PORT, () => {
    console.log("Server is running on PORT", PORT);
    connectDB().then(() => {
        console.log("Database connected successfully.");
    }).catch((err) => {
        console.error("Database connection failed:", err);
    });
});
