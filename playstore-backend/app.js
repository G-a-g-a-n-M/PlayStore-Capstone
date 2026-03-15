const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

/* Middleware */

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/auth", authRoutes);
app.use("/api/apps", applicationRoutes);

/* Test Route */

app.get("/", (req, res) => {
  res.send("Play Store API running");
});

module.exports = app;