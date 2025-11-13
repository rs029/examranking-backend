import { Router } from "express"
//import { multer } from "multer"
//import { fs } from "fs"
import { submitByUrl, getUserHistory } from "../services/submissionService"
import { authenticationToken } from "../middleware/authMiddleware"
import { submitUrl, getHistory } from "../controllers/submissionController"

const router = Router()

// Submit by URL
router.post("/url", authenticationToken, submitUrl)
router.get("/history", authenticationToken, getHistory)

export default router