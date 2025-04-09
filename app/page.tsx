import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Code, MessageSquareText } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight glow-text">CodeLib</h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Sua biblioteca pessoal de trechos de código e plataforma de compartilhamento de conhecimento
        </p>
      </div>

      <div className="grid gap-6 mt-12 md:grid-cols-2 max-w-4xl mx-auto">
        <Card className="overflow-hidden border-2 transition-all hover:border-primary card-hover">
          <CardHeader className="pb-2">
            <div className="w-12 h-12 mb-2 rounded-full bg-primary/10 flex items-center justify-center">
              <Code className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-xl md:text-2xl">Códigos</CardTitle>
            <CardDescription>Armazene e organize seus trechos de código para acesso rápido</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="mr-2 text-primary">✓</span> Busque por linguagem, tags ou conteúdo
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-primary">✓</span> Organize com categorias personalizadas
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-primary">✓</span> Destaque de sintaxe para todas as linguagens
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full group mt-8">
              <Link href="/snippets">
                Navegar por Códigos <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden border-2 transition-all hover:border-secondary card-hover">
          <CardHeader className="pb-2">
            <div className="w-12 h-12 mb-2 rounded-full bg-secondary/10 flex items-center justify-center">
              <MessageSquareText className="w-6 h-6 text-secondary" />
            </div>
            <CardTitle className="text-xl md:text-2xl">Plataforma de Perguntas e Respostas</CardTitle>
            <CardDescription>Faça perguntas e compartilhe seu conhecimento de programação</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="mr-2 text-secondary">✓</span> Faça e responda perguntas de programação
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-secondary">✓</span> Vote em respostas úteis
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-secondary">✓</span> Construa sua base de conhecimento
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-secondary hover:bg-secondary/90 group">
              <Link href="/questions">
                Explorar Perguntas e Respostas <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}