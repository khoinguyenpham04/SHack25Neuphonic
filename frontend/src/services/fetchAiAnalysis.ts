export async function fetchAiAnaysis(code: string, description: string): Promise<any> {
  try {
    const response = await fetch('', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        language: 'python',
        problemDescription: description,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get AI analysis');
    }

    return response.json();

  } catch (error) {
    console.error('Error getting AI analysis:', error);

  }

}





