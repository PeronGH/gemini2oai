# Gemini2OAI

Convert Gemini API to OpenAI API.

## Getting Started

### Self-Hosted

```sh
deno run -A main.ts
```

Set `base_url` to `http://localhost:8000/v1` and use your API Key from Google AI
Studio.

### Serverless

Set the `base_url` of OpenAI SDK to `https://gemini-to-openai.deno.dev/v1`.

Use the key from Google AI Studio as the `api_key`.

## Notes

### Model Mapping

- Gemini models -> Unchanged
- `gpt-4o` -> `gemini-1.5-pro`
- Other models -> `gemini-1.5-flash`
