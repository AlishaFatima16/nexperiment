# Nexperiment 🔬
### AI Scientist. Smarter Experiments.

**Nexperiment** is a high-velocity AI Scientist Orchestrator that transforms natural language hypotheses into full, citation-grounded experimental plans in under 90 seconds. 

Developed for the **Global Hack Nation AI Hackathon** (in association with the **MIT Sloan AI Club**), Nexperiment addresses the "cold-start" problem in research by automating literature reviews, protocols, and budgeting through a self-learning feedback loop.

---
##live demo : https://nexperiment-p2j9-nftoos25o-alishafatima2758-7682s-projects.vercel.app/
## 🖥️ The Interface
!dashboard<img width="720" height="337" alt="WhatsApp Image 2026-04-27 at 1 42 26 PM" src="https://github.com/user-attachments/assets/a8702345-5ed3-4aae-88f6-364d5e28b8a0" />

*A centralized research hub featuring real-time protocol generation, budget estimations, and scientist-in-the-loop feedback.*

---

## 🧠 Architectural Blueprint
Nexperiment utilizes a sophisticated multi-agent fan-out architecture to ensure academic rigor and high-speed delivery.

![System Architecture]<img width="1384" height="1600" alt="WhatsApp Image 2026-04-26 at 6 41 42 PM" src="https://github.com/user-attachments/assets/d92ce145-7e5f-4274-bfe0-16d6fdc7c47b" />


### The Orchestration Pipeline:
1. **Hypothesis Parsing:** LLM-driven extraction into structured JSON segments.
2. **Literature QC:** Parallel web search grounding via Tavily to ensure research viability.
3. **Agent Fan-out:** 5 specialized sub-agents (Protocol, Materials, Budget, Timeline, Validation) execute in parallel.
4. **Real-time Streaming:** Finalized sections are streamed via **Server-Sent Events (SSE)** for zero-latency user feedback.
5. **Knowledge Store:** A Postgres-backed memory layer that captures "Scientist Edits" to refine the self-learning feedback loop.

---

## ✨ Core Features
* **🔬 Citation-Grounded Lit Review:** Real-time retrieval of academic sources ensuring every plan is backed by data.
* **🧪 Realistic Protocols:** Executable, step-by-step instructions tailored to specific scientific constraints.
* **💰 Dynamic Budgeting:** Intelligent cost estimation based on required materials and current market rates.
* **🔄 Self-Learning Loop:** Incorporates expert feedback into a "Learning Memory" to refine AI reasoning over time.
* **⚡ Ultra-Fast Inference:** Powered by **Groq** (LPU Inference) for near-instant reasoning cycles.

---

## 🛠️ Tech Stack
| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, TailwindCSS, shadcn/ui |
| **Orchestrator** | Node.js, Express, Server-Sent Events (SSE) |
| **AI Engine** | Groq LLM (LPU Architecture) |
| **Search/RAG** | Tavily AI (Academic grounding) |
| **Persistence** | Postgres + Feedback Memory Store |

---
##🏁 Getting Started
#1. Prerequisites
Before you begin, ensure you have the following installed:
Node.js (v18 or higher)
npm or yarn
A Postgres database (for the Knowledge Store)
#2. Installation
Clone the repository: git clone https://github.com/AlishaFatima16/nexperiment.git
Navigate into the folder: cd nexperiment
Install dependencies: npm install
#3. Environment Configuration
Create a file named .env in the root directory. Paste the following and replace the placeholders with your actual keys:
PORT=3001
GROQ_API_KEY=your_groq_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
DATABASE_URL=your_postgresql_connection_string
#4. Run the Application
Start the backend: npm run server
In a new terminal, start the frontend: npm run dev
##🗺️ Roadmap & Future Capabilities
Autonomous Scientist Agent: Transitioning from plan generation to active task management.
Fine-tuning Signal: Using scientist-led corrections as a dataset to fine-tune the model.
Lab Collaboration Suite: Multi-user workspaces for real-time peer review.
##🤝 The Team
Alisha Fatima – https://github.com/AlishaFatima16
Shazima Kiran – https://github.com/shazimakiran70-hash
📜 License
Distributed under the MIT License.
Developed for the Global Hack Nation 2026 AI Hackathon.

```bash
git clone [https://github.com/AlishaFatima16/nexperiment.git](https://github.com/AlishaFatima16/nexperiment.git)
cd nexperiment
