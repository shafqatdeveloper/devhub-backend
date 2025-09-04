import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import router from "./routes/auth/auth.js";

const app = express();

const CLIENT_ORIGIN = (process.env.CLIENT_URL || "").replace(/\/$/, "");

app.set("trust proxy", 1);

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (origin === CLIENT_ORIGIN) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// CORS must come BEFORE routes
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// DB
connectDB();

// Test API
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// API routes
app.use("/api", router);

// Start
app.listen(5001, () => {
  console.log("Server is running on port 5001");
});
