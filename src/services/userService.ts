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