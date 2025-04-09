"use client"

import type React from "react"

import QuestionSkeleton from "@/components/question-skeleton"
import SnippetSkeleton from "@/components/snippet-skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { searchQuestions, searchSnippets } from "@/lib/data"
import { Code, MessageSquare, SearchIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState<{
    snippets: any[]
    questions: any[]
  }>({
    snippets: [],
    questions: [],
  })
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)
    setHasSearched(true)

    try {
      const snippets = await searchSnippets(query)
      const questions = await searchQuestions(query)

      setSearchResults({
        snippets,
        questions,
      })
    } catch (error) {
      console.error("Erro de busca:", error)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Busca</h1>
        <p className="text-muted-foreground">Busque por trechos de código e perguntas</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busque por trechos de código ou perguntas..."
          className="flex-1"
        />
        <Button type="submit" disabled={isSearching || !query.trim()}>
          {isSearching ? "Buscando..." : "Buscar"}
        </Button>
      </form>

      {hasSearched && (
        <Tabs defaultValue="snippets" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="snippets">
              <Code className="w-4 h-4 mr-2" />
              Trechos de código ({searchResults.snippets.length})
            </TabsTrigger>
            <TabsTrigger value="questions">
              <MessageSquare className="w-4 h-4 mr-2" />
              Perguntas ({searchResults.questions.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="snippets">
            {isSearching ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <SnippetSkeleton key={i} />
                ))}
              </div>
            ) : searchResults.snippets.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {searchResults.snippets.map((snippet) => (
                  <Card key={snippet.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{snippet.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="h-24 overflow-hidden text-sm text-muted-foreground">
                        <p>{snippet.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Badge variant="outline">{snippet.language}</Badge>
                        {snippet.tags.map((tag: string) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/snippets/${snippet.id}`}>Ver</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
                <SearchIcon className="h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">Nenhum trecho de código encontrado</h3>
                <p className="text-sm text-muted-foreground">Tente um termo de busca diferente</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="questions">
            {isSearching ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <QuestionSkeleton key={i} />
                ))}
              </div>
            ) : searchResults.questions.length > 0 ? (
              <div className="space-y-4">
                {searchResults.questions.map((question) => (
                  <Card key={question.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">
                        <Link href={`/questions/${question.id}`} className="hover:underline">
                          {question.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-muted-foreground line-clamp-2">{question.content}</p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {question.tags.map((tag: string) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/questions/${question.id}`}>Ver</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
                <SearchIcon className="h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">Nenhuma pergunta encontrada</h3>
                <p className="text-sm text-muted-foreground">Tente um termo de busca diferente</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}