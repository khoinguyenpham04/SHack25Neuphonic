import { NextResponse } from 'next/server';
import { createClient, toWav } from '@neuphonic/neuphonic-js';

export async function POST(req: Request) {
  try {
    const { feedback } = await req.json();

    if (!feedback) {
      return NextResponse.json({ error: 'Missing feedback' }, { status: 400 });
    }

    // Initialize the TTS client with your API key
    const client = createClient({ apiKey: process.env.NEUPHONIC_API_KEY});

    // Start the TTS SSE (Server Sent Events) stream
    const sse = await client.tts.sse({
      speed: 1,
      lang_code: 'en',
    });

    // Send the feedback to generate audio
    const result = await sse.send(feedback);

    // Ensure that result.audio is valid
    if (!result || !result.audio) {
      console.error('No audio returned from TTS service.');
      return NextResponse.json({ error: 'No audio data returned' }, { status: 500 });
    }

    // Convert the AudioBuffer (or similar) to WAV data
    const wavData = toWav(result.audio);

    // Check that we got more than just a header (44 bytes)
    if (!wavData || wavData.length <= 44) {
      console.error('Invalid WAV output, length:', wavData ? wavData.length : 0);
      return NextResponse.json({ error: 'Invalid WAV output' + wavData }, { status: 500 });
    }

    return new Response(wavData, {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': wavData.length.toString(),
        // Optional: force inline playback or download
        // 'Content-Disposition': 'inline; filename="feedback.wav"'
      },
    });
  } catch (err: any) {
    console.error('TTS error:', err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
