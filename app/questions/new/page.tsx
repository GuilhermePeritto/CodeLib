"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { createQuestion } from "@/lib/data"
import { ArrowLeft, Loader2, Plus, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function NewQuestionPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [author, setAuthor] = useState("Anonymous")
    const [tagInput, setTagInput] = useState("")
    const [tags, setTags] = useState<string[]>([])

    const handleAddTag = () => {
        const trimmedTag = tagInput.trim().toLowerCase()
        if (trimmedTag && !tags.includes(trimmedTag)) {
            setTags([...tags, trimmedTag])
            setTagInput("")
        }
    }

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove))
    }

    const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            handleAddTag()
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!title || !content) {
            toast({
                title: "Erro de validação",
                description: "Por favor, preencha todos os campos obrigatórios",
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)

        try {
            const result = await createQuestion({
                title,
                content,
                author,
                tags,
            })

            toast({
                title: "Sucesso",
                description: "Pergunta publicada com sucesso",
            })

            router.push(`/questions/${result.id}`)
        } catch (error) {
            console.error("Error posting question:", error)
            toast({
                title: "Erro",
                description: "Falha ao publicar a pergunta. Por favor, tente novamente.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container px-4 py-8 mx-auto">
            <Button variant="ghost" size="sm" asChild className="mb-4">
                <Link href="/questions">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar para perguntas
                </Link>
            </Button>

            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Faça uma Pergunta</h1>
                <p className="text-muted-foreground">Obtenha ajuda da comunidade</p>
            </div>

            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Detalhes da Pergunta</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título *</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Qual é sua pergunta? Seja específico."
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Detalhes *</Label>
                            <Textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Forneça todos os detalhes necessários para responder sua pergunta."
                                rows={8}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="author">Seu Nome</Label>
                            <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Anônimo" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="tags"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagInputKeyDown}
                                    placeholder="Adicione tags (pressione Enter ou vírgula para adicionar)"
                                />
                                <Button type="button" onClick={handleAddTag} size="icon">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            {tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {tags.map((tag) => (
                                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="rounded-full hover:bg-muted"
                                            >
                                                <X className="w-3 h-3" />
                                                <span className="sr-only">Remover tag {tag}</span>
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" type="button" asChild>
                            <Link href="/questions">Cancelar</Link>
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ?
                                <><Loader2 className="animate-spin" />
                                    <span className="ml-2">Publicando...</span>
                                </>
                                : "Publicar Pergunta"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}