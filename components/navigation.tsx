"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Code, Home, Menu, MessageSquareText, Search, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const routes = [
    {
      href: "/",
      label: "Início",
      icon: Home,
      active: pathname === "/",
    },
    {
      href: "/snippets",
      label: "Códigos",
      icon: Code,
      active: pathname.startsWith("/snippets"),
    },
    {
      href: "/questions",
      label: "P&R",
      icon: MessageSquareText,
      active: pathname.startsWith("/questions"),
    },
    {
      href: "/search",
      label: "Busca",
      icon: Search,
      active: pathname === "/search",
    },
  ]

  return (
    <>
      {/* Navegação Mobile */}
      <div className="fixed bottom-0 left-0 z-50 w-full border-t glass-effect md:hidden">
        <div className="flex items-center justify-around h-16">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full px-2 text-xs transition-colors",
                route.active ? "text-primary glow-text" : "text-muted-foreground hover:text-primary",
              )}
            >
              <route.icon className="w-5 h-5 mb-1" />
              {route.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Navegação Desktop */}
      <header
        className={cn(
          "sticky top-0 z-40 w-full border-b transition-all duration-200",
          scrolled ? "glass-effect" : "bg-background",
        )}
      >
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <div className="flex items-center">
            <Link href="/" className="flex items-center text-xl font-bold">
              <Code className="w-6 h-6 mr-2 text-primary animate-glow" />
              <span className="hidden sm:inline glow-text">CodeLib</span>
            </Link>
          </div>

          <nav className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary flex items-center px-3 py-2 rounded-md",
                  route.active ? "text-primary bg-primary/10" : "text-muted-foreground",
                )}
              >
                <route.icon className="w-4 h-4 mr-2" />
                {route.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            <ModeToggle />
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(true)}>
              <Menu className="w-5 h-5" />
              <span className="sr-only">Alternar menu</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-50 glass-effect md:hidden">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 h-16 border-b">
              <Link href="/" className="flex items-center text-xl font-bold" onClick={() => setIsOpen(false)}>
                <Code className="w-6 h-6 mr-2 text-primary animate-glow" />
                <span className="glow-text">CodeLib</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5" />
                <span className="sr-only">Fechar menu</span>
              </Button>
            </div>
            <div className="flex flex-col p-4 space-y-4">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center py-3 px-4 text-lg font-medium transition-colors rounded-md",
                    route.active
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-primary hover:bg-muted",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <route.icon className="w-5 h-5 mr-3" />
                  {route.label}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t">
                <ModeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}