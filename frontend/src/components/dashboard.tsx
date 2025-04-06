"use client"

import { useState, useEffect } from "react"
import ChatSidebar from "@/components/chat-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import ProblemDescription from "@/components/problem-description"
import CodeEditor from "@/components/code-editor"
import { SAMPLE_PROBLEMS } from "@/data/sampleProblems"

export default function Dashboard() {
  const [selectedProblem, setSelectedProblem] = useState(SAMPLE_PROBLEMS[0])
  const [code, setCode] = useState(selectedProblem.starterCode)

  // Update code when problem changes
  useEffect(() => {
    setCode(selectedProblem.starterCode)
  }, [selectedProblem])

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* First column: Problem display */}
          <div className="w-full md:w-1/3 lg:w-1/4 xl:w-1/4 overflow-auto p-4 border-b md:border-b-0 md:border-r">
            <ProblemDescription problem={selectedProblem} />
          </div>

          {/* Second column: Code editor */}
          <div className="w-full md:w-1/3 lg:w-2/4 xl:w-2/4 overflow-auto p-4 border-b md:border-b-0 md:border-r">
            <CodeEditor 
              problem={selectedProblem} 
              problems={SAMPLE_PROBLEMS}
              onSelectProblem={(problem) => setSelectedProblem(problem as typeof selectedProblem)}
              selectedProblemId={selectedProblem.id}
              code={code}
              setCode={setCode}
            />
          </div>

          {/* Third column: Chat sidebar */}
          <div className="w-full md:w-1/3 lg:w-1/4 xl:w-1/4 overflow-auto">
            <ChatSidebar 
              code={code}
              selectedProblem={selectedProblem}
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

