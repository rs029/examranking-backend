import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import userRoutes from './routes/userRoutes'
import examRoutes from './routes/examRoutes'

dotenv.config()
const app = express()
const prisma = new PrismaClient()

app.use(cors({
    origin: [
        'http://localhost:3000', 
        'https://exam-ranking.vercel.app'
    ],
    credentials: true
}))
app.use(express.json())

//root test
app.get("/", (req, res) => {
    res.send("Backend is running")
})

//db test
// app.get("/users", async(req, res) => {
//     const users = await prisma.user.findMany()
//     res.json(users)
// })

// attach API routes
app.use("/api/users", userRoutes)
app.use("/api/exams", examRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
