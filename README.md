# AI Exp - Developer Assistant

AI Exp is an AI-powered developer assistant application that helps developers debug issues efficiently and get quick, actionable answers to their technical questions.

## Project Overview

**Purpose:** Build an intelligent debugging assistant that provides concise, precise solutions to developer queries with follow-up questions for deeper exploration.

**Target Users:** Software developers (junior to senior) seeking quick debugging help and technical guidance.

---

## Tech Stack

### Frontend
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4 + Shadcn UI
- **Authentication:** Better Auth (React client)
- **Animation:** Motion, Tw Animate CSS
- **Particles:** TS Particles

### Backend
- **Runtime:** Node.js + Express
- **Authentication:** Better Auth
- **Database:** PostgreSQL (Neon DB / Local)
- **ORM:** Prisma
- **AI:** Google Gemini 2.5 Flash Lite
- **Web Search:** Tavily API (prepared for future use)

---

## Features

### 1. User Authentication
- Email/password login
- Social login (GitHub, Google)
- Session management via Better Auth
- Protected routes with JWT cookies

### 2. AI-Powered Query Response
- Streamed responses from Gemini API
- Real-time text streaming with chunked delivery
- Follow-up questions auto-generated
- Markdown support for code snippets

### 3. Conversation History
- Every query stored in PostgreSQL via Prisma
- Response storage linked to chats
- Conversation history per user

### 4. UI/UX
- Sparkle particle background effect
- Responsive design (mobile to desktop)
- Sticky footer with query display
- Press 'i' to open query input
- Dark theme optimized

---

## Project Structure

```
aiexp/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # UI components (AiExp, QueryInput, etc.)
│   │   ├── lib/          # Auth client, utilities
│   │   ├── App.tsx       # Main application component
│   │   └── index.css     # Tailwind + Shadcn styles
│   ├── package.json
│   └── vite.config.ts
│
├── backend/               # Express API server
│   ├── src/
│   │   ├── index.ts      # Main server + endpoints
│   │   ├── auth.ts       # Better Auth configuration
│   │   ├── middleware.ts # Auth middleware
│   │   ├── prompts.ts    # AI system prompts
│   │   ├── db.ts         # Database connection
│   │   └── utils.ts
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/sign-in` | Sign in with email/password |
| POST | `/api/auth/sign-up` | Register new user |
| POST | `/api/auth/sign-out` | Sign out |
| GET | `/api/auth/get-session` | Get current session |

### Conversation
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/conversation` | Send query, get streaming response |
| POST | `/conversations-followup` | Follow-up question handling |

### Utilities
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/stream-test` | Stream testing endpoint |

---

## Database Schema

### User
- id, name, email, emailVerified, image, createdAt, updatedAt

### Chats
- id, query, response, userId, createdAt

### Response
- id, response, chatId, userId, createdAt

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Google Gemini API key
- GitHub & Google OAuth credentials (optional)

### Environment Variables

**Backend (.env):**
```env
PORT=3000
DATABASE_URL=postgres://...
GEMINI_API_KEY=your_gemini_key
BETTER_AUTH_SECRET=your_secret
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_ORIGIN=http://localhost:5173
```

**Frontend (.env):**
```env
VITE_BACKEND_URL=http://localhost:3000
VITE_FRONTEND_URL=http://localhost:5173
```

### Installation

```bash
# Clone and navigate to project
cd aiexp

# Setup backend
cd backend
npm install
npx prisma generate
npm run dev

# Setup frontend (new terminal)
cd frontend
npm install
npm run dev
```

---

## AI Response Format

The AI follows a strict output format:

```
ANSWER_TEXT_HERE
|||END_ANSWER|||
{"followUps": ["question1", "question2", "question3"]}
```

**Constraints:**
- Answer: 60-100 words max
- Follow-ups: Exactly 3 concise questions
- No markdown in response (frontend handles rendering)

---

## Key Design Decisions

1. **Short Responses:** Developer answers should be brief and actionable (60-100 words max)

2. **Follow-up Questions:** AI generates 3 relevant follow-ups to help developers explore deeper

3. **Streaming:** Real-time streaming for better UX (chunked delivery with 30ms delay)

4. **Sticky Footer:** Query remains visible at bottom, fixed position for easy reference

5. **Press 'i' Shortcut:** Keyboard shortcut to open query input from anywhere

---

## Future Enhancements

- [ ] Web search integration (Tavily API)
- [ ] Conversation history page
- [ ] Code syntax highlighting
- [ ] Markdown rendering with react-markdown
- [ ] Follow-up conversation threading

---

## License

MIT