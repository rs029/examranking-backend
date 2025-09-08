import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const getUsers = () => {
    return prisma.user.findMany()
}

export const createUser = async (email: string, name: string) => {
    try {
        console.log('UserService: Creating user with:', { email, name })
        const result = await prisma.user.create({
            data: { email, name }
        })
        console.log('UserService: User created successfully:', result)
        return result
    } catch (error) {
        console.error('UserService: Error creating user:', error)
        throw error
    }
}