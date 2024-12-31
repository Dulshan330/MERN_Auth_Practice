import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import path from "path";

const __dirname = path.resolve();

// Configure dotenv to use environment variables
dotenv.config();

// Initialize an Express application
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json()); // allow us to parse incoming requests :req.body
app.use(cookieParser()); // allow us to parse incoming cookies

// deployment configuration
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// Start the server on port 5000 and connect to the database
app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on", PORT);
});

app.use("/api/auth", authRoutes);

