# 🎼 Founders Orchestra — Team Guide

> **Read this first.** This guide explains the project structure, tech stack, and how work is divided among the team.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
copy .env.example .env.local
# Then edit .env.local with your actual values (MongoDB URI, Google API key, Tavily API key, etc.)

# 3. Start the development server
npm run dev

# 4. Open in browser
# Go to http://localhost:3000
```

> **💡 Tip:** You can use the "Load Demo" button on the landing page to see the dashboard without needing any API keys!

---

## 📁 Project Structure

```
founder_orchestra/
│
├── app/                        ← PAGES & API ROUTES (Next.js App Router)
│   ├── page.tsx                ← Landing page (/)
│   ├── layout.tsx              ← Root layout (fonts, dark mode lock, providers)
│   ├── globals.css             ← Global styles (Always-dark FounderOS design)
│   ├── dashboard/
│   │   ├── layout.tsx          ← Dashboard layout (sidebar + topbar)
│   │   └── page.tsx            ← Main dashboard composed of all sections
│   └── api/
│       ├── orchestrate/route.ts ← POST: Trigger AI agents (streaming SSE)
│       ├── projects/route.ts    ← GET/POST: CRUD for projects
│       ├── report/route.ts      ← POST: Generate PDF report
│       └── auth/[...nextauth]/route.ts ← Auth endpoints
│
├── components/                 ← REUSABLE UI COMPONENTS
│   ├── ui/                     ← shadcn/ui primitives (button, card, dialog, etc.)
│   ├── dashboard/              ← Dashboard-specific sections (13+ components)
│   │   ├── sidebar.tsx         ← Left navigation sidebar
│   │   ├── topbar.tsx          ← Sticky top bar
│   │   ├── agent-orbit.tsx     ← SVG donut & agent status
│   │   ├── stats-row.tsx       |
│   │   ├── market-sizing.tsx   |
│   │   ├── trend-list.tsx      |
│   │   ├── ...                 ← Various other section components
│   │   └── pdf-export-modal.tsx ← Modal for report generation
│   └── landing/                ← Deprecated/replaced by app/page.tsx
│
├── lib/                        ← CORE LOGIC & UTILITIES
│   ├── agents/                 ← LangGraph AI Agent System
│   │   ├── config.ts           ← Agent configurations & prompts
│   │   ├── base-agent.ts       ← LangGraph ReAct & Structured Output runners
│   │   └── orchestrator.ts     ← Coordinates waves of agents
│   ├── db/                     ← Database
│   │   ├── mongodb.ts          ← MongoDB connection
│   │   └── models/             ← Project & User schemas
│   ├── pdf/
│   │   └── report-template.tsx ← PDF report layout
│   ├── store/
│   │   └── project-store.ts    ← Zustand state management
│   ├── types/
│   │   └── index.ts            ← ALL TypeScript type definitions
│   ├── mock-data.ts            ← Sample FitCoach AI data for development
│   ├── auth.ts                 ← NextAuth configuration
│   └── utils.ts                ← Utility functions (cn, etc.)
│
├── .env.example                ← Environment variable template
├── package.json                ← Dependencies & scripts
└── TEAM_GUIDE.md               ← This file!
```

---

## 👥 Team Division

*Note: The core boilerplate, design system, component layouts, and LangGraph architecture have been completed. The tasks below represent the remaining work to make the app production-ready.*

### Team Member A: Frontend Lead
**Focus:** Everything the user SEES and INTERACTS with.

| File/Folder | What to do |
|---|---|
| `components/dashboard/*` | Refine component interactions & responsiveness |
| `components/ui/*` | Add loading states & skeletons |
| `app/dashboard/page.tsx` | Manage component lifecycle during data loading |
| `lib/store/project-store.ts` | Expand state for notifications & history |

**Key TODOs:**
- [x] Add loading skeletons for dashboard sections while agents are running.
- [x] Implement micro-animations using Framer Motion (e.g., when agent statuses change).
- [x] Make the dashboard fully responsive (convert sidebar to a hamburger menu on mobile).
- [x] Add toast notifications (via shadcn `use-toast`) for success/error states.
- [x] Implement a "Project History" page allowing users to view past runs.
- [x] Add interactive tooltips to the Recharts components (Market Sizing).

**Tips:**
- Use `npm run dev` to see changes live.
- The "Load Demo" button lets you work on the dashboard without hitting APIs.
- Refer to [ui.shadcn.com](https://ui.shadcn.com) for adding any new UI components.

---

### Team Member B: AI/Agent Lead
**Focus:** The AI agents — what they do, how they think, what they output.

| File/Folder | What to do |
|---|---|
| `lib/agents/config.ts` | Refine system prompts and add few-shot examples |
| `lib/agents/base-agent.ts` | Implement streaming and LangGraph checkpoints |
| `lib/agents/orchestrator.ts` | Improve multi-agent context sharing |

**Key TODOs:**
- [x] Refine system prompts in `config.ts` for even better, more domain-specific structured outputs.
- [x] Add few-shot examples to prompts (show the AI exactly what good output looks like).
- [ ] Implement streaming support so partial agent reasoning text streams into the UI in real-time.
- [ ] Add human-in-the-loop approvals using LangGraph checkpointing (e.g., pausing after architecture design for user feedback).
- [ ] Experiment with different Gemini models (Flash vs. Pro) to optimize for speed vs. deep reasoning.
- [ ] Expand the Tavily web search depth and consider adding more tools (e.g., GitHub repo scraping).

**Tips:**
- System prompts are the #1 lever for output quality — iterate on them heavily!
- Use Google AI Studio to test prompts quickly: [aistudio.google.com](https://aistudio.google.com).
- Reference the [LangGraph.js documentation](https://langchain-ai.github.io/langgraphjs/) for checkpointing & state management.

---

### Team Member C: Backend Lead
**Focus:** Database, authentication, APIs, PDF generation, deployment.

| File/Folder | What to do |
|---|---|
| `lib/db/mongodb.ts` | finalize DB connection logic |
| `lib/auth.ts` | NextAuth configuration |
| `app/api/*` | API route security & validation |
| `lib/pdf/report-template.tsx` | PDF layout generation |

**Key TODOs:**
- [ ] Set up a MongoDB Atlas cluster and add the connection string to Vercel/environment.
- [ ] Finish NextAuth.js setup with the MongoDB adapter to support user accounts.
- [ ] Implement proper PDF report generation using `@react-pdf/renderer` in the export route.
- [ ] Add input validation (using Zod) and sanitization to all API routes.
- [ ] Set up Vercel deployment with environment variables securely injected.
- [ ] Add a health check endpoint (`/api/health`) and API rate limiting.

**Tips:**
- MongoDB Atlas free tier: [cloud.mongodb.com](https://cloud.mongodb.com).
- Vercel deployment: push to Git and connect your repo at [vercel.com](https://vercel.com).
- Test API routes thoroughly with VS Code REST Client or Postman.

---

## 🛠 Tech Stack Cheat Sheet

| Technology | What it is | Documentation |
|---|---|---|
| **Next.js 16** | React framework (pages, routing, API) | [nextjs.org/docs](https://nextjs.org/docs) |
| **TypeScript** | JavaScript with type safety | [typescriptlang.org](https://www.typescriptlang.org/docs/) |
| **Tailwind CSS v4** | Utility-first CSS framework | [tailwindcss.com](https://tailwindcss.com/docs) |
| **shadcn/ui** | Copy-paste UI components | [ui.shadcn.com](https://ui.shadcn.com) |
| **LangChain & LangGraph** | AI Agent & Graph Framework | [langchain-ai.github.io/langgraphjs](https://langchain-ai.github.io/langgraphjs/) |
| **Tavily** | Real-time Web Search API | [tavily.com](https://tavily.com) |
| **Zustand** | Tiny state management | [zustand.docs.pmnd.rs](https://zustand.docs.pmnd.rs/) |
| **Recharts** | React chart components | [recharts.org](https://recharts.org) |
| **Mongoose** | MongoDB object modeling | [mongoosejs.com](https://mongoosejs.com/docs/) |
| **NextAuth.js** | Authentication | [next-auth.js.org](https://next-auth.js.org) |
| **Lucide** | Icon library | [lucide.dev](https://lucide.dev) |
| **@react-pdf/renderer** | PDF generation | [react-pdf.org](https://react-pdf.org) |

---

## 📝 Development Workflow

1. **Always pull latest changes** before starting work: `git pull`
2. **Create a branch** for your feature: `git checkout -b feature/my-feature`
3. **Run dev server** while coding: `npm run dev`
4. **Test your changes** in the browser at `http://localhost:3000`
5. **Commit often** with clear messages: `git commit -m "Add sidebar animation"`
6. **Push your branch** and create a Pull Request: `git push origin feature/my-feature`

---

## ❓ Common Issues

### "Module not found" error
Run `npm install` to make sure all packages are installed.

### "MONGODB_URI is not defined"
Create a `.env.local` file by copying `.env.example` and filling in your values.

### "API key not working" or "Tavily Error"
Make sure your Google API key is in `.env.local` as `GOOGLE_GENERATIVE_AI_API_KEY`.
Make sure your Tavily Search API key is in `.env.local` as `TAVILY_API_KEY`.

### Dashboard is empty
Click "Load Demo" on the landing page to populate the app with sample data without making API calls.

### Hydration Error / Dark Reader
If you use the Dark Reader extension, it may inject CSS that breaks Next.js hydration. We've added a lock meta tag, but if you still see errors, disable Dark Reader for `localhost:3000`.
