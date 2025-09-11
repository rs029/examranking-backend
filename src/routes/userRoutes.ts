import { Router } from "express"
import { getUsers, signup, login } from "../controllers/userController"

const router = Router()

router.get("/", getUsers)
router.post("/signup", signup)
router.post("/login", login)

export default router