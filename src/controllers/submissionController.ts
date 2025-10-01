import { Request, Response } from "express"
import * as submissionService from "../services/submissionService"
import { AuthRequest } from "../middleware/authMiddleware"

export const submitUrl = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id
        const { examId, url } = req.body
        const result =  await submissionService.submitByUrl(userId, String(examId), url)
        res.status(201).json(result)
    } catch (e: any) {
        res.status(400).json({ error: e.message })
    }
}