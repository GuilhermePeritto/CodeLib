import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const searchQuery = searchParams.get("q") || ""

    if (!searchQuery.trim()) {
      return NextResponse.json({ snippets: [], questions: [] })
    }

    // Search snippets
    const snippetsQuery = `
      SELECT s.id, s.title, s.description, s.code, s.language, s.created_at
      FROM snippets s
      WHERE 
        s.title ILIKE $1 OR
        s.description ILIKE $1 OR
        s.code ILIKE $1
      ORDER BY s.created_at DESC
    `
    const snippetsResult = await query(snippetsQuery, [`%${searchQuery}%`])

    // Get tags for each snippet
    const snippets = await Promise.all(
      snippetsResult.rows.map(async (snippet: any) => {
        const tagsQuery = `
          SELECT t.name
          FROM tags t
          JOIN snippet_tags st ON t.id = st.tag_id
          WHERE st.snippet_id = $1
        `
        const tagsResult = await query(tagsQuery, [snippet.id])
        const tags = tagsResult.rows.map((tag: any) => tag.name)

        return {
          ...snippet,
          tags,
          createdAt: snippet.created_at,
        }
      }),
    )

    // Search questions
    const questionsQuery = `
      SELECT q.id, q.title, q.content, q.author, q.votes, q.created_at
      FROM questions q
      WHERE 
        q.title ILIKE $1 OR
        q.content ILIKE $1
      ORDER BY q.created_at DESC
    `
    const questionsResult = await query(questionsQuery, [`%${searchQuery}%`])

    // Get tags for each question
    const questions = await Promise.all(
      questionsResult.rows.map(async (question: any) => {
        const tagsQuery = `
          SELECT t.name
          FROM tags t
          JOIN question_tags qt ON t.id = qt.tag_id
          WHERE qt.question_id = $1
        `
        const tagsResult = await query(tagsQuery, [question.id])
        const tags = tagsResult.rows.map((tag: any) => tag.name)

        return {
          ...question,
          tags,
          createdAt: question.created_at,
        }
      }),
    )

    return NextResponse.json({ snippets, questions })
  } catch (error) {
    console.error("Error searching:", error)
    return NextResponse.json({ error: "Failed to search" }, { status: 500 })
  }
}
