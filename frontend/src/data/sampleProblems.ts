import { SampleProblem } from "@/types/problems";

export const SAMPLE_PROBLEMS: SampleProblem[] = [
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
          explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
        },
        {
          input: "nums = [3,2,4], target = 6",
          output: "[1,2]",
          explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
        }
      ],
      constraints: [
        "2 <= nums.length <= 10^4",
        "-10^9 <= nums[i] <= 10^9",
        "-10^9 <= target <= 10^9",
        "Only one valid answer exists."
      ],
      starterCode: `def solution(nums, target):
      # Your code here
      pass`
    },
    {
      id: 2,
      title: "Palindrome Number",
      difficulty: "Easy",
      description:
        "Given an integer x, return true if it reads the same forward and backward as a palindrome, and false otherwise. For instance, 121 is a palindrome, but 123 is not since it reverses to 321.",
      examples: [
        {
          input: "x = 121",
          output: "True",
          explanation: "121 reads as 121 from left to right and from right to left."
        },
        {
          input: "x = -121",
          output: "False",
          explanation: "From left to right, it reads -121. From right to left, it becomes 121-."
        }
      ],
      constraints: ["-2^31 <= x <= 2^31 - 1"],
      starterCode: `def solution(x):
      # Your code here
      pass`
    },
    {
      id: 3,
      title: "Valid Parentheses",
      difficulty: "Easy",
      description:
        "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if:\n\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
      examples: [
        {
          input: 's = "()"',
          output: "true",
          explanation: "The string is a single pair of matching parentheses, which is valid."
        },
        {
          input: 's = "(]"',
          output: "false",
          explanation: "The string has mismatched brackets: '(' is not closed by ')'."
        }
      ],
      constraints: [
        "1 <= s.length <= 10^4",
        "s consists of parentheses only '()[]{}'."
      ],
      starterCode: `def solution(s):
      # Your code here
      pass`
    }
  ]