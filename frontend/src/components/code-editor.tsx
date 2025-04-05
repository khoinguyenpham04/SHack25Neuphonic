"use client"

import { useState, useRef, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import MonacoEditor from "./monaco-editor"

interface Problem {
  id: number
  title: string
  examples: {
    input: string
    output: string
    explanation?: string
  }[]
  starterCode: string
}

interface CodeEditorProps {
  problem: Problem
}

export default function CodeEditor({ problem }: CodeEditorProps) {
  const [code, setCode] = useState(problem.starterCode)
  const [output, setOutput] = useState("")
  const [activeTab, setActiveTab] = useState("code")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const highlightRef = useRef<HTMLPreElement>(null)

  // Update code when problem changes
  useEffect(() => {
    setCode(problem.starterCode)
  }, [problem.starterCode])

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

  const handleRunCode = () => {
    setOutput("Running test cases...\n\nTest case 1: Passed\nTest case 2: Passed\n\nAll test cases passed!")
    setActiveTab("testcases")
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="testcases">Test Cases</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsContent value="code" className="flex-1 flex flex-col">
            <div className="flex-1 mb-4 relative h-[300px]">
              <MonacoEditor
                value={code}
                onChange={setCode}
                language="javascript"
                theme="leetcode-dark"
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: "on",
                  glyphMargin: false,
                  folding: true,
                  lineDecorationsWidth: 10,
                  lineNumbersMinChars: 3,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: "on",
                }}
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
            <div className="rounded-md border p-4">
              <h3 className="font-medium text-sm mb-2">Example Test Cases</h3>
              {problem.examples.map((example, index) => (
                <div key={index} className="text-xs font-mono mb-2">
                  <span className="font-semibold">Test {index + 1}:</span> {example.input}
                </div>
              ))}
            </div>
            <div className="rounded-md border p-4">
              <h3 className="font-medium text-sm mb-2">Add Custom Test Case</h3>
              <textarea
                className="w-full h-20 p-2 rounded-md border text-xs font-mono"
                placeholder="Enter your custom test case here..."
              />
              <Button size="sm" className="mt-2 bg-green-500 hover:bg-green-600 text-white">
                Run
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

