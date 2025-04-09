import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get("filter") || "all"

    let snippetsQuery = `
      SELECT s.id, s.title, s.description, s.code, s.language, s.created_at
      FROM snippets s
    `

    const params: any[] = []

    if (filter !== "all") {
      snippetsQuery += ` WHERE s.language = $1`
      params.push(filter)
    }

    snippetsQuery += ` ORDER BY s.created_at DESC`

    const snippetsResult = await query(snippetsQuery, params)

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

    return NextResponse.json(snippets)
  } catch (error) {
    console.error("Error fetching snippets:", error)
    return NextResponse.json({ error: "Failed to fetch snippets" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, code, language, tags } = body

    // Insert snippet
    const insertSnippetQuery = `
      INSERT INTO snippets (title, description, code, language)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `
    const snippetResult = await query(insertSnippetQuery, [title, description, code, language])

    const snippetId = snippetResult.rows[0].id

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

        // Create snippet-tag relationship
        const insertSnippetTagQuery = `
          INSERT INTO snippet_tags (snippet_id, tag_id)
          VALUES ($1, $2)
        `
        await query(insertSnippetTagQuery, [snippetId, tagId])
      }
    }

    return NextResponse.json({ id: snippetId, success: true })
  } catch (error) {
    console.error("Error creating snippet:", error)
    return NextResponse.json({ error: "Failed to create snippet" }, { status: 500 })
  }
}
