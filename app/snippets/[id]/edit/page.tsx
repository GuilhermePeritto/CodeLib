"use client"

import type React from "react"

import SnippetDetailSkeleton from "@/components/snippet-detail-skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { getSnippetById } from "@/lib/data"
import { ArrowLeft, Plus, X } from 'lucide-react'
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function EditSnippetPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])

  useEffect(() => {
    async function fetchSnippet() {
      setLoading(true)
      try {
        const snippet = await getSnippetById(id)
        if (snippet) {
          setTitle(snippet.title)
          setDescription(snippet.description || "")
          setCode(snippet.code)
          setLanguage(snippet.language)
          setTags(snippet.tags || [])
        } else {
          toast({
            title: "Erro",
            description: "Snippet não encontrado",
            variant: "destructive",
          })
          router.push("/snippets")
        }
      } catch (error) {
        console.error("Error fetching snippet:", error)
        toast({
          title: "Erro",
          description: "Falha ao carregar o snippet",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSnippet()
  }, [id, router])

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

    if (!title || !code || !language) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/snippets/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          code,
          language,
          tags,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update snippet")
      }

      toast({
        title: "Sucesso",
        description: "Código atualizado com sucesso",
      })

      router.push(`/snippets/${id}`)
    } catch (error) {
      console.error("Error updating snippet:", error)
      toast({
        title: "Erro",
        description: "Falha ao atualizar o código. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href={`/snippets/${id}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o código
          </Link>
        </Button>
        <SnippetDetailSkeleton />
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href={`/snippets/${id}`}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para o código
        </Link>
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Editar Código</h1>
        <p className="text-muted-foreground">Atualize seu bloco de código</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Detalhes do Código</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite um título descritivo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o que este snippet faz"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Código *</Label>
              <Textarea
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Cole seu código aqui"
                className="font-mono"
                rows={10}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Linguagem *</Label>
              <Select value={language} onValueChange={setLanguage} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma linguagem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="csharp">C#</SelectItem>
                  <SelectItem value="php">PHP</SelectItem>
                  <SelectItem value="ruby">Ruby</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                  <SelectItem value="rust">Rust</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                  <SelectItem value="sql">SQL</SelectItem>
                  <SelectItem value="bash">Bash</SelectItem>
                  <SelectItem value="other">Outra</SelectItem>
                </SelectContent>
              </Select>
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
              <Link href={`/snippets/${id}`}>Cancelar</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Atualizando..." : "Atualizar Código"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}