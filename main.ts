import {
  catchError,
  internalServerError,
  post,
  route,
  routes,
  verbs,
} from "@pixel/funweb";
import { handleChatCompletion } from "./api.ts";

const handler = routes(
  route(
    "/v1/chat/completions",
    verbs(
      post(handleChatCompletion),
    ),
  ),
  catchError((error) => {
    console.error("[CAUGHT ERROR]", error);
    return internalServerError();
  }),
);

Deno.serve(handler);
