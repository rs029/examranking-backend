import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export const getUsers = () => {
    return prisma.user.findMany()
}

export const createUser = async (name: string, email: string, password:string) => {

    //check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
        throw new Error("User with this email already exists")
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    //create user
    try {
        console.log('UserService: Creating user with:', { name, email, password })
        const result = await prisma.user.create({
            data: { name, email, password: hashedPassword, },
        })
        console.log('UserService: User created successfully:', result)
        return result
    } catch (error) {
        console.error('UserService: Error creating user:', error)
        throw error
    }
}

export const loginUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) throw new Error("Invalid email or password")

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) throw new Error("Invalid email or password")

    //Generate JWT
    const token = jwt.sign(
        {userId: user.id, email: user.email}, 
        process.env.JWT_SECRET || "supersecretkey", //keep secret in env variable
        {expiresIn: '1h'})

    return { token, user }
}

export const getUserDashboardData = async (userId: number) => {
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
        })

        // Get total exams taken
        const totalExamsTaken = await prisma.examAttempt.count({ 
            where: { userId } 
        })

        // Get this month's calculations
        const startOfMonth = new Date()
        startOfMonth.setDate(1)
        startOfMonth.setHours(0, 0, 0, 0)

        const thisMonthCalculations = await prisma.examAttempt.count({
            where: {
                userId,
                createdAt: { gte: startOfMonth }
            }
        })

        // Format recent activity with rank calculation
        const recentActivity = await Promise.all(
            recentAttempts.map(async (attempt) => {
                let rank: number | null = null
                
                // Calculate rank for this attempt only if score exists
                if (attempt.score !== null) {
                    const higherCount = await prisma.examAttempt.count({
                        where: {
                            examId: attempt.examId,
                            score: { gt: attempt.score }
                        }
                    })
                    rank = higherCount + 1
                }

                return {
                    exam: attempt.exam.name,
                    date: formatDate(attempt.createdAt),
                    rank: rank ? `#${rank}` : 'N/A',
                    score: attempt.score || 0,
                    status: 'completed'
                }
            })
        )

        // Calculate achievements based on user activity
        const achievements = [
            {
                title: "First Calculation",
                description: "Completed your first exam rank calculation!",
                earned: totalExamsTaken >= 1
            },
            {
                title: "Exam Explorer",
                description: "Tried out 5 different exams.",
                earned: totalExamsTaken >= 5
            },
            {
                title: "Consistent User",
                description: "Used the platform for 30+ days.",
                earned: false
            }
        ]

        return {
            stats: {
                totalCalculations: totalExamsTaken,
                thisMonthCalculations
            },
            recentActivity,
            achievements
        }
    } catch (error) {
        console.error("Error fetching dashboard data:", error)
        throw new Error("Failed to fetch dashboard data")
    }
}

// Helper function to format date
const formatDate = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Hours ago'
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 14) return '1 week ago'
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
}