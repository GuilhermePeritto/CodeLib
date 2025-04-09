import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Return 404 for "new" route to prevent database query errors
    if (id === "new") {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 })
    }

    // Get snippet
    const snippetQuery = `
      SELECT id, title, description, code, language, created_at
      FROM snippets
      WHERE id = $1
    `
    const snippetResult = await query(snippetQuery, [id])

    if (snippetResult.rows.length === 0) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 })
    }

    const snippet = snippetResult.rows[0]

    // Get tags
    const tagsQuery = `
      SELECT t.name
      FROM tags t
      JOIN snippet_tags st ON t.id = st.tag_id
      WHERE st.snippet_id = $1
    `
    const tagsResult = await query(tagsQuery, [id])
    const tags = tagsResult.rows.map((tag: any) => tag.name)

    return NextResponse.json({
      ...snippet,
      tags,
      createdAt: snippet.created_at,
    })
  } catch (error) {
    console.error("Error fetching snippet:", error)
    return NextResponse.json({ error: "Failed to fetch snippet" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { title, description, code, language, tags } = body

    // Check if snippet exists
    const checkQuery = `
      SELECT id FROM snippets WHERE id = $1
    `
    const checkResult = await query(checkQuery, [id])

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 })
    }

    // Update snippet
    const updateSnippetQuery = `
      UPDATE snippets
      SET title = $1, description = $2, code = $3, language = $4
      WHERE id = $5
      RETURNING id
    `
    await query(updateSnippetQuery, [title, description, code, language, id])

    // Delete existing tags
    const deleteTagsQuery = `
      DELETE FROM snippet_tags
      WHERE snippet_id = $1
    `
    await query(deleteTagsQuery, [id])

    // Insert new tags
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
        await query(insertSnippetTagQuery, [id, tagId])
      }
    }

    return NextResponse.json({ id, success: true })
  } catch (error) {
    console.error("Error updating snippet:", error)
    return NextResponse.json({ error: "Failed to update snippet" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Prevent deletion of "new" route
    if (id === "new") {
      return NextResponse.json({ error: "Invalid snippet ID" }, { status: 400 })
    }

    // Delete snippet (cascade will delete snippet_tags)
    const deleteQuery = `
      DELETE FROM snippets
      WHERE id = $1
      RETURNING id
    `
    const result = await query(deleteQuery, [id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting snippet:", error)
    return NextResponse.json({ error: "Failed to delete snippet" }, { status: 500 })
  }
}
