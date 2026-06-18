# FinAdvisor - AI Financial Advisor Chatbot

An intelligent financial advisor chatbot built with React + TypeScript, powered by AI. Covers personal finance, investments, tax planning, and more — with deep expertise in both **Indian** and **US** financial systems.

**Live Demo:** [ai-fin-advisor.netlify.app](https://ai-fin-advisor.netlify.app)

## Features

- **AI-Powered Chat** — Real-time streaming responses with SSE
- **15 Knowledge Engines** — Financial Planning, Investments, Tax, Retirement, Insurance, Estate Planning, Debt Management, Behavioral Finance, Regulations, Economics, Advisory Skills, FinTech, Accounting & Corporate Finance, Books & Resources, and General
- **Smart Category Detection** — Auto-detects the financial topic from user queries
- **Voice Input** — Speech-to-text using Web Speech API (Chrome, Edge, Safari)
- **Follow-up Suggestions** — AI generates 3 contextual follow-up questions after each response
- **Chat Management** — Create, search, delete, export/import chats (localStorage)
- **Dark/Light Theme** — Toggle between themes via Settings
- **Mobile Responsive** — Optimized for mobile with collapsible sidebar and dynamic viewport height
- **Markdown Rendering** — Rich responses with headers, tables, code blocks, and emojis

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite 8 |
| Styling | CSS Variables, Bootstrap 5 |
| AI API | FreeModel API (OpenAI-compatible) |
| Deployment | Netlify (Edge Functions for streaming proxy) |
| Markdown | react-markdown + remark-gfm |
| Icons | react-icons (Bootstrap Icons) |

## Project Structure

```
src/
├── components/
│   ├── ChatArea/          # Main chat UI, message bubbles, welcome screen
│   └── Sidebar/           # Navigation, categories, chat list
├── engines/               # 14 financial knowledge engines + index
│   ├── financial-planning.ts
│   ├── investment-management.ts
│   ├── tax-planning.ts
│   ├── retirement-planning.ts
│   ├── insurance-risk.ts
│   ├── estate-planning.ts
│   ├── debt-management.ts
│   ├── behavioral-finance.ts
│   ├── regulatory-compliance.ts
│   ├── economics-market.ts
│   ├── advisory-skills.ts
│   ├── fintech-tools.ts
│   ├── accounting-corporate.ts
│   ├── books-resources.ts
│   └── index.ts           # Engine registry & category detection
├── services/
│   └── ai-service.ts      # AI API integration, streaming, system prompt
├── hooks/
│   └── useChat.ts         # Chat state management hook
├── types/
│   └── index.ts           # TypeScript interfaces
├── App.tsx                # Root layout
└── speech.d.ts            # Web Speech API type declarations

netlify/
└── edge-functions/
    └── api-proxy.ts       # Streaming SSE proxy for production
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/rajeshkanna-s/financial-advisor.git
cd financial-advisor
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173`

### Build

```bash
npm run build
```

### Deploy

Deployed on Netlify with Edge Functions for streaming API proxy. Push to `main` triggers auto-deploy.

## Knowledge Coverage

| # | Domain | Key Topics |
|---|--------|-----------|
| 1 | Financial Planning | Budgeting, emergency fund, goal setting, time value of money |
| 2 | Investments | Stocks, mutual funds, SIPs, ETFs, crypto, derivatives, F&O |
| 3 | Retirement | 401k, IRA, PPF, NPS, EPF, FIRE movement |
| 4 | Tax Planning | Section 80C/80D, HRA, LTCG/STCG, US tax brackets, ITR filing |
| 5 | Insurance | Term, health, life, annuities, risk management |
| 6 | Estate Planning | Wills, trusts, succession, power of attorney |
| 7 | Debt Management | Credit scores (CIBIL/FICO), EMI, debt snowball/avalanche |
| 8 | Behavioral Finance | Cognitive biases, loss aversion, herd mentality |
| 9 | Regulations | SEBI, SEC, RBI, FINRA, AMFI compliance |
| 10 | Economics | GDP, inflation, monetary policy, forex, currency risk |
| 11 | Advisory Skills | Client communication, ethics, fiduciary duty |
| 12 | FinTech | Robo-advisors, UPI, digital banking, blockchain |
| 13 | Accounting & Corp Finance | Financial statements, ratios, DCF, WACC, corporate structures |
| 14 | Books & Resources | Recommended reading, certifications, learning paths |

## License

MIT

---

Built by [@rajeshkanna-s](https://github.com/rajeshkanna-s)
