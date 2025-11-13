import { Request, Response } from "express"
import * as submissionService from "../services/submissionService"
import { AuthRequest } from "../middleware/authMiddleware"

export const submitUrl = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.userId
        const { examId, url } = req.body
        const result =  await submissionService.submitByUrl(Number(userId), Number(examId), url)
        res.status(201).json(result)
    } catch (e: any) {
        res.status(400).json({ error: e.message })
    }
}

export const getHistory = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.userId
        const history = await submissionService.getUserHistory(userId)
        res.status(200).json(history)
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch submission history'})
    }
}