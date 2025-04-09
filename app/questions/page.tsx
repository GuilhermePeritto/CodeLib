"use client"

import QuestionSkeleton from "@/components/question-skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getQuestions } from "@/lib/data"
import { MessageSquare, Plus, ThumbsUp } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true)
      try {
        const data = await getQuestions()
        setQuestions(data)
      } catch (error) {
        console.error("Erro ao buscar perguntas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight glow-text">Plataforma de Perguntas e Respostas</h1>
          <p className="text-muted-foreground">Faça perguntas e compartilhe seu conhecimento</p>
        </div>
        <Button className="mt-4 sm:mt-0 bg-primary hover:bg-primary/90" asChild>
          <Link href="/questions/new">
            <Plus className="w-4 h-4 mr-2" />
            Fazer Pergunta
          </Link>
        </Button>
      </div>

      {loading ? (
        <QuestionSkeletonList />
      ) : questions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg glass-effect">
          <h3 className="text-lg font-medium">Nenhuma pergunta encontrada</h3>
          <p className="text-sm text-muted-foreground">Seja o primeiro a fazer uma pergunta</p>
          <Button className="mt-4 bg-primary hover:bg-primary/90 animate-glow-primary" asChild>
            <Link href="/questions/new">
              <Plus className="w-4 h-4 mr-2" />
              Fazer Pergunta
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <Card key={question.id} className="card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">
                  <Link href={`/questions/${question.id}`} className="hover:text-primary transition-colors">
                    {question.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-muted-foreground line-clamp-2">{question.content}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {question.tags.map((tag: string) => (
                    <Badge key={tag} className="bg-primary/10 text-primary border-primary/20">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <ThumbsUp className="w-4 h-4 mr-1 text-primary" />
                    {question.votes}
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-1 text-primary" />
                    {question.answerCount || 0}
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Perguntado por </span>
                  <span className="font-medium text-accent">{question.author}</span>
                  <span className="text-muted-foreground"> em {new Date(question.createdAt).toLocaleDateString()}</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function QuestionSkeletonList() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <QuestionSkeleton key={i} />
      ))}
    </div>
  )
}