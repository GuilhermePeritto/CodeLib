import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Get question
    const questionQuery = `
      SELECT id, title, content, author, votes, created_at
      FROM questions
      WHERE id = $1
    `
    const questionResult = await query(questionQuery, [id])

    if (questionResult.rows.length === 0) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    const question = questionResult.rows[0]

    // Get tags
    const tagsQuery = `
      SELECT t.name
      FROM tags t
      JOIN question_tags qt ON t.id = qt.tag_id
      WHERE qt.question_id = $1
    `
    const tagsResult = await query(tagsQuery, [id])
    const tags = tagsResult.rows.map((tag: any) => tag.name)

    // Get answers
    const answersQuery = `
      SELECT id, content, author, votes, created_at
      FROM answers
      WHERE question_id = $1
      ORDER BY votes DESC, created_at ASC
    `
    const answersResult = await query(answersQuery, [id])
    const answers = answersResult.rows.map((answer: any) => ({
      ...answer,
      createdAt: answer.created_at,
    }))

    return NextResponse.json({
      ...question,
      tags,
      answers,
      createdAt: question.created_at,
    })
  } catch (error) {
    console.error("Error fetching question:", error)
    return NextResponse.json({ error: "Failed to fetch question" }, { status: 500 })
  }
}
