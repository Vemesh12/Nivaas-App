const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const env = require("./config/env");
const { notFound, errorHandler } = require("./middleware/error.middleware");

const app = express();
const allowedOrigins = env.corsOrigin.split(",").map((origin) => origin.trim()).filter(Boolean);

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("Not allowed by CORS"));
  }
}));
app.use(express.json({ limit: env.jsonBodyLimit }));
app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ success: true, message: "Nivaas API is healthy", errors: [] }));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/communities", require("./routes/community.routes"));
app.use("/api/posts", require("./routes/post.routes"));
app.use("/api/notices", require("./routes/notice.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/admin", require("./routes/admin.routes"));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
