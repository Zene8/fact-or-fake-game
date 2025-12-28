import Groq from "groq-sdk";

export const groq = new Groq({
  apiKey: "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",
  dangerouslyAllowBrowser: true, 
});

const SYSTEM_PROMPT = `
You are a social media simulator for a disinformation research project. 
Generate a JSON object representing a single post.
Include the following fields: 
- content (string, the post text)
- type (either 'Verified' or 'Misinformation')
- reasoning (string, 1-2 sentences explaining why it is fake or how to spot the markers).
For Misinformation, use sensationalist language, urgent calls to action, or unverifiable health/political claims.
Return ONLY raw JSON.
`;

export const generateDynamicPost = async () => {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: "Generate a random post for the feed." }
    ],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    temperature: 0.8,
  });

  const raw = chatCompletion.choices[0]?.message?.content || "{}";
  return JSON.parse(raw);
};