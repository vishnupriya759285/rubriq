# Rubriq

Rubriq is a teacher-controlled assessment workspace for structured rubrics, handwritten work, careful review, released feedback, and concept-level insight.

## Run locally

1. Copy `.env.example` to `.env` and set `DATABASE_URL`, `SESSION_SECRET`, and `OPENAI_API_KEY`.
2. Run `npm install` in `web/`, then `npm run db:generate` and `npm run db:migrate`.
3. Run `npm run dev` from the repository root.

The review interface works without an AI key. Live document grading needs `OPENAI_API_KEY`; credentials never reach the browser.

## Deploy with Dokploy

Create a Docker Compose application from this repository, add the variables from `.env.example` plus `POSTGRES_PASSWORD`, and attach a temporary domain to the `web` service on port 3000. Keep the PostgreSQL volume persistent and configure scheduled backups before storing real student work.

## Security model

Every production API request must be resolved to a server-side session and filtered by teacher or student ownership. Student results are visible only after an explicit teacher release. The starter API routes include validation and database contracts; session middleware and object storage credentials are configured per deployment.
