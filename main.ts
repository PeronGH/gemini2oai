import {
  catchError,
  internalServerError,
  post,
  route,
  routes,
  verbs,
} from "@pixel/funweb";
import { handleChatCompletion } from "./api.ts";
import { GoogleGenerativeAIFetchError } from "@google/generative-ai";

const handler = routes(
  route(
    "/v1/chat/completions",
    verbs(
      post(handleChatCompletion),
    ),
  ),
  catchError((error) => {
    if (error instanceof GoogleGenerativeAIFetchError) {
      return new Response(error.message, {
        status: error.status,
        statusText: error.statusText,
      });
    }
    console.error("[CAUGHT ERROR]", error);
    return internalServerError();
  }),
);

Deno.serve(handler);
