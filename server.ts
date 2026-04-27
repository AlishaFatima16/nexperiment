import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import express from "express";
import cors from "cors";
import { tavily } from "@tavily/core";
import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("Tavily key loaded:", !!process.env.TAVILY_API_KEY);
console.log("Gemini key loaded:", !!process.env.GEMINI_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY! });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

app.post("/api/plan", async (req, res) => {
  const { hypothesis } = req.body ?? {};
  if (!hypothesis || typeof hypothesis !== "string") {
    return res.status(400).json({ error: "hypothesis (string) is required" });
  }
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
  const send = (event: string, data: unknown) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };
  try {
    console.log("[plan] hypothesis:", hypothesis);
    const search = await tvly.search(hypothesis, {
      searchDepth: "advanced",
      maxResults: 5,
    });
    console.log("[plan] tavily results:", search.results.length);
    const sources = search.results.slice(0, 5).map((r, i) => ({
      id: i + 1,
      title: r.title,
      url: r.url,
    }));
    sources.forEach((s) => send("source", s));
    const sourcesBlock = sources
      .map((s) => `[${s.id}] ${s.title} - ${s.url}`)
      .join("\n");
    const buildPrompt = (instruction: string) => `You are a bench scientist. Given this hypothesis:
"${hypothesis}"
And these sources:
${sourcesBlock}
${instruction}
Cite sources inline as [1], [2], etc. Plain text only, no markdown headers.`;
    const protocolPrompt   = buildPrompt("Write a concise, runnable PROTOCOL section as 8-12 numbered steps.");
    const materialsPrompt  = buildPrompt("List MATERIALS & REAGENTS as a bulleted list with quantities and supplier hints where reasonable.");
    const budgetPrompt     = buildPrompt("Estimate a BUDGET as a line-item list with USD costs and a total. Be realistic for an academic lab.");
    const timelinePrompt   = buildPrompt("Give a TIMELINE as a day-by-day or week-by-week bulleted plan.");
    const validationPrompt = buildPrompt("Describe VALIDATION & CONTROLS: positive controls, negative controls, statistical analysis, and success criteria.");
    const runAgent = async (eventName: string, prompt: string) => {
      const attempt = async () => {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContentStream(prompt);
        let charCount = 0;
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            charCount += text.length;
            send(eventName, { chunk: text });
          }
        }
        return charCount;
      };
      try {
        console.log(`[${eventName}] starting...`);
        let charCount = 0;
        try {
          charCount = await attempt();
        } catch (err: any) {
          const msg = String(err?.message ?? err);
          const retryable = /503|429|Service Unavailable|RESOURCE_EXHAUSTED|ETIMEDOUT/i.test(msg);
          if (!retryable) throw err;
          console.warn(`[${eventName}] retryable error, retrying in 1500ms:`, msg);
          await new Promise((r) => setTimeout(r, 1500));
          charCount = await attempt();
        }
        console.log(`[${eventName}] done, ${charCount} chars sent`);
      } catch (err: any) {
        console.error(`[${eventName}] ERROR:`, err?.message ?? err);
        send(eventName, { chunk: `\n[Error generating ${eventName}: ${err?.message ?? err}]\n` });
      }
    };
    console.log("[plan] launching 5 agents...");
    await Promise.allSettled([
      runAgent("text",       protocolPrompt),
      runAgent("materials",  materialsPrompt),
      runAgent("budget",     budgetPrompt),
      runAgent("timeline",   timelinePrompt),
      runAgent("validation", validationPrompt),
      runAgent(
        "novelty",
        buildPrompt(
          "Write a NOVELTY ASSESSMENT in 3-5 sentences. State whether the hypothesis is novel, partially novel, or already well-established, based ONLY on the cited sources. Begin the response with one of: 'NOVEL:', 'PARTIALLY NOVEL:', or 'ESTABLISHED:'. Then briefly explain why, citing sources [1]-[5]."
        )
      ),
    ]);
    console.log("[plan] all 5 agents settled");
    send("done", { ok: true });
    res.end();
  } catch (err: any) {
    console.error("[plan] ERROR:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: String(err?.message ?? err) });
    } else {
      send("error", { error: String(err?.message ?? err) });
      res.end();
    }
  }
});

const PORT = process.env.PORT || 3001;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;