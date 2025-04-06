// service/aiAnalysisService.ts

interface AiAnalysisRequest {
  code: string
  language: string
  problemDescription: string
  userInput: string
  harshness:string
}

interface AiAnalysisResponse {
  feedback: string

}

// This function handles the POST to /api/analyse:
export async function getAiAnalysis({
  code,
  language,
  problemDescription,
  userInput,
  harshness="average"
}: AiAnalysisRequest): Promise<AiAnalysisResponse> {
  const response = await fetch('https://gemini-processing-447767869918.europe-west2.run.app', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      language,
      problemDescription,
      userInput,
      harshness,
    }),
  })

  if (!response.ok) {
    console.log(response)
    throw new Error(`AI Analysis request failed with status ${response.status}`)
  }

  return response.json()
}
