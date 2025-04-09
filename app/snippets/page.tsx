"use client"

import SnippetSkeleton from "@/components/snippet-skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSnippets } from "@/lib/data"
import { Plus, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function SnippetsPage() {
  const [activeTab, setActiveTab] = useState("all")

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight glow-text">Códigos</h1>
          <p className="text-muted-foreground">Navegue e gerencie seus trechos de código</p>
        </div>
        <Button className="mt-4 sm:mt-0 group" asChild>
          <Link href="/snippets/new">
            <Plus className="w-4 h-4 mr-2" />
            Novo Código
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-4 w-full sm:w-auto overflow-x-auto flex-nowrap glass-effect">
          <TabsTrigger value="all" className="flex items-center">
            <Sparkles className="w-4 h-4 mr-2" />
            Todos
          </TabsTrigger>
          <TabsTrigger value="javascript" className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>
            JavaScript
          </TabsTrigger>
          <TabsTrigger value="python" className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-blue-400 mr-2"></span>
            Python
          </TabsTrigger>
          <TabsTrigger value="html" className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-orange-400 mr-2"></span>
            HTML/CSS
          </TabsTrigger>
          <TabsTrigger value="other" className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-purple-400 mr-2"></span>
            Outros
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <SnippetTabContent filter="all" key="all" />
        </TabsContent>
        <TabsContent value="javascript">
          <SnippetTabContent filter="javascript" key="javascript" />
        </TabsContent>
        <TabsContent value="python">
          <SnippetTabContent filter="python" key="python" />
        </TabsContent>
        <TabsContent value="html">
          <SnippetTabContent filter="html" key="html" />
        </TabsContent>
        <TabsContent value="other">
          <SnippetTabContent filter="other" key="other" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SnippetTabContent({ filter }: { filter: string }) {
  const [snippets, setSnippets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchSnippets() {
      setLoading(true)
      try {
        const data = await getSnippets(filter)
        setSnippets(data)
      } catch (error) {
        console.error(`Erro ao buscar trechos de ${filter}:`, error)
      } finally {
        setLoading(false)
      }
    }

    fetchSnippets()
  }, [filter])

  if (loading) {
    return <SnippetSkeletonList />
  }

  if (snippets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg glass-effect">
        <h3 className="text-lg font-medium">Nenhum trecho de código encontrado</h3>
        <p className="text-sm text-muted-foreground">Crie seu primeiro trecho para começar</p>
        <Button className="mt-4 animate-glow" asChild>
          <Link href="/snippets/new">
            <Plus className="w-4 h-4 mr-2" />
            Novo Código
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {snippets.map((snippet) => (
        <Card key={snippet.id} className="overflow-hidden card-hover hover:cursor-pointer hover:border-ring" onClick={() => (router.push(`/snippets/${snippet.id}`))}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{snippet.title}</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="h-24 overflow-hidden text-sm text-muted-foreground">
              <p>{snippet.description}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
          <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {snippet.language}
              </Badge>
              {snippet.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20">
                  {tag}
                </Badge>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">{new Date(snippet.createdAt).toLocaleDateString()}</span>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function SnippetSkeletonList() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <SnippetSkeleton key={i} />
      ))}
    </div>
  )
}