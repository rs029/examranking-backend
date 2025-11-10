import { Router } from "express"
//import { multer } from "multer"
//import { fs } from "fs"
import { submitByUrl } from "../services/submissionService"
import { authenticationToken } from "../middleware/authMiddleware"
import { submitUrl } from "../controllers/submissionController"

const router = Router()

// Submit by URL
router.post("/url", authenticationToken, submitUrl)

export default router