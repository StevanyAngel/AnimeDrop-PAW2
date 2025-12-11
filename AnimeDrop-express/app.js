import express from "express";
import api from "./routes/api.js";
import database from "./config/database.js";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", api);

// Start Server
app.listen("3000", () => {
  database();
  console.log("🚀 AnimeDrop API berjalan di : http://localhost:3000");
});
