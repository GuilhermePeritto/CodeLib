"use client"

import AnswerForm from "@/components/answer-form"
import QuestionDetailSkeleton from "@/components/question-detail-skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getQuestionById } from "@/lib/data"
import { ArrowLeft, MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function QuestionPage() {
  const params = useParams()
  const [question, setQuestion] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const id = params.id as string

  useEffect(() => {
    async function fetchQuestion() {
      setLoading(true)
      try {
        const data = await getQuestionById(id)
        setQuestion(data)
      } catch (error) {
        console.error("Erro ao buscar pergunta:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestion()
  }, [id])

  return (
    <div className="container px-4 py-8 mx-auto">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/questions">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para perguntas
        </Link>
      </Button>

      {loading ? (
        <QuestionDetailSkeleton />
      ) : !question ? (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
          <h3 className="text-lg font-medium">Pergunta não encontrada</h3>
          <p className="text-sm text-muted-foreground">
            A pergunta que você está procurando não existe ou foi excluída
          </p>
          <Button className="mt-4" asChild>
            <Link href="/questions">Voltar para perguntas</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">{question.title}</h1>
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <span>Perguntado por </span>
              <span className="font-medium mx-1">{question.author}</span>
              <span>em {new Date(question.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {question.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-2">
                  <Button variant="ghost" size="icon" className="hover:bg-transparent hover:text-primary">
                    <ThumbsUp className="h-5 w-5" />
                    <span className="sr-only">Votar positivo</span>
                  </Button>
                  <span className="font-medium">{question.votes}</span>
                  <Button variant="ghost" size="icon" className="hover:bg-transparent hover:text-destructive">
                    <ThumbsDown className="h-5 w-5" />
                    <span className="sr-only">Votar negativo</span>
                  </Button>
                </div>
                <div>
                  <p className="whitespace-pre-line">{question.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">
                {question.answers.length} {question.answers.length === 1 ? "Resposta" : "Respostas"}
              </h2>
            </div>
            <Separator className="my-4" />
          </div>

          {question.answers.length > 0 ? (
            <div className="space-y-6">
              {question.answers.map((answer: any) => (
                <Card key={answer.id}>
                  <CardHeader className="pb-2 flex flex-row items-center">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>{answer.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{answer.author}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(answer.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line">{answer.content}</p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {answer.votes}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg mb-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">Nenhuma resposta ainda</h3>
              <p className="text-sm text-muted-foreground">Seja o primeiro a responder esta pergunta</p>
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-xl font-bold tracking-tight mb-4">Sua Resposta</h2>
            <AnswerForm questionId={question.id} />
          </div>
        </>
      )}
    </div>
  )
}