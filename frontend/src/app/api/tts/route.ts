import { NextRequest } from 'next/server';
import { createClient, toWav } from '@neuphonic/neuphonic-js';

const client = createClient({ apiKey: process.env.NEUPHONIC_API_KEY || '' });

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const msg = searchParams.get('msg')?.trim();

    if (!msg) {
      return new Response(JSON.stringify({ error: 'Missing or empty `msg` parameter.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ws = await client.tts.websocket({
      speed: 1.15,
      lang_code: 'en',
    });

    const chunks: Uint8Array[] = [];
    let byteLen = 0;

    for await (const chunk of ws.send(msg)) {
      chunks.push(chunk.audio);
      byteLen += chunk.audio.byteLength;
    }

    const allAudio = new Uint8Array(byteLen);
    let offset = 0;
    for (const chunk of chunks) {
      allAudio.set(chunk, offset);
      offset += chunk.byteLength;
    }

    const wavData = toWav(allAudio);
    await ws.close();

    return new Response(Buffer.from(wavData), {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        // Optional: allow cross-origin fetches (if needed)
        // 'Access-Control-Allow-Origin': '*',

        // Optional: force download instead of playing inline
        // 'Content-Disposition': 'attachment; filename="output.wav"',
      },
    });

  } catch (error) {
    console.error('TTS Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate TTS audio' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
