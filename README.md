# 🧠 InvestorIQ — AI Investment Intelligence Platform

> Research any company using autonomous AI analysts. Get institutional-grade investment recommendations in seconds.

**InvestorIQ** is a production-grade AI investment research platform that uses a **multi-agent architecture** to analyze companies from every angle — fundamentals, financials, news, sentiment, and risk — then delivers a final investment recommendation with a confidence score.

---

## ✨ Features

### 🤖 Multi-Agent AI System
- **6 Specialized AI Agents** working in a sequential pipeline
- **Company Research Agent** — Business model, leadership, competitive moat
- **Financial Analyst Agent** — Revenue, profitability, valuation metrics (real data from Yahoo Finance)
- **News Intelligence Agent** — Latest news, acquisitions, regulatory events
- **Market Sentiment Agent** — Social media, Reddit, Twitter, analyst consensus
- **Risk Assessment Agent** — Financial, market, industry, regulatory risks
- **Investment Committee Agent** — Final INVEST / HOLD / PASS recommendation

### 📊 Investment Analysis
- **Investment Scorecard** — 5-dimension radar chart + bar charts
- **SWOT Analysis** — Auto-generated strengths, weaknesses, opportunities, threats
- **Bull vs Bear Debate** — AI-generated arguments for both sides
- **Risk Matrix** — 4-category risk breakdown with severity bars
- **Confidence Score** — Quantified conviction level

### 🎯 Platform Features
- **Company Comparison** — Head-to-head analysis with winner declaration
- **Watchlist** — Save and track companies
- **Research History** — All past research reports stored locally
- **Real-Time Progress** — Perplexity-style live workflow visualization

### 🎨 Premium UI/UX
- **Dark Mode** — Bloomberg Terminal-inspired design
- **Glassmorphism** — Premium glass card components
- **Smooth Animations** — Framer Motion throughout
- **Responsive** — Works on all screen sizes

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 15)                  │
│  Landing Page │ Dashboard │ Compare │ Watchlist │ History │
└──────────────────────┬───────────────────────────────────┘
                       │ SSE Stream
┌──────────────────────┴───────────────────────────────────┐
│                  API LAYER (Route Handlers)                │
│    /api/research │ /api/compare │ /api/watchlist │ ...    │
└──────────────────────┬───────────────────────────────────┘
                       │
┌──────────────────────┴───────────────────────────────────┐
│              LANGGRAPH MULTI-AGENT PIPELINE                │
│                                                           │
│  START → Company Research → Financial Analyst → News      │
│       → Sentiment → Risk Assessment → Investment          │
│         Committee → RECOMMENDATION → END                  │
└──────────────────────┬───────────────────────────────────┘
                       │
