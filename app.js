// server.js
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/auth/auth.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

// ----- CORS (CLEAN + CORRECT) -----
const whitelist = new Set([
  "http://localhost:3000",
  "https://devhub-one-tau.vercel.app",
  "https://devhub-shafqatdevelopers-projects.vercel.app",
  "https://devhub-git-main-shafqatdevelopers-projects.vercel.app",
  "https://devhub-98022u1pl-shafqatdevelopers-projects.vercel.app",
]);

const corsOptions = {
  credentials: true,
  origin(origin, cb) {
    // Allow server-to-server/SSR/no-origin requests
    if (!origin) return cb(null, true);
    if (whitelist.has(origin) || /^https:\/\/devhub-one-tau.*\.vercel\.app$/.test(origin)) {
      return cb(null, true);
    }
    return cb(new Error("Not allowed by CORS"));
  },
};

app.use((req, res, next) => {
  // Ensure caches/CDNs don't mix responses for different origins
  res.header("Vary", "Origin");
  next();
});

app.use(cors(corsOptions));
// Preflight
app.options(/\*/, cors(corsOptions));

// Trust proxy for secure cookies on Vercel/behind proxies
app.set("trust proxy", 1);

// ----- DB & Routes -----
connectDB();

app.get("/", (req, res) => res.send("API is up ✅"));

app.use("/api/auth", authRouter);

// ----- Start -----
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
