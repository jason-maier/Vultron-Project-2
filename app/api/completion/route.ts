import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

// export async function POST(req: Request) {
//   const { prompts } = await req.json();

//   const response = await openai.completions.create({
//     model: "gpt-3.5-turbo-instruct",
//     max_tokens: 1000,
//     temperature: 0.7,
//     prompt: prompts,
//   });

//   // const stream = OpenAIStream(response as Response);
//   // const stream = OpenAIStream(response) as AsyncIterableOpenAIStreamReturnTypes;

//   const stream = OpenAIStream(response);
//   return new StreamingTextResponse(stream);
// }

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { prompt } = await req.json();

  // Ask OpenAI for a streaming completion given the prompt
  const responses = await openai.completions.create({
    model: "gpt-3.5-turbo-instruct",
    max_tokens: 2000,
    prompt,
  });

  return NextResponse.json(responses);
}
