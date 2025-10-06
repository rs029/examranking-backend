import axios from "axios";
import cheerio from "cheerio"
//import pdfParse from "pdf-parse"
import { ParsedQuestions } from "./scoring";

export const parseUrlExam = async (url: string): Promise<ParsedQuestions[]> => {
    // 1. Fetch HTML
    const { data:  html} = await axios.get(url, { timeout: 15000 })
    const $ = cheerio.load(html)

    const out: ParsedQuestions[] = []

    // 2. Select all question panels
    $(".question-pnl").each((i, el) => {
        // Questions text
        const question = $(el).find("td:contains('Q.')").first().text().trim()

        // Parse options
        const opts: Record<string, string> = {}
        $(el).find("tr").each((j, tr) => {
            const txt = $(tr).text().trim()
            // attempt to split "1. Option text"
            const m = txt.match(/^\d\.*\s*(.*)$/) // e.g. "1. 34 km towards South"
            if (m) {
                opts[(j+1).toString()] = m[1]
            }
        })

        // Correct answer
        let crct: string | null = null
        $(el).find("tr").each((j, tr) => {
            if ($(tr).find(".rightAns")) {
                crct = (j+1).toString()
            }
        })

        // Chosen option -> from right-hand metadata
        let chsn: string | null = null
        const chosenRaw = $(el).find("td:contains('Chosen Option :')").text().trim()
        if (chosenRaw.includes("--")) {
            chsn = null //unattempted
        } else {
            const chosenMatch = chosenRaw.match(/Chosen Option\s*:\s*(\d+)/)
            if (chosenMatch) chsn = chosenMatch[1]  
        }   
        //const chosen = normalizeLetter(chosenRaw)
        out.push({ 
            question, 
            options: opts, 
            chosen: chsn, 
            correct: crct, 
            isCorrect: chsn && crct ? chsn === crct : null 
        })
    })

    return out
}

/*export const parsePdfExam =  async (buffer: Buffer) => {
    const data = await pdfParse(buffer)
    const text = data.text
    // implement regex-based parsing to split questions/options/answers
    // return same normalized structure
    return extractQuestions(text)
}

export async function extractQuestions((text: string): Promise<ParsedQuestions[]>) => {
    const blocks = text.split(/Q\.\d+/).filter(Boolean)
} */