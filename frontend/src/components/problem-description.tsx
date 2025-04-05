import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Example {
  input: string
  output: string
  explanation?: string
}

interface Problem {
  id: number
  title: string
  difficulty: string
  description: string
  examples: Example[]
  constraints: string[]
  starterCode: string
}

interface ProblemDescriptionProps {
  problem: Problem
}

export default function ProblemDescription({ problem }: ProblemDescriptionProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "hard":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">
          {problem.id}. {problem.title}
        </CardTitle>
        <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <p className="text-sm text-muted-foreground">{problem.description}</p>

        <div className="mt-4">
          <h3 className="text-sm font-medium">Examples:</h3>
          <div className="space-y-3 mt-2">
            {problem.examples.map((example, index) => (
              <div key={index} className="rounded-md bg-muted p-3">
                <p className="text-xs font-mono">
                  <span className="font-semibold">Input:</span> {example.input}
                </p>
                <p className="text-xs font-mono">
                  <span className="font-semibold">Output:</span> {example.output}
                </p>
                {example.explanation && (
                  <p className="text-xs mt-1">
                    <span className="font-semibold">Explanation:</span> {example.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-medium">Constraints:</h3>
          <ul className="list-disc list-inside space-y-1 mt-2">
            {problem.constraints.map((constraint, index) => (
              <li key={index} className="text-xs font-mono">
                {constraint}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

