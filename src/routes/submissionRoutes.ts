import { Router } from "express"
//import { multer } from "multer"
//import { fs } from "fs"
import { submitByUrl } from "../services/submissionService"

const router = Router()

// Submit by URL
router.post("/url", async (req, res) => {
    try {
        const { userId, examId, url } = req.body
        const result = await submitByUrl(Number(userId), Number(examId), url)
        res.json(result)
    } catch (err) {
        res.status(500).json({ error: "Internal server error" })
    }
})