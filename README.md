# AI-Powered Job Application Assistant

Production-ready starter system for a safe-mode AI job application assistant.

## Architecture

- `frontend/`: Flutter app for web/mobile dashboard
- `backend/`: Node.js + Express API + MongoDB integration
- `ai-engine/`: FastAPI service for resume parsing, matching, and content generation
- `automation/`: Playwright assistive autofill scripts only
- `database/`: sample seed data

## Core Safety Rules

- Assistive mode only
- No CAPTCHA bypass
- No authentication bypass
- No auto-submit
- All Playwright flows stop before final submission

## Features

- Resume PDF upload metadata endpoint
- Resume normalization into structured JSON
- Job fetching and filtering
- AI job matching with weighted scoring
- Tailored cover letters, resume summaries, and HR answers
- Autofill JSON generation for job forms
- Safe Playwright form-filling helper
- Dashboard for recommended, saved, and applied jobs
- ATS score and resume improvement suggestions
- Job tracking statuses

## Project Structure

```text
.
├── frontend/
├── backend/
├── ai-engine/
├── automation/
└── database/
```

## Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 2. AI Engine

```bash
cd ai-engine
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8001
```

### 3. Flutter Frontend

```bash
cd frontend
flutter pub get
flutter run -d chrome
```

### 4. Automation

```bash
cd automation
npm install
cp .env.example .env
npm run autofill
```

## Environment

Backend:

- `PORT`
- `MONGODB_URI`
- `AI_ENGINE_URL`
- `CLIENT_URL`

AI engine:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`

Automation:

- `TARGET_FORM_URL`

## API Overview

### Backend

- `GET /api/health`
- `POST /api/resumes/parse`
- `GET /api/jobs/recommendations`
- `POST /api/content/generate`
- `POST /api/applications/autofill`
- `GET /api/dashboard`

### AI Engine

- `GET /health`
- `POST /parse-resume`
- `POST /match-jobs`
- `POST /generate-content`
- `POST /ats-score`

## Testing

```bash
cd backend
npm test
```

## Sample Data

Seed files live in `database/seed/`.

## Notes

- MongoDB is required for persistent storage.
- Resume PDF parsing is implemented as safe text extraction plus heuristics; production OCR/enrichment can be added later.
- OpenAI-backed generation gracefully falls back to deterministic templates when no API key is configured.
# AI-Job-Assistant
