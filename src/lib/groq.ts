import Groq from "groq-sdk";

// Initialize the client with your provided key
export const groq = new Groq({
  apiKey: "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",
  dangerouslyAllowBrowser: true,
});

/**
 * Interface representing the social media post structure
 */
export interface SocialPost {
  id: number; // Changed to number to match existing Post interface
  username: string;
  handle: string;
  content: string;
  timestamp: string;
  type: "Verified" | "Misinformation";
  reasoning: string; // Used for the educational breakdown modal
}

const SYSTEM_PROMPT = `You are a content engine for a disinformation research project. Generate a JSON object representing a social media post.
The 'type' must be either 'Verified' (reliable news) or 'Misinformation' (deceptive/fake).
For 'Misinformation', include subtle linguistic markers: sensationalism, urgent tone, or unverifiable claims.
Return ONLY raw JSON.`;

export const generateDynamicPost = async (): Promise<SocialPost> => {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: "Generate one random social media post for the feed." }
    ],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    temperature: 0.8,
  });

  const rawContent = chatCompletion.choices[0]?.message?.content || "{}";
  const generatedPost: Omit<SocialPost, 'id' | 'timestamp'> = JSON.parse(rawContent);

  // Assign a unique ID and timestamp
  return {
    ...generatedPost,
    id: Date.now(),
    timestamp: new Date().toISOString(),
  } as SocialPost;
};
