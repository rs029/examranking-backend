"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDashboardData = exports.loginUser = exports.createUser = exports.getUsers = void 0;
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
const getUserDashboardData = async (userId) => {
    try {
        // Get user's recent exam attempts
        const recentAttempts = await prisma.examAttempt.findMany({
            where: { userId },
            include: {
                exam: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 5
        });
        // Get total calculations count
        const totalCalculations = await prisma.examAttempt.count({
            where: { userId }
        });
        // Get this month's calculations
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const thisMonthCalculations = await prisma.examAttempt.count({
            where: {
                userId,
                createdAt: { gte: startOfMonth }
            }
        });
        // Format recent activity
        const recentActivity = recentAttempts.map(attempt => ({
            exam: attempt.exam.name,
            date: formatDate(attempt.createdAt),
            rank: attempt.score ? `Score: ${attempt.score}` : 'N/A',
            score: attempt.score || 0,
            status: 'completed'
        }));
        // Calculate achievements based on user data
        const achievements = [
            {
                title: 'First Calculation',
                description: 'Completed your first rank calculation',
                earned: totalCalculations > 0
            },
            {
                title: 'Exam Explorer',
                description: 'Calculated ranks for 5+ different exams',
                earned: totalCalculations >= 5
            },
            {
                title: 'Consistent User',
                description: 'Used the platform for 30+ days',
                earned: false // This would need more complex logic based on first attempt date
            }
        ];
        return {
            stats: {
                totalCalculations,
                thisMonthCalculations
            },
            recentActivity,
            achievements
        };
    }
    catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw new Error('Failed to fetch dashboard data');
    }
};
exports.getUserDashboardData = getUserDashboardData;
// Helper function to format dates
const formatDate = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1)
        return '1 day ago';
    if (diffDays < 7)
        return `${diffDays} days ago`;
    if (diffDays < 14)
        return '1 week ago';
    if (diffDays < 30)
        return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
};
//# sourceMappingURL=userService.js.map