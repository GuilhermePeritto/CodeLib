"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

interface CodeBlockProps {
  code: string
  language: string
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    toast({
      title: "Copied to clipboard",
      description: "The code has been copied to your clipboard",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group">
      <pre className={cn("p-4 rounded-md overflow-x-auto", "bg-muted border border-border text-foreground")}>
        <code className="text-sm font-mono">{code}</code>
      </pre>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={copyToClipboard}
          className="h-8 w-8 bg-background/50 backdrop-blur-sm hover:bg-background/80 text-foreground rounded-full"
        >
          {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
          <span className="sr-only">Copy code</span>
        </Button>
      </div>
      <div className="absolute top-2 left-2">
        <span className="px-2 py-1 text-xs rounded-md bg-primary/20 text-primary font-mono">{language}</span>
      </div>
    </div>
  )
}
