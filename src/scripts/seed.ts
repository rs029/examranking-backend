import { PrismaClient } from "@prisma/client";  
import dotenv from "dotenv";

// Load environment variables (same logic as server.ts)
dotenv.config({
    path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
})

const prisma = new PrismaClient()

const examData = [
    {
        name: "JEE Main",
        code: "JEE-MAIN-2025",
        totalMarks: 300,
        marksCorrect: 4,
        marksWrong: -1,
        marksUnattempted: 0,
        meta: {
            subjects: ["Physics", "Chemistry", "Mathematics"],
            description: "Joint Entrance Examination (Main) for engineering admissions",
            category: "Engineering"
        }
    },
    {
        name: "NEET",
        code: "NEET-2025",
        totalMarks: 720,
        marksCorrect: 4,
        marksWrong: -1,
        marksUnattempted: 0,
        meta: {
            subjects: ["Physics", "Chemistry", "Biology"],
            description: "National Eligibility cum Entrance Test for medical admissions",
            category: "Medical"
        }
    },
    {
        name: "CAT",
        code: "CAT-2025",
        totalMarks: 300,
        marksCorrect: 3,
        marksWrong: -1,
        marksUnattempted: 0,
        meta: {
            subjects: ["Verbal Ability", "Data Interpretation", "Quantitative Aptitude"],
            description: "Common Admission Test for MBA programs",
            category: "Management"
        }
    },
    {
        name: "GATE",
        code: "GATE-2025",
        totalMarks: 100,
        marksCorrect: 4,
        marksWrong: -1,
        marksUnattempted: 0,
        meta: {
            subjects: ["Technical Subject", "Engineering Mathematics", "General Aptitude"],
            description: "Graduate Aptitude Test in Engineering",
            category: "Engineering"
        }
    },
    {
        name: "UPSC CSE",
        code: "UPSC-CSE-2025",
        totalMarks: 100,
        marksCorrect: 2,
        marksWrong: -0.50,
        marksUnattempted: 0,
        meta: {
            subjects: ["General Studies", "Optional Subject", "Essay"],
            description: "Civil Services Examination for government jobs",
            category: "Government"
        }
    },
    {
        name: "SSC CGL",
        code: "SSC-CGL-2025",
        totalMarks: 200,
        marksCorrect: 2,
        marksWrong: -0.50,
        marksUnattempted: 0,
        meta: {
            subjects: ["General Intelligence", "General Awareness", "Quantitative Aptitude", "English"],
            description: "Staff Selection Commission Combined Graduate Level",
            category: "Government"
        }
    },
    {
        name: "BANK PO",
        code: "BANK-PO-2025",
        totalMarks: 100,
        marksCorrect: 1,
        marksWrong: -0.25,
        marksUnattempted: 0,
        meta: {
            subjects: ["Reasoning", "Quantitative Aptitude", "English", "General Awareness"],
            description: "Banking Probationary Officer examinations",
            category: "Engineering"
        }
    },
    {
        name: "CLAT",
        code: "CLAT-2025",
        totalMarks: 150,
        marksCorrect: 1,
        marksWrong: -0.25,
        marksUnattempted: 0,
        meta: {
            subjects: ["English", "Current Affairs", "Legal Reasoning", "Logical Reasoning", "Quantitative Techniques"],
            description: "Common Law Admission Test for law programs",
            category: "Law"
        }
    }
]

async function seedExams() {
    try {
        console.log("Seeding exam data...")
        console.log("DATABASE_URL:", process.env.DATABASE_URL?.substring(0, 30) + "...")

        // Test connection first
        await prisma.$connect()
        console.log("Database connection successfully!")
        
        for (const exam of examData) {
            await prisma.exam.create({
                data: exam
            })
            console.log(`Inserted exam: ${exam.name}`)
        }
        console.log("Seeding completed.")
    } catch (error: any) {
        console.log("Error seeding data:", error)
        console.error("Error message:", error.message)
        console.error("Error code:", error.code)
        if (error.meta) {
            console.error("Error meta:", error.meta)
        }
    } finally {
        await prisma.$disconnect()
    }
}

seedExams()