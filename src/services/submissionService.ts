import { PrismaClient } from "@prisma/client"
import { parseUrlExam } from "../utils/parser"
import { calculatedScore } from "../utils/scoring"

const prisma = new PrismaClient()

export const submitByUrl = async (userId: number, examId: number, url: string) => {
    // 1. Prevent use by others
    const existing =  await prisma.examAttempt.findUnique({ where: { url } })
    if (existing) throw new Error("This URL has already been submitted")
        
    // 2. Parse (may throw)
    const parsed = await parseUrlExam(url) //return parsedQuestions[]

    // Get exam to know scoring rule
    const exam = await prisma.exam.findUnique({ where: { id: examId } })
    if (!exam) throw new Error("Exam not found")
    const rule = {
        marksCorrect: exam.marksCorrect,
        marksWrong: exam.marksWrong,
        marksUnattempted: exam.marksUnattempted,
    }
    //--------------------------------------------------------------------------------
    // 3. Score
    const { score, total, correct, wrong } =  calculatedScore(parsed, rule)
    
    // 4. Save
    const attempt = await prisma.examAttempt.create({
        data: {
            userId, examId, inputType: "URL", url,
            rawData: JSON.parse(JSON.stringify(parsed)), score, total, correct, wrong
        }
    })

    // 5. Compute rank & percentile (simple on-demand)
    const higherCount = await prisma.examAttempt.count({ where: { examId, score: { gt: score } } })
    const totalAttempts = await prisma.examAttempt.count({ where: {examId} })
    const rank = higherCount + 1
    const percentile = Math.round(100 * (1- (higherCount / Math.max(1, totalAttempts))) * 100) / 100

    await prisma.examAttempt.update({ where: { id: attempt.id }, data: { /* optionally store rank/percentile */ } })

    return { attemptId: attempt.id, score, total, correct, wrong, rank, percentile, parsed }
}