┌──────────────────────┴───────────────────────────────────┐
│                    DATA SOURCES                           │
│  Yahoo Finance │ Gemini AI │ Local DB (JSON files)       │
└──────────────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS v4, Custom CSS |
| UI Components | Shadcn-style, Radix UI Primitives |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| AI/ML | LangGraph.js, LangChain.js |
| LLM | Google Gemini 2.0 Flash (free tier) |
| Financial Data | Yahoo Finance (yahoo-finance2) |
| Storage | JSON file-based (development) |
| Deployment | Vercel |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Google Gemini API key ([Get one free](https://aistudio.google.com/))

### Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd investoriq

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local and add your GOOGLE_API_KEY

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_API_KEY` | ✅ Yes | Google Gemini API key from [AI Studio](https://aistudio.google.com/) |
| `ALPHA_VANTAGE_KEY` | ❌ No | Alpha Vantage API key for enhanced financial data |
| `FINNHUB_KEY` | ❌ No | Finnhub API key for company news |
| `NEWS_API_KEY` | ❌ No | News API key for headlines |
| `TAVILY_API_KEY` | ❌ No | Tavily API key for web search |

> **Note:** The app works fully with just the `GOOGLE_API_KEY`. Other keys provide enhanced data but are not required.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Design system
│   ├── dashboard/
│   │   ├── page.tsx                # Main dashboard + research
│   │   ├── layout.tsx              # Dashboard shell
│   │   ├── history/page.tsx        # Research history
│   │   ├── watchlist/page.tsx      # Watchlist management
│   │   ├── compare/page.tsx        # Company comparison
│   │   └── settings/page.tsx       # Settings
│   └── api/
│       ├── research/route.ts       # SSE research pipeline
│       ├── history/route.ts        # History CRUD
│       └── watchlist/route.ts      # Watchlist CRUD
├── components/
│   ├── dashboard/                  # Dashboard-specific components
│   │   ├── sidebar.tsx
│   │   ├── research-progress.tsx
│   │   ├── recommendation-badge.tsx
│   │   ├── score-card.tsx
│   │   ├── swot-analysis.tsx
│   │   ├── debate-view.tsx
│   │   └── risk-matrix.tsx
│   └── shared/                     # Reusable components
│       ├── animated-background.tsx
│       ├── glass-card.tsx
│       ├── score-gauge.tsx
│       └── loading-skeleton.tsx
├── lib/
│   ├── agents/                     # LangGraph multi-agent system
│   │   ├── graph.ts                # Pipeline orchestration
│   │   ├── state.ts                # Shared state schema
│   │   ├── company-research.ts     # Agent 1
│   │   ├── financial-analyst.ts    # Agent 2
│   │   ├── news-intelligence.ts    # Agent 3
│   │   ├── market-sentiment.ts     # Agent 4
│   │   ├── risk-assessment.ts      # Agent 5
│   │   └── investment-committee.ts # Agent 6
│   ├── data/
│   │   └── yahoo-finance.ts        # Yahoo Finance wrapper
│   ├── db/
│   │   └── index.ts                # JSON file storage
│   ├── types.ts                    # TypeScript types
│   └── utils.ts                    # Utilities
├── hooks/
│   ├── use-research.ts             # SSE streaming hook
│   └── use-watchlist.ts            # Watchlist hook
└── config/
    └── constants.ts                # Prompts & constants
```

---

## 🤖 Agent Workflow

```
┌─────────────────┐
│  User Input      │  "Analyze Tesla"
└────────┬────────┘
         │
┌────────▼────────┐
│ Company Research │  Business model, products, competitive moat
│     Agent        │  → Uses Gemini AI
└────────┬────────┘
         │
┌────────▼────────┐
│ Financial Analyst│  P/E, EPS, revenue growth, debt analysis
│     Agent        │  → Yahoo Finance + Gemini AI
└────────┬────────┘
         │
┌────────▼────────┐
│ News Intelligence│  Recent news, acquisitions, lawsuits
│     Agent        │  → Gemini AI knowledge
└────────┬────────┘
         │
┌────────▼────────┐
│ Market Sentiment │  Reddit, Twitter, analyst consensus
│     Agent        │  → Gemini AI analysis
└────────┬────────┘
         │
┌────────▼────────┐
│ Risk Assessment  │  Financial, market, industry, regulatory risk
│     Agent        │  → All prior data + Gemini AI
└────────┬────────┘
         │
┌────────▼────────┐
│   Investment     │  INVEST / HOLD / PASS
│   Committee      │  Confidence score, SWOT, Bull/Bear debate
└────────┬────────┘
         │
┌────────▼────────┐
│  Final Report    │  Stored in local database
└─────────────────┘
```

---

## 🚀 Deployment (Vercel)

1. Push code to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Add `GOOGLE_API_KEY` to Vercel Environment Variables
4. Deploy

The `vercel.json` is pre-configured with a 120-second function timeout for the research pipeline.

---

## ⚖️ Tradeoffs

| Decision | Tradeoff |
|----------|----------|
| Gemini Flash over GPT-4 | Free tier, faster, but slightly less capable for complex reasoning |
| JSON file storage over PostgreSQL | Zero-config setup, but not suitable for multi-user production |
| Yahoo Finance (unofficial) | Free, but may break; no SLA |
| Sequential agent pipeline | Simpler to debug, but slower than parallel execution |
| Client-side PDF | Simpler, but less polished than server-side rendering |

---

## 🔮 Future Improvements

- [ ] PostgreSQL database for multi-user support
- [ ] Real-time stock price WebSocket integration
- [ ] Parallel agent execution for faster research
- [ ] Historical price charts with TradingView widget
- [ ] User authentication with NextAuth.js
- [ ] PDF report export
- [ ] Email alerts for watchlist price changes
- [ ] Additional data sources (Polygon, SEC filings)
- [ ] Backtesting against historical recommendations

---

## 📄 License

MIT

---

Built with ❤️ using Next.js, LangGraph, and Google Gemini AI
