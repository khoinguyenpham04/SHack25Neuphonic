import { TestResultList } from "@/types/testResults"

export async function evaluateUserCode(problem: number, code: string): Promise<TestResultList> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://34.147.180.254:3001";
  console.log("Using API URL:", apiUrl);

  try {
    const response = await fetch(`${apiUrl}/eval`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        problem_name: problem,
        user_code: code,
      }),
    })

    if (!response.ok) {
      console.log(response)
      throw new Error("Failed to evaluate code")
    }

    const data = await response.json()

    const rawTestResults = data?.body?.testResults || data?.testResults || []

    const testResults: TestResultList = rawTestResults.map((test: {
      test_case: number;
      input: unknown;
      expected_output: unknown;
      user_output: unknown;
      execution_time: number;
      success: boolean;
    }) => ({
      testNumber: test.test_case ?? -1,
      input: JSON.stringify(test.input),
      expectedOutput: JSON.stringify(test.expected_output),
      userOutput: JSON.stringify(test.user_output),
      executionTime:
        typeof test.execution_time === "number"
          ? test.execution_time.toFixed(8)
          : "N/A",
      success: !!test.success,
      message: test.success ? "Passed" : "Failed"
    }));

    console.log(testResults)
    return testResults

    
  } catch (err) {
    console.error("Evaluation error:", err)
    throw err
  }
}


