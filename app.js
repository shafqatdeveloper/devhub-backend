import express from 'express'
import { connectDB } from './config/db.js'
import 'dotenv/config'
import router from './routes/auth/auth.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

connectDB()


// Test API
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// API routes
app.use("/api",router)

app.listen(5001, () => {
  console.log('Server is running on port 5001')
})
