"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardData = exports.getProfile = exports.login = exports.signup = exports.getUsers = void 0;
const userService = __importStar(require("../services/userService"));
const getUsers = async (req, res) => {
    try {
        const users = await userService.getUsers();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};
exports.getUsers = getUsers;
const signup = async (req, res) => {
    const { name, email, password } = req.body;
    console.log('Controller: Received request to create user:', { email, name });
    try {
        const newUser = await userService.createUser(name, email, password);
        console.log('Controller: User created successfully:', newUser);
        res.status(201).json(newUser);
    }
    catch (error) {
        console.error('Controller: Error creating user:', error);
        res.status(500).json({
            error: "Failed to create user",
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await userService.loginUser(email, password);
        res.status(200).json({ message: "Login Successful", token, user });
    }
    catch (error) {
        res.status(401).json({ error: error instanceof Error ? error.message : 'Invalid credentials' });
    }
};
exports.login = login;
//Protected route example
const getProfile = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
        }
        res.status(200).json({ message: "Profile fetched successfully", user: req.user });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch profile" });
    }
};
exports.getProfile = getProfile;
const getDashboardData = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const userId = req.user.id;
        const dashboardData = await userService.getUserDashboardData(userId);
        res.status(200).json(dashboardData);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
};
exports.getDashboardData = getDashboardData;
//# sourceMappingURL=userController.js.map