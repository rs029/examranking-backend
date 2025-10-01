import { PrismaClient } from "@prisma/client"
import Redis from "ioredis"

const prisma = new PrismaClient()
const redis = new Redis()

export interface LeaderboardService {
    addScore(userId: number, examId:number, score: number): Promise<void>
    getTop(examId: number, limit: number): Promise<{ userId: number, score:number, rank: number }[]>
    getRank(examId: number, userId: number): Promise<{ userId: number, score:number, rank: number | null }>
}

export const PrismaLeaderboard:LeaderboardService = {
    async addScore(userId, examId, score) {
        // Nothing to do because ExamAttempt is already stored with score
        // Optionally trigger caching later
    },

    async getTop(examId, limit) {
        const attempts = await prisma.examAttempt.findMany({
            where: { examId },
            orderBy: { score: "desc" },
            take: limit,
            select: {userId: true, score: true},
        })

        return attempts.map((a, i) => ({
        userId: a.userId,
        score: a.score ?? 0,
        rank: i + 1,
        }))
    },

    async getRank(examId, userId) {
        // Count how many scored higher
        const user = await prisma.examAttempt.findFirst({
            where: { examId, userId },
            select: { score: true },
        })
        if (!user) return { userId, score: 0, rank: null }

        const higherCount = await prisma.examAttempt.count({
            where: { examId, score: { gt: user.score ?? 0 } }, 
        })
        return { userId, score: user.score ?? 0, rank: higherCount + 1 }
    }
}

export const RedisLeaderboard: LeaderboardService = {
    async addScore(userId, examId, score) {
        await redis.zadd(`leaderboard:exam:${examId}`, score, String(userId))
    },

    async getTop(examId, limit) {
        const entries = await redis.zrevrange(
            `leaderboard:exam:${examId}`,
            0,
            limit - 1,
            "WITHSCORES"
        )
        const out = []
        for (let i = 0; i < entries.length; i += 2) {
            out.push({ userId: Number(entries[i]), score: Number(entries[i + 1]), rank: i / 2 + 1})
        }
        return out
    },

    async getRank(examId, userId) {
        const score = await redis.zscore(`leaderboard:exam:${examId}`, String(userId))
        const rank = await redis.zrevrank(`leaderboard:exam:${examId}`, String(userId))
        return { userId, score: score ? Number(score) : 0, rank: rank !== null ? rank + 1 : null }
    }
}