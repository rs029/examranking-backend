"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get("/", userController_1.getUsers);
router.post("/signup", userController_1.signup);
router.post("/login", userController_1.login);
//Protected route (needs JWT token in headers)
router.get("/profile", authMiddleware_1.authenticationToken, userController_1.getProfile);
router.get("/dashboard", authMiddleware_1.authenticationToken, userController_1.getDashboardData);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map