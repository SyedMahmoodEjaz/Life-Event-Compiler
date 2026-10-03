# 🧭 Life Event Compiler

**Turn a goal into a plan. Turn the plan into action.**

Life Event Compiler treats a complex life goal like a program that needs to be compiled. You describe a goal in plain language, and the app understands it, researches the real requirements, breaks it into dependent tasks, tracks your progress, and recompiles the plan when your situation changes.

The first fully built use case is **Study Abroad**: finding Master's programs worldwide, comparing your profile against them, and building an application workflow for each university.

---

## ✨ Features

**Goal to profile**
- Describe your goal in your own words (for example: *"I want a Master's in AI abroad in 2027, I'm from Pakistan, my budget is limited, and I haven't taken IELTS yet"*)
- The Goal Agent extracts a structured, editable student profile
- Progressive profiling: optional fields like CGPA can be added later

**Discover programs**
- Starter list of real programs across Europe, the UK and Canada
- **Find more (live web search):** searches the web for programs that fit your profile
- Programs are filtered by your destination ("Europe", "Canada", "Anywhere", and so on) and the list can be refreshed when you change your details
- Transparent match flags (🟢 appears aligned, 🟡 needs verification, 🔴 missing, ⚪ unknown). There is no fake "acceptance probability"
- Side-by-side comparison of selected programs (a comparison, not a ranking)

**One workspace per university**
- Each selected program gets its own workspace with its own plan, chat, notes and application status
- Workspaces share the student profile, so you never repeat yourself
- Application statuses: Researching, Shortlisted, Preparing, Ready to apply, Submitted, Waiting for decision, Accepted, Rejected, Withdrawn

**Live program research**
- One click researches the exact program: duration, language, academic and English requirements, documents, tuition, scholarships, deadline, start date, and the post-study pathway
- Application deadline and classes-begin date are always shown separately
- Every result lists the sources the search used
- Anything that cannot be found is shown as *"Not found on official pages"* instead of being guessed

**Dependency-aware workflow**
- 11 tasks with real dependencies (for example, you cannot submit until documents, letters and the English test result are done)
- Task states: Not started, In progress, Complete, Blocked, Waiting
- Plain-language explanations such as *"Blocked because: English test result not done yet"*
- A clear "What should I do next?" on every workspace

**Recompilation and What-If**
- Tell the app your English test moved to January: it shows which tasks are affected and waits for your confirmation before recompiling (v1 to v2, with a history log)
- What-If simulator: test scenarios (for example, "change my intake to September 2028") and see them next to your current plan, without changing it

**Context-aware chat**
- Each workspace has a chat that already knows your profile, the program, your task states and your notes
- Chat can search the web and shows its sources

**Dashboard and extras**
- Dashboard of all applications with readiness percentage, next step and status
- **IELTS Prep** page that links to [NOVEM](https://novem-mauve.vercel.app/), the IELTS preparation tool, optionally embedded in the app
- Animated startup sequence, moving network background, glass-style UI, dark futuristic theme

---

## 🤖 How it works

The app is organized as a pipeline of specialized roles:

| Stage | Role |
|---|---|
| Understand | **Goal Agent** extracts the profile from natural language |
| Research | **Research Agent** searches official sources for programs, requirements, deadlines, scholarships and immigration info |
| Match | **Matching logic** compares the profile with each program and explains why it appeared |
| Plan | **Planning logic** turns requirements into tasks with dependencies |
| Adapt | **Recompile and What-If** detect the impact of changes and show them before applying |

Dependencies are computed in the browser, so a task is blocked automatically whenever something it needs is not done.

---

## 🧱 Tech stack

- **Frontend:** a single HTML file with vanilla JavaScript and CSS (no build step)
- **Backend:** one serverless function (`api/chat.js`) that proxies AI requests so your key never reaches the browser
- **AI with web search:** Groq (`groq/compound`, or `openai/gpt-oss-120b` with browser search) or Anthropic Claude with web search
- **Hosting:** Vercel
- **Storage:** the browser's `localStorage` (no database)

---

## 📁 Project structure

```
.
├── api/
│   └── chat.js        # Serverless function: calls the AI provider
├── public/
│   └── index.html     # The whole frontend
├── .env.example       # Template for your keys
├── .gitignore
├── package.json
├── vercel.json        # Function timeout setting
└── README.md
```

---

## 🚀 Run it locally

**Requirements:** Node.js 20 or newer and an API key from [Groq](https://console.groq.com) or [Anthropic](https://console.anthropic.com).

1. Clone the repository
   ```bash
   git clone https://github.com/SyedMahmoodEjaz/Life-Event-Compiler.git
   cd Life-Event-Compiler
   ```
2. Create a `.env` file (copy `.env.example`) and add your key
   ```
   GROQ_API_KEY=gsk_your_key
   MODEL=groq/compound
   ```
3. Start the local Vercel dev server
   ```bash
   npx vercel dev
   ```
4. Open the address it prints (usually http://localhost:3000)

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | One of the two | Uses Groq if set |
| `ANTHROPIC_API_KEY` | One of the two | Used when no Groq key is set |
| `MODEL` | Optional | Search-capable model. Groq default: `groq/compound`. Anthropic default: `claude-sonnet-5-5` |
| `FAST_MODEL` | Optional | Groq model for non-search calls. Default: `llama-3.3-70b-versatile` |

If `groq/compound` is not available to your account, try `MODEL=openai/gpt-oss-120b`.

---

## ☁️ Deploy to Vercel

1. Push this repository to GitHub
2. On [vercel.com](https://vercel.com), choose **Add New → Project** and import the repository
3. Add your environment variables (`GROQ_API_KEY`, `MODEL`)
4. Press **Deploy**

Redeploy after changing any environment variable. If a deploy complains about the function duration, lower `maxDuration` in `vercel.json`.

> **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

## ⚠️ Important notes

- **Not professional advice.** The app can make mistakes. Web search improves accuracy, but always confirm deadlines, requirements, tuition and immigration rules on the linked official pages before you apply or make financial or visa decisions.
- The app never guarantees admission, scholarships or visa approval, and studying in a country does not automatically give a right to stay there.
- **Usage costs.** Every visitor to a deployed link uses your API key. Limit who you share it with, or add rate limiting.
- **Data is local.** Profiles and workspaces are saved in each visitor's own browser and are not synced across devices.
- The starter program list is a set of starting points, not a complete or ranked database.

---

## 🗺️ Roadmap

- Document upload and checking against requirements
- Dedicated scholarship tracker with deadlines connected to the workflow
- Natural-language search with filters (tuition, intake, language, post-study route)
- Deadline reminders and calendar view
- Accounts and cloud sync
- More goal types: starting a business, moving abroad, international jobs, certifications

---

## 🙌 Credits

Built as a hackathon project. IELTS preparation by [NOVEM](https://novem-mauve.vercel.app/).
