// import { NextResponse } from 'next/server';
// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(request: Request) {
//   try {
//     const { code, language, problemDescription, userInput } = await request.json();

//     // Construct the prompt for code analysis
//     const prompt = `As an AI LeetCode coach, analyze this ${language} code solution for the following problem:

// ${problemDescription}

// Code:
// ${code}

// ${userInput ? `User's Question/Input: ${userInput}\n\n` : ''}
// Provide feedback on:
// 1. Correctness
// 2. Time & Space Complexity
// 3. Code Style & Best Practices
// 4. Potential Optimizations
// 5. Edge Cases to Consider

// If there's little to no work done on the problem, don't provide feedback.
// `;

//     const completion = await openai.chat.completions.create({
//       messages: [
//         {
//           role: 'system',
//           content: 'You are an experienced programming coach specializing in algorithmic problem-solving. Provide clear, constructive feedback and suggestions for improvement.'
//         },
//         {
//           role: 'user',
//           content: prompt
//         }
//       ],
//       model: 'gpt-3.5-turbo',
//       temperature: 0.7,
//       max_tokens: 1000,
//     });

//     return NextResponse.json({
//       feedback: completion.choices[0].message.content,
//     });

//   } catch (error) {
//     console.error('Error analyzing code:', error);
//     return NextResponse.json(
//       { error: 'Failed to analyze code' },
//       { status: 500 }
//     );
//   }
// }