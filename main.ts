import {
  catchError,
  internalServerError,
  post,
  route,
  routes,
  verbs,
} from "jsr:@pixel/funweb";
import { handleChatCompletion } from "./api.ts";

const handler = routes(
  route(
    "/v1/chat/completions",
    verbs(
      post(handleChatCompletion),
    ),
  ),
  catchError((req) => {
    console.error("[CAUGHT ERROR]", req.error);
    return internalServerError(req);
  }),
);

Deno.serve(handler);
