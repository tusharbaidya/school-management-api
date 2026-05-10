const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const schoolRoutes = require("./routes/schoolRoutes");
const { sendError } = require("./utils/response");

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ── Health Check ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "School Management API is running 🏫",
    version: "1.0.0",
    endpoints: {
      addSchool: "POST /addSchool",
      listSchools: "GET /listSchools?latitude={lat}&longitude={lon}",
    },
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/", schoolRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  sendError(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("[Global Error]", err);
  sendError(res, err.message || "Internal server error", err.statusCode || 500);
});

module.exports = app;
