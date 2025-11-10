import axios from "axios";
import * as cheerio from "cheerio"
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
            const m = txt.match(/(?:^|Ans)(\d+)\.?\s+(.+)$/i) // e.g. "1. 34 km towards South"
            if (m) {
                const optionNum = m[1]
                const optionText = m[2]
                if (optionText.length > 0 ) {
                    opts[optionNum] = optionText
                }
            }
        })

        // Correct answer - find .rightAns and extract the option number from the same row
        let crct: string | null = null
        $(el).find(".rightAns").each((j, ansEl) => {
            // Get the parent row
            const parentRow = $(ansEl).closest("tr")
            const rowText  =  parentRow.text().trim()

            // Try to find option number in the row text
            // Look for pattern like "1. Option" or "Ans1. Option"
            const optionMatch = rowText.match(/(?:^|Ans)(\d+)\.?\s+(.+)$/i)
            if (optionMatch) {
                crct = optionMatch[1]
            } else {
                // Alternative: check if there's a number in the .rightAns element itself
                const ansText = $(ansEl).text().trim()
                const numMatch = ansText.match(/(\d+)/)
                if (numMatch) {
                    crct = numMatch[1]
                }
            }
        })

       // If still no correct answer found, try another approach
       if (!crct) {
        $(el).find("tr").each((j, tr) => {
            if ($(tr).find("rightAns").length > 0) {
                const txt = $(tr).text().trim()
                const match = txt.match(/(?:^|Ans)(\d+)\.?\s+(.+)$/i)
                if (match) {
                    crct = match[1]
                }
            }
        })
       }

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