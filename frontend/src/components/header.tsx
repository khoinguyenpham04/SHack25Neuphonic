"use client"

import { useState } from "react"
import { Code2, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Problem {
  id: number
  title: string
  difficulty: string
}

interface HeaderProps {
  problems: Problem[]
  onSelectProblem: (problem: any) => void
  selectedProblemId: number
}

export default function Header({ problems, onSelectProblem, selectedProblemId }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-500"
      case "medium":
        return "text-yellow-500"
      case "hard":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

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
        <div className="ml-auto flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Problem: {problems.find((p) => p.id === selectedProblemId)?.title}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {problems.map((problem) => (
                <DropdownMenuItem
                  key={problem.id}
                  onClick={() => onSelectProblem(problems.find((p) => p.id === problem.id))}
                  className="flex justify-between"
                >
                  <span>{problem.title}</span>
                  <span className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button>Submit</Button>
        </div>
      </div>
    </header>
  )
}

