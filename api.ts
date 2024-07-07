import type { OpenAI } from "openai";
import { unauthorized } from "./utils.ts";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  convertOaiReqToGemini,
  extractTextFromStream,
  mapModel,
} from "./convert.ts";
import { chatCompletion, chatCompletionStreamResponse } from "@pixel/myoai";

export async function handleChatCompletion(req: Request): Promise<Response> {
  const authorization = req.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return unauthorized();
  }

  // Extract API key and request
  const apiKey = authorization.slice("Bearer ".length);
  const oaiReq: OpenAI.ChatCompletionCreateParams = await req.json();
  const geminiReq = convertOaiReqToGemini(oaiReq);

  const model = mapModel(oaiReq.model);

  // Send request to Gemini
  const gemini = new GoogleGenerativeAI(apiKey)
    .getGenerativeModel({ model });

  // Handle streaming request
  if (oaiReq.stream) {
    const { stream } = await gemini.generateContentStream(geminiReq);
    return chatCompletionStreamResponse(extractTextFromStream(stream));
  }

  // Handle non-streaming request
  const { response } = await gemini.generateContent(geminiReq);
  return Response.json(
    chatCompletion({
      content: response.text(),
      prompt_tokens: response.usageMetadata?.promptTokenCount,
      completion_tokens: response.usageMetadata?.candidatesTokenCount,
    }),
  );
}
