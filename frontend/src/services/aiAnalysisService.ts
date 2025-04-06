// service/aiAnalysisService.ts

interface AiAnalysisRequest {
  code: string
  language: string
  problemDescription: string
  userInput: string
}

interface AiAnalysisResponse {
  feedback: string
  // add any other fields your endpoint returns
}

// This function handles the POST to /api/analyse:
export async function getAiAnalysis({
  code,
  language,
  problemDescription,
  userInput
}: AiAnalysisRequest): Promise<AiAnalysisResponse> {
  const response = await fetch('/api/analyse', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      language,
      problemDescription,
      userInput,
    }),
  })

  if (!response.ok) {
    throw new Error(`AI Analysis request failed with status ${response.status}`)
  }

  return response.json()
}
