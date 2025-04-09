import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const questionId = params.id
    const body = await request.json()
    const { content, author } = body

    // Check if question exists
    const questionQuery = `
      SELECT id FROM questions WHERE id = $1
    `
    const questionResult = await query(questionQuery, [questionId])

    if (questionResult.rows.length === 0) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    // Insert answer
    const insertAnswerQuery = `
      INSERT INTO answers (question_id, content, author)
      VALUES ($1, $2, $3)
      RETURNING id, content, author, votes, created_at
    `
    const answerResult = await query(insertAnswerQuery, [questionId, content, author])

    const answer = answerResult.rows[0]

    return NextResponse.json({
      ...answer,
      createdAt: answer.created_at,
      success: true,
    })
  } catch (error) {
    console.error("Error creating answer:", error)
    return NextResponse.json({ error: "Failed to create answer" }, { status: 500 })
  }
}
