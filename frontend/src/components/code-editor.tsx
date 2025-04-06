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
import { Play, Pause, RotateCcw, Timer, Home, RotateCw } from 'lucide-react';
import { evaluateUserCode } from "@/services/evaluateCode"
import { TestCaseResults } from "./test-case-results"
import { TestResultList } from "@/types/testResults"
import Link from "next/link"

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
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const highlightRef = useRef<HTMLPreElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

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

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((time) => time + 10)
      }, 10)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  const handleStartStop = () => {
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTime(0)
  }

  const handleSubmit = () => {
    const currentIndex = problems.findIndex(p => p.id === selectedProblemId)
    const nextIndex = (currentIndex + 1) % problems.length
    const nextProblem = problems[nextIndex]
    onSelectProblem(nextProblem)
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const centiseconds = Math.floor((ms % 1000) / 10)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`
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
            <div className="flex items-center gap-4 overflow-hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="max-w-[200px] truncate">
                    <span className="truncate">Problem: {problems.find((p) => p.id === selectedProblemId)?.title}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 max-h-[300px] overflow-y-auto">
                  {problems.map((problem) => (
                    <DropdownMenuItem
                      key={problem.id}
                      onClick={() => onSelectProblem(problems.find((p) => p.id === problem.id)!)}
                      className="flex justify-between"
                    >
                      <span className="truncate mr-2">{problem.title}</span>
                      <span className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md px-3 py-2">
                  <Timer size={16} />
                  <span className="font-mono text-sm">{formatTime(time)}</span>
                  <Button
                    onClick={handleStartStop}
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0 hover:bg-blue-700"
                  >
                    {isRunning ? <Pause size={14} /> : <Play size={14} />}
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0 hover:bg-blue-700"
                  >
                    <RotateCcw size={14} />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={handleSubmit}>Next</Button>
                </div>
              </div>
            </div>
          </div>
        </Tabs>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsContent value="code" className="flex-1 flex flex-col">
            <div className="flex-1 relative">
              <Editor
                value={code}
                onChange={setCode}
                extensions={[python(), foldGutter(), EditorView.lineWrapping]}
                theme="dark"
                height="95%"
                className="h-full"
              />
            </div>
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <Link href="/"><Home size={16} /> Home</Link>
                </Button>
                <Button variant="outline" onClick={() => setCode(problem.starterCode)} className="flex items-center gap-2">
                  <RotateCw size={16} /> Reset
                </Button>
              </div>
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