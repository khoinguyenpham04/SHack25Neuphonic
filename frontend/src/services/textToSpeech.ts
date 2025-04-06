// services/textToSpeech.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface TextToSpeechRequest {
  text: string;
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  instructions?: string;
}

export async function generateSpeech({ 
  text, 
  voice = 'nova',
  instructions = 'Speak in a natural, conversational tone.'
}: TextToSpeechRequest): Promise<ArrayBuffer> {
  try {
    const response = await openai.audio.speech.create({
      model: 'gpt-4o-mini-tts',
      voice,
      input: text,
      instructions,
      response_format: 'mp3',
    });

    return response.arrayBuffer();
  } catch (error) {
    console.error('Error generating speech:', error);
    throw error;
  }
}

export function playAudioBuffer(audioBuffer: ArrayBuffer) {
  const blob = new Blob([audioBuffer], { type: 'audio/mp3' });
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  
  audio.onended = () => {
    URL.revokeObjectURL(url);
  };

  return audio.play();
}