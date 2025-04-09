"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createAnswer } from "@/lib/data"
import { toast } from "@/components/ui/use-toast"

interface AnswerFormProps {
  questionId: string
}

export default function AnswerForm({ questionId }: AnswerFormProps) {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [author, setAuthor] = useState("Anonymous") // Default author name

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your answer",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await createAnswer(questionId, {
        content,
        author,
      })

      toast({
        title: "Success",
        description: "Your answer has been posted",
      })

      // Reset form and refresh the page to show the new answer
      setContent("")
      router.refresh()
    } catch (error) {
      console.error("Error posting answer:", error)
      toast({
        title: "Error",
        description: "Failed to post your answer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your answer here..."
        className="min-h-[200px] mb-4"
        required
      />
      <Button type="submit" disabled={isSubmitting || content.trim() === ""}>
        {isSubmitting ? "Submitting..." : "Post Your Answer"}
      </Button>
    </form>
  )
}
