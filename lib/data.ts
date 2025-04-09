// Client-side data fetching functions

// Snippets
export async function getSnippets(filter = "all") {
  try {
    const response = await fetch(`/api/snippets?filter=${filter}`)
    if (!response.ok) {
      throw new Error("Failed to fetch snippets")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching snippets:", error)
    return []
  }
}

export async function getSnippetById(id: string) {
  // Special case for "new" route - don't make an API call
  if (id === "new") {
    return null
  }

  try {
    const response = await fetch(`/api/snippets/${id}`)
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error("Failed to fetch snippet")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching snippet:", error)
    return null
  }
}

export async function createSnippet(snippet: any) {
  try {
    const response = await fetch("/api/snippets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(snippet),
    })

    if (!response.ok) {
      throw new Error("Failed to create snippet")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating snippet:", error)
    throw error
  }
}

export async function deleteSnippet(id: string) {
  try {
    const response = await fetch(`/api/snippets/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete snippet")
    }

    return await response.json()
  } catch (error) {
    console.error("Error deleting snippet:", error)
    throw error
  }
}

// Questions
export async function getQuestions() {
  try {
    const response = await fetch("/api/questions")
    if (!response.ok) {
      throw new Error("Failed to fetch questions")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching questions:", error)
    return []
  }
}

export async function getQuestionById(id: string) {
  try {
    const response = await fetch(`/api/questions/${id}`)
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error("Failed to fetch question")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching question:", error)
    return null
  }
}

export async function createQuestion(question: any) {
  try {
    const response = await fetch("/api/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(question),
    })

    if (!response.ok) {
      throw new Error("Failed to create question")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating question:", error)
    throw error
  }
}

export async function createAnswer(questionId: string, answer: any) {
  try {
    const response = await fetch(`/api/questions/${questionId}/answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(answer),
    })

    if (!response.ok) {
      throw new Error("Failed to create answer")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating answer:", error)
    throw error
  }
}

// Search
export async function searchSnippets(query: string) {
  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
    if (!response.ok) {
      throw new Error("Failed to search snippets")
    }
    const data = await response.json()
    return data.snippets
  } catch (error) {
    console.error("Error searching snippets:", error)
    return []
  }
}

export async function searchQuestions(query: string) {
  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
    if (!response.ok) {
      throw new Error("Failed to search questions")
    }
    const data = await response.json()
    return data.questions
  } catch (error) {
    console.error("Error searching questions:", error)
    return []
  }
}
