# 🎼 Founders Orchestra — Team Guide

> **Read this first.** This guide explains the project structure, tech stack, and how work is divided among the team.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
copy .env.example .env.local
# Then edit .env.local with your actual values (MongoDB URI, API key, etc.)

# 3. Start the development server
npm run dev

# 4. Open in browser
# Go to http://localhost:3000
```

> **💡 Tip:** You can use the "Load demo data" button on the landing page to see the dashboard without needing an API key!

---

## 📁 Project Structure

```
founder_orchestra/
│
├── app/                        ← PAGES & API ROUTES (Next.js App Router)
│   ├── page.tsx                ← Landing page (/)
│   ├── layout.tsx              ← Root layout (fonts, dark mode, providers)
│   ├── globals.css             ← Global styles (Tailwind + shadcn variables)
│   ├── dashboard/
│   │   ├── layout.tsx          ← Dashboard layout (sidebar + content)
│   │   └── page.tsx            ← Dashboard page (/dashboard)
│   └── api/
│       ├── orchestrate/route.ts ← POST: Trigger AI agents (streaming)
│       ├── projects/route.ts    ← GET/POST: CRUD for projects
│       ├── report/route.ts      ← POST: Generate PDF report
│       └── auth/[...nextauth]/route.ts ← Auth endpoints
│
├── components/                 ← REUSABLE UI COMPONENTS
│   ├── ui/                     ← shadcn/ui primitives (button, card, etc.)
│   ├── dashboard/              ← Dashboard-specific components
│   │   ├── sidebar.tsx         ← Left navigation sidebar
│   │   ├── agent-card.tsx      ← Summary card for each agent
│   │   ├── overview-panel.tsx  ← Main dashboard overview
│   │   ├── agent-detail-view.tsx ← Full detail view for one agent
│   │   ├── charts.tsx          ← All chart components (Recharts)
│   │   └── pdf-export-button.tsx ← PDF download button
│   └── landing/
│       └── idea-form.tsx       ← Startup idea input form
│
├── lib/                        ← CORE LOGIC & UTILITIES
│   ├── agents/                 ← AI Agent System
│   │   ├── config.ts           ← Agent configurations & prompts
│   │   ├── base-agent.ts       ← Function that runs any agent
│   │   └── orchestrator.ts     ← Coordinates all agents
│   ├── db/                     ← Database
│   │   ├── mongodb.ts          ← MongoDB connection
│   │   └── models/
│   │       ├── project.ts      ← Project schema
│   │       └── user.ts         ← User schema
│   ├── pdf/
│   │   └── report-template.tsx ← PDF report layout
│   ├── store/
│   │   └── project-store.ts    ← Zustand state management
│   ├── types/
│   │   └── index.ts            ← ALL TypeScript type definitions
│   ├── mock-data.ts            ← Sample data for development
│   ├── auth.ts                 ← NextAuth configuration
│   └── utils.ts                ← Utility functions (cn, etc.)
│
├── .env.example                ← Environment variable template
├── package.json                ← Dependencies & scripts
└── TEAM_GUIDE.md               ← This file!
```

---

## 👥 Team Division

### Team Member A: Frontend Lead
**Focus:** Everything the user SEES and INTERACTS with.

| File/Folder | What to do |
|---|---|
| `app/page.tsx` | Landing page design, animations, responsiveness |
| `app/dashboard/page.tsx` | Dashboard page layout and routing |
| `app/dashboard/layout.tsx` | Sidebar + content area structure |
| `components/landing/*` | Hero section, idea form styling |
| `components/dashboard/*` | All dashboard components |
| `components/ui/*` | Custom UI components (progress-ring, etc.) |
| `app/globals.css` | Design system, colors, custom styles |
| `lib/store/project-store.ts` | Frontend state management |

**Key TODOs:**
- [ ] Add loading skeletons while agents run
- [ ] Add micro-animations with Framer Motion
- [ ] Make dashboard fully responsive (mobile sidebar → hamburger menu)
- [ ] Add a theme toggle (light/dark mode switch)
- [ ] Add toast notifications for success/error states
- [ ] Improve chart tooltips and interactivity
- [ ] Add a project history page (list of past projects)

**Tips:**
- Use `npm run dev` to see changes live
- The "Load demo data" button lets you work on the dashboard without the backend
- All styling uses Tailwind CSS — see [tailwindcss.com/docs](https://tailwindcss.com/docs)
- shadcn/ui components are in `components/ui/` — see [ui.shadcn.com](https://ui.shadcn.com)
- To add a new shadcn component: `npx shadcn@latest add [component-name]`

---

### Team Member B: AI/Agent Lead
**Focus:** The AI agents — what they do, how they think, what they output.

| File/Folder | What to do |
|---|---|
| `lib/agents/config.ts` | Agent system prompts and model assignments |
| `lib/agents/base-agent.ts` | Core agent execution logic |
| `lib/agents/orchestrator.ts` | Multi-agent coordination |
| `lib/types/index.ts` | Agent-related type definitions |
| `lib/mock-data.ts` | Realistic sample outputs for testing |

**Key TODOs:**
- [ ] Refine system prompts for better, more structured output
- [ ] Add few-shot examples to prompts (show the AI what good output looks like)
- [ ] Add a "Tools" system — allow agents to search the web, access APIs
- [ ] Implement retry logic with exponential backoff for failed agents
- [ ] Add context summarization (use orchestrator model to summarize previous outputs)
- [ ] Add agent-specific Zod schemas (different validation per agent)
- [ ] Experiment with different Gemini models for quality vs speed
- [ ] Add streaming support (stream partial output as agent generates)

**Tips:**
- Test agents in isolation first: call `runAgent()` directly from a test script
- System prompts are the #1 lever for output quality — iterate on them!
- The `metadata` field in agent output is great for key metrics the dashboard displays
- Check Google AI Studio for prompt testing: [aistudio.google.com](https://aistudio.google.com)

---

### Team Member C: Backend Lead
**Focus:** Database, authentication, APIs, PDF generation, deployment.

| File/Folder | What to do |
|---|---|
| `lib/db/mongodb.ts` | MongoDB connection management |
| `lib/db/models/*` | Database schemas (Project, User) |
| `lib/auth.ts` | Authentication configuration |
| `app/api/orchestrate/route.ts` | Orchestration API endpoint |
| `app/api/projects/route.ts` | Projects CRUD API |
| `app/api/report/route.ts` | PDF generation API |
| `app/api/auth/*/route.ts` | Auth API routes |
| `lib/pdf/report-template.tsx` | PDF report layout |
| `.env.example` | Environment variables |

**Key TODOs:**
- [ ] Set up MongoDB Atlas cluster and get connection string
- [ ] Implement proper password hashing (bcrypt) in auth
- [ ] Add input validation and sanitization to all API routes
- [ ] Implement the PDF report generation (uncomment code in report route)
- [ ] Add API rate limiting to prevent abuse
- [ ] Add proper error handling and logging
- [ ] Set up Vercel deployment with environment variables
- [ ] Add CORS configuration if needed
- [ ] Add a health check endpoint (`/api/health`)
- [ ] Implement project deletion endpoint

**Tips:**
- MongoDB Atlas free tier: [cloud.mongodb.com](https://cloud.mongodb.com)
- Test API routes with VS Code REST Client or Postman
- Vercel deployment: push to Git and connect repo at [vercel.com](https://vercel.com)
- For PDF debugging, render to a file locally first

---

## 🛠 Tech Stack Cheat Sheet

| Technology | What it is | Documentation |
|---|---|---|
| **Next.js 16** | React framework (pages, routing, API) | [nextjs.org/docs](https://nextjs.org/docs) |
| **TypeScript** | JavaScript with type safety | [typescriptlang.org](https://www.typescriptlang.org/docs/) |
| **Tailwind CSS v4** | Utility-first CSS framework | [tailwindcss.com](https://tailwindcss.com/docs) |
| **shadcn/ui** | Copy-paste UI components | [ui.shadcn.com](https://ui.shadcn.com) |
| **Vercel AI SDK** | AI integration library | [sdk.vercel.ai](https://sdk.vercel.ai/docs) |
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

### "API key not working"
Make sure your Google API key is in `.env.local` as `GOOGLE_GENERATIVE_AI_API_KEY`.

### Dashboard is empty
Click "Load demo data" on the landing page to populate with sample data.

### Tailwind classes not working
Make sure the file is inside the `app/` or `components/` directory.
