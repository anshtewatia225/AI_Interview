# AI Mock Interviewer

A full-stack AI-powered mock interview app that asks you real technical questions, scores your answers, and gives you structured feedback — built with React, Node.js, and the Gemini API.

**Live demo:** _coming soon_

---

## Features

- **Role-based interviews** — Frontend, Backend, or Full Stack Developer
- **Topic focus** — narrow questions to a specific area (React Hooks, SQL, System Design, etc.)
- **Three difficulty levels** — Easy (fundamentals), Medium (applied), Hard (system design)
- **Streaming questions** — questions appear in real time as the AI generates them
- **Structured feedback** — every answer gets a score out of 10, what was good, what was missing, and a model answer
- **Session summary** — overall grade, strengths, areas to improve, and a hiring recommendation
- **Session history** — all past interviews saved to MongoDB and viewable with per-question breakdowns

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| AI | Google Gemini 2.5 Flash (`@google/genai`) |
| Database | MongoDB + Mongoose |
| Deployment | Vercel (client) + Railway (server + DB) |

---

## Project Structure

```
AI Interviewer/
├── client/               # React frontend (Vite)
│   └── src/
│       ├── api/          # Fetch helpers (streaming + JSON)
│       └── components/   # Setup, Interview, Feedback, Summary, History, Sidebar
└── server/               # Express backend
    └── src/
        ├── routes/       # /api/interview
        ├── controllers/  # Request handlers
        ├── services/     # Gemini API integration
        └── models/       # Mongoose Session schema
```

---

## Running Locally

**Prerequisites:** Node.js 18+, MongoDB running locally

### 1. Clone the repo

```bash
git clone https://github.com/your-username/ai-interviewer.git
cd ai-interviewer
```

### 2. Set up the server

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=mongodb://localhost:27017/ai-interviewer
PORT=3001
```

Get a free Gemini API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).

### 3. Set up the client

```bash
cd client
npm install
```

### 4. Run both servers

```bash
# Terminal 1 — backend (http://localhost:3001)
cd server && npm run dev

# Terminal 2 — frontend (http://localhost:5173)
cd client && npm run dev
```
---

## API Routes

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/interview/question` | Stream the next question (SSE) |
| `POST` | `/api/interview/answer` | Evaluate an answer, return structured JSON |
| `POST` | `/api/interview/finish` | Generate session summary + save to DB |
| `GET` | `/api/interview/sessions` | Fetch last 20 sessions |
