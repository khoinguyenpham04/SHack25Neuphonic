export const sampleTestResults = [
  {
    testNumber: 1,
    input: '[1, 2]',
    expectedOutput: '3',
    userOutput: '3',
    executionTime: '15ms',
    success: true,
    message: 'Test passed successfully'
  },
  {
    testNumber: 2,
    input: '[5, 7]',
    expectedOutput: '12',
    userOutput: '12',
    executionTime: '12ms',
    success: true,
    message: 'Test passed successfully'
  },
  {
    testNumber: 3,
    input: '[0, 0]',
    expectedOutput: '0',
    userOutput: '-1',
    executionTime: '18ms',
    success: false,
    message: 'Expected 0 but got -1'
  },
  {
    testNumber: 4,
    input: '[-1, 1]',
    expectedOutput: '0',
    userOutput: 'Error',
    executionTime: '25ms',
    success: false,
    message: 'Runtime Error: Division by zero'
  },
  {
    testNumber: 5,
    input: '[10, -5]',
    expectedOutput: '5',
    userOutput: '5',
    executionTime: '14ms',
    success: true,
    message: 'Test passed successfully'
  }
];

export type TestResult = {
  testNumber: number;
  input: string;
  expectedOutput: string;
  userOutput: string;
  executionTime: string;
  success: boolean;
  message: string;
};