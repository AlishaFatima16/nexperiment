# Nexperiment

> From hypothesis to citation-grounded experiment plan in 90 seconds.

Built for the Global Nation Hackathon — Challenge 04 (AI Scientist, Fulcrum Science).

**Live demo:** https://nexperiment-p2j9.vercel.app/

---

## What it does

Paste a scientific hypothesis. Get a complete, runnable experiment plan in 90 seconds — every claim grounded in real, clickable papers retrieved live from the literature.

- **Literature QC** — novelty assessment (Novel / Partially Novel / Established)
- **5 streamed sections** — Protocol, Materials, Budget, Timeline, Validation
- **Trust Panel** — 5 verified sources from live web retrieval
- **Clickable inline citations** — hover any `[1]` to see the source paper
- **Copy as Markdown** — take the entire plan home

---

## Architecture

<img width="1800" height="2080" alt="nexperiment_architecture" src="https://github.com/user-attachments/assets/39aba1aa-9ae0-42e0-a91b-79f80b1d1506" />


Six AI sub-agents work in parallel:
- **1 novelty agent** — assesses how novel the hypothesis is
- **5 specialist agents** — Protocol, Materials, Budget, Timeline, Validation

All six run concurrently via `Promise.allSettled` with retry-on-429 backoff. Tokens stream back to the frontend over Server-Sent Events.

---

## Tech stack

- **Frontend:** React + Vite + TypeScript + Tailwind + shadcn/ui
- **Backend:** Node.js + Express, Server-Sent Events
- **AI:** Google Gemini (6 parallel agents)
- **Retrieval:** Tavily Search API
- **Deploy:** Vercel

---

## Run locally

```bash
npm install
# .env.local with GEMINI_API_KEY and TAVILY_API_KEY
npm run dev          # frontend on :8080
npx tsx watch server.ts   # backend on :3001
