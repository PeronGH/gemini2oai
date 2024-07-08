# Gemini2OAI

Convert Gemini API to OpenAI API.

## Getting Started

### Self-Hosted

```sh
deno run -A main.ts
```

### Serverless

Set the `base_url` of OpenAI SDK to `https://gemini-to-openai.deno.dev/v1`.

Use the key from Google AI Studio as the `api_key`.

## Notes

### Model Mapping

- Gemini models -> Unchanged
- `gpt-4o` -> `gemini-1.5-pro`
- Other OpenAI models -> `gemini-1.5-flash`
