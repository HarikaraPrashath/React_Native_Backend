import express from "express";
import "dotenv/config";
import { connectDB } from "./src/lib/dbConfig.js";
import cors from "cors"

import authRoutes from "./src/routes/authRoutes.js";
import bookRoutes from "./src/routes/bookRoutes.js";


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests (important for POST requests)

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.listen(PORT, () => {
    console.log("Server is running on PORT", PORT);
    connectDB();
});
