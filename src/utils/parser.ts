import axios from "axios";
import cheerio from "cheerio"
import pdfParse from "pdf-parse"
import { ParsedQuestions } from "./scoring";

export const parseUrlExam = async (url: string): Promise<ParsedQuestions[]> => {
    // 1. Fetch HTML
    const { data:  html} = await axios.get(url, { timeout: 15000 })
    const $ = cheerio.load(html)

    const out: ParsedQuestions[] = []

    // 2. Select all question panels
    $(".question-pnl").each((i, el) => {
        const question = $(el).find(".question, .questionTxt").text().trim()

        // Parse options
        const opts: Record<string, string> = {}
        $(el).find(".optionsTbl td").each((j, optEl) => {
            const txt = $(optEl).text().trim()
            // attempt to split "1. Option text"
            const m = txt.match(/^([A-Z])\.*\s*(.*)$/)
            if (m) opts[m[1]] = m[2]
        })

        // Candidate's chosen answer
        const chosenRaw = $(el).find(".chosen answer, .candidateAnswer, .candAns").text().trim() // tune class
        const correctRaw = $(el).find(".correct answer, .rightAns, .answer").text().trim() // tune class
        const chosen = normalizeLetter(chosenRaw)
        const correct = normalizeLetter(correctRaw)
        out.push({ question, options: opts, chosen, correct, isCorrect: chosen && correct ? chosen === correct : null })
    })

    return out
}

export const parsePdfExam =  async (buffer: Buffer) => {
    const data = await pdfParse(buffer)
    const text = data.text
    // implement regex-based parsing to split questions/options/answers
    // return same normalized structure
    return []
}

function normalizeLetter(s: string|null) {
    if (!s) return null
    // s could be "Option B" or "B. ..." or "Your Answer: B" -> normalize to "B"
    const m = s.match(/([A-Z])\b/)
    return m ? m[1] : null
}