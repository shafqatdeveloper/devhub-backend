import express from 'express'
import { connectDB } from './config/db.js'
import 'dotenv/config'
import router from './routes/auth/auth.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cookieParser())
const allowedOrigins = [
  "*",
  "http://localhost:3000",
  "https://devhub-shafqatdevelopers-projects.vercel.app",
  "https://devhub-one-tau.vercel.app",
  "https://devhub-git-main-shafqatdevelopers-projects.vercel.app",
  "https://devhub-98022u1pl-shafqatdevelopers-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        /^https:\/\/devhub-one-tau.*\.vercel\.app$/.test(origin)
      ) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.set("trust proxy", 1);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

connectDB()


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/api",router)

app.listen(5001, () => {
  console.log('Server is running on port 5001')
})
