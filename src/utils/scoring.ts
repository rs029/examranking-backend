import { ScoringRule } from "../types/scoringRule"

export interface ParsedQuestions {
    question: string
    options: Record<string, string>
    chosen: string | null
    correct: string | null
    isCorrect: boolean | null
}

export interface ScoreResult {
    score: number
    total: number
    correct: number
    wrong: number
    unattempted: number
}

export const calculatedScore = (parsed: ParsedQuestions[],
    rule: ScoringRule
): ScoreResult => { 
    let correct = 0
    let wrong = 0
    let unattempted = 0
    

    parsed.forEach(q => {
        if (!q.chosen) {
            unattempted++
        } else if (q.correct === q.chosen) {
            correct++
        } else {
            wrong++
        }
    })

    const score =
        Number(correct) * Number(rule.marksCorrect) +
        Number(wrong) * Number(rule.marksWrong) +
        Number(unattempted) * Number(rule.marksUnattempted)

    return { score, total: parsed.length, correct, wrong, unattempted}
}

