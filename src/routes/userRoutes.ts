import { Router } from "express"
import { getUsers, signup, login, getProfile } from "../controllers/userController"
import { authenticationToken } from "../middleware/authMiddleware"

const router = Router()

router.get("/", getUsers)
router.post("/signup", signup)
router.post("/login", login)

//Protected route (needs JWT token in headers)
router.get("/profile", authenticationToken, getProfile)

export default router