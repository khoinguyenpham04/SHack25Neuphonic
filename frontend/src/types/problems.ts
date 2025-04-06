export type SampleProblem = {
    id: number
    title: string
    difficulty: "Easy" | "Medium" | "Hard"
    description: string
    examples: Example[]
    constraints: string[]
    starterCode: string
  }
  
  export type Example = {
    input: string
    output: string
    explanation: string
  }
  
  export type SampleProblemList = SampleProblem[]