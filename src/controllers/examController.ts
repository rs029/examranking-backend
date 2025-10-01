import { Request, Response } from "express"
import * as examService from "../services/examService"

export const getExams = async (req: Request, res: Response) => {
    const exams = await examService.listExams()
    res.json(exams)
}

export const getExam = async (req:Request, res:Response) => {
    const id = Number(req.params.id)
    try {
        const exam = await examService.getExamById(id)
        if (!exam) return res.status(404).json({ error: "Exam not found" })
        res.json(exam)
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch exam" })
    }
}