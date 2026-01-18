import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const src = searchParams.get("src");

  if (!src) {
    return new Response("Missing video src", { status: 400 });
  }

  // Resolve public video path
  const videoPath = path.join(process.cwd(), "public", src);

  if (!fs.existsSync(videoPath)) {
    return new Response("Video not found", { status: 404 });
  }

  const videoBase64 = fs.readFileSync(videoPath, {
    encoding: "base64",
  });

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });

  const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: [
    {
      inlineData: {
        mimeType: "video/mp4",
        data: videoBase64,
      },
    },
    {
      text: `
You are a real-time surveillance incident summarizer.

OUTPUT RULES (STRICT):
- MAX 3 lines total
- Each line MUST start with an emoji label
- No markdown, no headings, no paragraphs
- No speculation or identity inference

FORMAT EXACTLY:

🚨 Incident: <one short sentence>
👥 Crowd behavior: <one short sentence>
⏱ Key moments: <MM:SS, MM:SS>

Focus only on visible actions and movement.
      `.trim(),
    },
  ],
});


  return Response.json({
    analysis: response.text,
  });
}
