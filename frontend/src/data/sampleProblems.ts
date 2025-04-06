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
    },
    {
      id: 4,
      title: "3Sum",
      difficulty: "Medium",
      description:
        "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. Notice that the solution set must not contain duplicate triplets.",
      examples: [
        {
          input: "nums = [-1,0,1,2,-1,-4]",
          output: "[[-1,-1,2],[-1,0,1]]",
          explanation: "The distinct triplets are [-1,0,1] and [-1,-1,2]."
        },
        {
          input: "nums = [0,1,1]",
          output: "[]",
          explanation: "The only possible triplet does not sum up to 0."
        },
        {
          input: "nums = [0,0,0]",
          output: "[[0,0,0]]",
          explanation: "The only possible triplet sums up to 0."
        }
      ],
      constraints: [
        "3 <= nums.length <= 3000",
        "-10^5 <= nums[i] <= 10^5"
      ],
      starterCode: `def solution(nums):\n    # Your code here\n    pass`
    },
    {
      id: 5,
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      description:
        "Given a string s, find the length of the longest substring without repeating characters.",
      examples: [
        {
          input: 's = "abcabcbb"',
          output: "3",
          explanation: 'The answer is "abc", with the length of 3.'
        },
        {
          input: 's = "bbbbb"',
          output: "1",
          explanation: 'The answer is "b", with the length of 1.'
        },
        {
          input: 's = "pwwkew"',
          output: "3",
          explanation: 'The answer is "wke", with the length of 3.'
        }
      ],
      constraints: [
        "0 <= s.length <= 5 * 10^4",
        "s consists of English letters, digits, symbols, and spaces."
      ],
      starterCode: `def solution(s):\n    # Your code here\n    pass`
    },
    {
      id: 6,
      title: "Median of Two Sorted Arrays",
      difficulty: "Hard",
      description:
        "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
      examples: [
        {
          input: "nums1 = [1,3], nums2 = [2]",
          output: "2.00000",
          explanation: "merged array = [1,2,3] and median is 2."
        },
        {
          input: "nums1 = [1,2], nums2 = [3,4]",
          output: "2.50000",
          explanation: "merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5."
        }
      ],
      constraints: [
        "nums1.length == m",
        "nums2.length == n",
        "0 <= m <= 1000",
        "0 <= n <= 1000",
        "1 <= m + n <= 2000",
        "-10^6 <= nums1[i], nums2[i] <= 10^6"
      ],
      starterCode: `def solution(nums1, nums2):\n    # Your code here\n    pass`
    },
  ]