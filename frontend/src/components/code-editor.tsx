"use client"

import { useState, useRef, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Editor from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { foldGutter } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { Bot } from 'lucide-react';
import { evaluateUserCode } from "@/services/evaluateCode"
import { fetchAiAnaysis } from "@/services/fetchAiAnalysis"
import { TestCaseResults } from "./test-case-results"
import { TestResultList } from "@/types/testResults"

interface Problem {
  id: number
  title: string
  difficulty: string
  description: string
  examples: {
    input: string
    output: string
    explanation?: string
  }[]
  constraints: string[]
  starterCode: string
}

interface CodeEditorProps {
  problem: Problem
  problems: Problem[]
  onSelectProblem: (problem: Problem) => void
  selectedProblemId: number
  code: string
  setCode: (code: string) => void
}

export default function CodeEditor({ problem, problems, onSelectProblem, selectedProblemId, code, setCode }: CodeEditorProps) {
  const [output, setOutput] = useState("")
  const [activeTab, setActiveTab] = useState("code")
  const [testResults, setTestResults] = useState<TestResultList>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const highlightRef = useRef<HTMLPreElement>(null)

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



  // Sync scroll between textarea and highlighted code
  useEffect(() => {
    const textarea = textareaRef.current
    const highlight = highlightRef.current

    if (!textarea || !highlight) return

    const handleScroll = () => {
      if (highlight) {
        highlight.scrollTop = textarea.scrollTop
        highlight.scrollLeft = textarea.scrollLeft
      }
    }

    textarea.addEventListener("scroll", handleScroll)
    return () => textarea.removeEventListener("scroll", handleScroll)
  }, [])


  const handleRunCode = async () => {
    try {
      const response = await evaluateUserCode(problem.id, code)
      setTestResults(response)
      setActiveTab("testcases")
    } catch (err) {
      setOutput("An error occurred during code evaluation." + err)
      setActiveTab("testcases")
    }
  }

  const handleAIAnalysis = async () => {
    try {
      const response = await fetchAiAnaysis(code, problem.description)
      const analysisEvent = new CustomEvent('aiAnalysis', {
        detail: { feedback: response.feedback }
      });
      window.dispatchEvent(analysisEvent);

    } catch (err) {
      setOutput('Failed to analyze code. Please try again.');

    }

  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="testcases">Test Cases</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Problem: {problems.find((p) => p.id === selectedProblemId)?.title}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {problems.map((problem) => (
                    <DropdownMenuItem
                      key={problem.id}
                      onClick={() => onSelectProblem(problems.find((p) => p.id === problem.id)!)}
                      className="flex justify-between"
                    >
                      <span>{problem.title}</span>
                      <span className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex gap-2">
                <Button
                  onClick={handleAIAnalysis}
                  className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                >
                  <Bot size={16} />
                  Get AI Feedback
                </Button>
                <div className="flex gap-2">
                  <Button className="bg-green-500 hover:bg-green-600 text-white">Submit</Button>
                </div>
              </div>
            </div>
          </div>
        </Tabs>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsContent value="code" className="flex-1 flex flex-col">
            <div className="flex-1 mb-4 relative h-[300px]">
              <Editor
                value={code}
                onChange={setCode}
                extensions={[python(), foldGutter(), EditorView.lineWrapping]}
                theme="dark"
                height="500%"
              />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCode(problem.starterCode)}>
                Reset
              </Button>
              <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={handleRunCode}>Run Code</Button>
            </div>
          </TabsContent>
          <TabsContent value="testcases" className="space-y-4">
            {output && (
              <div className="mb-4 p-3 bg-muted rounded-md font-mono text-xs whitespace-pre-wrap">{output}</div>
            )}
            {testResults.length > 0 ? (
              <TestCaseResults testCases={testResults} />
            ) : (
              <div className="rounded-md border p-4">
                <h3 className="font-medium text-sm mb-2">Example Test Cases</h3>
                {problem.examples.map((example, index) => (
                  <div key={index} className="text-xs font-mono mb-2">
                    <span className="font-semibold">Test {index + 1}:</span> {example.input}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}