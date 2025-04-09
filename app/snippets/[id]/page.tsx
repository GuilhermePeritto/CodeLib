"use client"

import CodeBlock from "@/components/code-block"
import SnippetDetailSkeleton from "@/components/snippet-detail-skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { deleteSnippet, getSnippetById } from "@/lib/data"
import { ArrowLeft, Copy, Edit, Trash } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function SnippetPage() {
  const params = useParams()
  const router = useRouter()
  const [snippet, setSnippet] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const id = params.id as string

  useEffect(() => {
    async function fetchSnippet() {
      setLoading(true)
      try {
        const data = await getSnippetById(id)
        setSnippet(data)
      } catch (error) {
        console.error("Error fetching snippet:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSnippet()
  }, [id])

  const handleCopyCode = async () => {
    if (snippet?.code) {
      await navigator.clipboard.writeText(snippet.code)
      toast({
        title: "Copiado para a área de transferência",
        description: "O código foi copiado para sua área de transferência",
      })
    }
  }

  const handleDelete = async () => {
    if (confirm("Tem certeza que deseja excluir este snippet?")) {
      setIsDeleting(true)
      try {
        await deleteSnippet(id)
        toast({
          title: "Snippet excluído",
          description: "O snippet foi excluído com sucesso",
        })
        router.push("/snippets")
      } catch (error) {
        console.error("Error deleting snippet:", error)
        toast({
          title: "Erro",
          description: "Falha ao excluir o snippet",
          variant: "destructive",
        })
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/snippets">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para snippets
        </Link>
      </Button>

      {loading ? (
        <SnippetDetailSkeleton />
      ) : !snippet ? (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
          <h3 className="text-lg font-medium">Snippet não encontrado</h3>
          <p className="text-sm text-muted-foreground">
            O snippet que você está procurando não existe ou foi excluído
          </p>
          <Button className="mt-4" asChild>
            <Link href="/snippets">Voltar para snippets</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{snippet.title}</h1>
              <p className="text-muted-foreground">Criado em {new Date(snippet.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <Button variant="outline" size="sm" onClick={handleCopyCode}>
                <Copy className="w-4 h-4 mr-2" />
                Copiar
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/snippets/${snippet.id}/edit`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash className="w-4 h-4 mr-2" />
                {isDeleting ? "Excluindo..." : "Excluir"}
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="p-4 border rounded-lg bg-muted/40">
                <CodeBlock code={snippet.code} language={snippet.language} />
              </div>
            </div>
            <div>
              <div className="p-4 border rounded-lg">
                <h3 className="mb-2 text-lg font-medium">Detalhes</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Descrição</h4>
                    <p className="mt-1">{snippet.description}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Linguagem</h4>
                    <Badge className="mt-1" variant="outline">
                      {snippet.language}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Tags</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {snippet.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}