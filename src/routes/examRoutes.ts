import { Router } from "express"
import { getExams, getExam } from "../controllers/examController"

const router = Router()
router.get("/", getExams)
router.get("/:id", getExam)

export default router

