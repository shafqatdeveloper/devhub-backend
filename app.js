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
  "http://localhost:3000",
  "https://devhub-shafqatdevelopers-projects.vercel.app",
  "https://devhub-one-tau.vercel.app",
  "https://devhub-git-main-shafqatdevelopers-projects.vercel.app",
  "https://devhub-98022u1pl-shafqatdevelopers-projects.vercel.app",
]

// optional: allow any preview under devhub-one-tau-*.vercel.app
const vercelPreviewRegex = /^https:\/\/devhub-one-tau-[a-z0-9-]+\.vercel\.app$/i

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true) // allow server-to-server or same-origin
    if (allowedOrigins.includes(origin) || vercelPreviewRegex.test(origin)) {
      return cb(null, true)
    }
    return cb(new Error(`Not allowed by CORS: ${origin}`))
  },
  credentials: true,
}))

app.set('trust proxy', 1)


connectDB()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api', router)

app.listen(5001, () => {
  console.log('Server is running on port 5001')
})
