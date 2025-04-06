export type TestResult = {
    testNumber: number
    input: string
    expectedOutput: string
    userOutput: string
    executionTime: string
    success: boolean
    message: string
}

export type TestResultList = TestResult[]



