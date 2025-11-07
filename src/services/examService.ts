import { PrismaClient } from "@prisma/client"
import { leaderboardIndex } from "./leaderboardIndex"

const prisma = new PrismaClient()

export const listExams = async () => {
    try {
        const exams = await prisma.exam.findMany({
            select: {
                id: true,
                name: true,
                code: true,
                totalMarks: true,
                meta: true,
                createdAt: true
            },
            orderBy: { name: 'asc' }
        })

        // Transform the data to match frontend format
        return exams.map(exam => {
            const meta = exam.meta as any || {}
            return {
                id: exam.id,
                slug: exam.code?.toLowerCase().replace(/-/g, '-') || exam.name.toLowerCase().replace(/\s+/g, '-'),
                name: exam.name,
                description: meta.description || '',
                category: meta.category || 'General',
                totalMarks: exam.totalMarks,
                subjects: meta.subjects || []
            }
        })
    } catch (error) {
        console.error('Error fetching exams:', error)
        throw new Error('Failed to fetch exams')
    }
}
export const getExamById = (id: number) => prisma.exam.findUnique({where: {id}})