"use client"

import { useState } from "react"
import ChatSidebar from "@/components/chat-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import Header from "@/components/header"
import ProblemDescription from "@/components/problem-description"
import CodeEditor from "@/components/code-editor"

const SAMPLE_PROBLEMS = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    starterCode: `def two_sum(nums, target):
    # Your code here
    pass`,
  },
  {
    id: 2,
    title: "Palindrome Number",
    difficulty: "Easy",
    description: "Given an integer x, return true if x is a palindrome, and false otherwise.",
    examples: [
      {
        input: "x = 121",
        output: "True",
        explanation: "121 reads as 121 from left to right and from right to left.",
      },
      {
        input: "x = -121",
        output: "False",
        explanation: "From left to right, it reads -121. From right to left, it becomes 121-.",
      },
    ],
    constraints: ["-2^31 <= x <= 2^31 - 1"],
    starterCode: `def is_palindrome(x):
    # Your code here
    pass`,
  },
]

export default function Dashboard() {
  const [selectedProblem, setSelectedProblem] = useState(SAMPLE_PROBLEMS[0])

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
            />
          </div>

          {/* Third column: Chat sidebar */}
          <div className="w-full md:w-1/3 lg:w-1/4 xl:w-1/4 overflow-auto">
            <ChatSidebar />
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

