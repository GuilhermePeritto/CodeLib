import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    // Get questions
    const questionsQuery = `
      SELECT id, title, content, author, votes, created_at
      FROM questions
      ORDER BY created_at DESC
    `
    const questionsResult = await query(questionsQuery)

    // Get tags and answers for each question
    const questions = await Promise.all(
      questionsResult.rows.map(async (question: any) => {
        // Get tags
        const tagsQuery = `
          SELECT t.name
          FROM tags t
          JOIN question_tags qt ON t.id = qt.tag_id
          WHERE qt.question_id = $1
        `
        const tagsResult = await query(tagsQuery, [question.id])
        const tags = tagsResult.rows.map((tag: any) => tag.name)

        // Get answer count
        const answersCountQuery = `
          SELECT COUNT(*) as count
          FROM answers
          WHERE question_id = $1
        `
        const answersCountResult = await query(answersCountQuery, [question.id])
        const answerCount = Number.parseInt(answersCountResult.rows[0].count)

        return {
          ...question,
          tags,
          answerCount,
          createdAt: question.created_at,
        }
      }),
    )

    return NextResponse.json(questions)
  } catch (error) {
    console.error("Error fetching questions:", error)
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, author, tags } = body

    // Insert question
    const insertQuestionQuery = `
      INSERT INTO questions (title, content, author)
      VALUES ($1, $2, $3)
      RETURNING id
    `
    const questionResult = await query(insertQuestionQuery, [title, content, author])

    const questionId = questionResult.rows[0].id

    // Insert tags
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        // Check if tag exists
        const tagQuery = `
          SELECT id FROM tags WHERE name = $1
        `
        const tagResult = await query(tagQuery, [tagName])

        let tagId
        if (tagResult.rows.length === 0) {
          // Create new tag
          const insertTagQuery = `
            INSERT INTO tags (name)
            VALUES ($1)
            RETURNING id
          `
          const newTagResult = await query(insertTagQuery, [tagName])
          tagId = newTagResult.rows[0].id
        } else {
          tagId = tagResult.rows[0].id
        }

        // Create question-tag relationship
        const insertQuestionTagQuery = `
          INSERT INTO question_tags (question_id, tag_id)
          VALUES ($1, $2)
        `
        await query(insertQuestionTagQuery, [questionId, tagId])
      }
    }

    return NextResponse.json({ id: questionId, success: true })
  } catch (error) {
    console.error("Error creating question:", error)
    return NextResponse.json({ error: "Failed to create question" }, { status: 500 })
  }
}
