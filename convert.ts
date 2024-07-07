import type {
  EnhancedGenerateContentResponse,
  GenerateContentRequest,
} from "@google/generative-ai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import type { OpenAI } from "openai";

export function convertOaiReqToGemini(
  oaiReq: OpenAI.ChatCompletionCreateParams,
): GenerateContentRequest {
  const request: GenerateContentRequest = {
    contents: [],
    generationConfig: {
      topP: oaiReq.top_p ?? undefined,
      temperature: oaiReq.temperature ?? undefined,
      maxOutputTokens: oaiReq.max_tokens ?? undefined,
      stopSequences: typeof oaiReq.stop === "string"
        ? [oaiReq.stop]
        : oaiReq.stop ?? undefined,
      // The following line is disabled due to lack of support in response
      // candidateCount: oaiReq.n ?? undefined,
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ],
  };

  oaiReq.messages.forEach((message, i) => {
    switch (message.role) {
      case "system":
        if (i === 0) {
          request.systemInstruction = message.content;
        }
        break;
      case "user":
        if (typeof message.content === "string") {
          request.contents.push({
            parts: [{ text: message.content }],
            role: "user",
          });
          break;
        }

        // TODO: handle image input

        break;
      case "assistant":
        if (typeof message.content === "string") {
          request.contents.push({
            parts: [{ text: message.content }],
            role: "model",
          });
          break;
        }

        // TODO: handle tool use

        break;
      case "tool":
        break;
    }
  });

  return request;
}

export async function* extractTextFromStream(
  stream: AsyncGenerator<EnhancedGenerateContentResponse>,
) {
  for await (const chunk of stream) {
    yield chunk.text();
  }
}