"use client"

import { TestResultList } from "@/types/testResults"
import { CheckCircle2, XCircle } from "lucide-react"


interface TestCaseResultsProps {
  testCases: TestResultList
}

export function TestCaseResults({ testCases }: TestCaseResultsProps) {

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="grid grid-cols-6 gap-4 p-4 bg-muted text-sm font-medium">
          <div>Test Case</div>
          <div className="col-span-2">Input</div>
          <div>Expected</div>
          <div>Output</div>
          <div>Time</div>
        </div>
        <div className="divide-y">
          {testCases.map((test) => (
            <div
              key={test.testNumber}
              className="grid grid-cols-6 gap-4 p-4 text-sm items-center hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                {test.success ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span>Case {test.testNumber}</span>
              </div>
              <div className="col-span-2 font-mono">
                {test.input}
              </div>
              <div className="font-mono overflow-hidden text-ellipsis">
                {test.expectedOutput}
              </div>
              <div className="font-mono overflow-hidden text-ellipsis">
                {test.userOutput}
              </div>
              <div className="text-muted-foreground">

                {(parseFloat(test.executionTime) * 1000).toFixed(3)} ms
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}