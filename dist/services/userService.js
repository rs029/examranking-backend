"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.createUser = exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const getUsers = () => {
    return prisma.user.findMany();
};
exports.getUsers = getUsers;
const createUser = async (name, email, password) => {
    //check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error("User with this email already exists");
    }
    //hash password
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    //create user
    try {
        console.log('UserService: Creating user with:', { name, email, password });
        const result = await prisma.user.create({
            data: { name, email, password: hashedPassword, },
        });
        console.log('UserService: User created successfully:', result);
        return result;
    }
    catch (error) {
        console.error('UserService: Error creating user:', error);
        throw error;
    }
};
exports.createUser = createUser;
const loginUser = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
        throw new Error("Invalid email or password");
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid)
        throw new Error("Invalid email or password");
    //Generate JWT
    const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || "supersecretkey", //keep secret in env variable
    { expiresIn: '1h' });
    return { token, user };
};
exports.loginUser = loginUser;
//# sourceMappingURL=userService.js.map