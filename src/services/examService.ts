import { PrismaClient } from "@prisma/client"
import { leaderboardIndex } from "./leaderboardIndex"

const prisma = new PrismaClient()

export const listExams = () => prisma.exam.findMany()
export const getExamById = (id: number) => prisma.exam.findUnique({where: {id}})