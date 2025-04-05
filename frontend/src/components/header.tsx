"use client"

import { useState } from "react"
import { Code2, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="w-full flex h-16 items-center px-4 sm:px-6">
        <Button variant="ghost" className="mr-2 md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="flex items-center gap-2">
          <Code2 className="h-6 w-6" />
          <h1 className="font-semibold tracking-tight">CodeCraft</h1>
        </div>
      </div>
    </header>
  )
}

