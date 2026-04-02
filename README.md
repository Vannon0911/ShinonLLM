# ShinonLLM Runtime

Deterministic local LLM runtime with strict validation gates, contract-first backend behavior, and a Next.js frontend shell.

## Project Structure

- `backend/` HTTP routes and runtime entry (`/health`, `/chat`)
- `frontend/` Next.js App Router UI
- `orchestrator/` prompt, guardrail, and routing pipeline
- `inference/` backend routing and adapter layer
- `memory/` retrieval and session memory logic
- `telemetry/` replay hash + event integrity
- `tests/` unit, integration, e2e, and gate checks
- `ops/` local stack scripts and gate automation

## Quick Start

Prerequisite: Node.js LTS (24+ recommended).

```powershell
# install root runtime tooling
npm install

# install frontend dependencies
cd frontend
npm install
cd ..
```

## Verification Workflow (Required)

Run backend validation first:

```powershell
npm run verify:backend
```

What this covers:
- contract gate checks
- deterministic replay gate checks
- backend unit tests
- backend integration tests

Then verify frontend build:

```powershell
cd frontend
npm run build
cd ..
```

## Local Runtime

```powershell
# terminal 1
cd backend
npm run start

# terminal 2
cd frontend
npm run dev
```

Backend defaults to `http://127.0.0.1:3001`; frontend runs on `http://localhost:3000` and proxies `/api/*`.

## LLM Entry Compliance

This repository uses a mandatory LLM entry contract at:

- [LLM_ENTRY.md](./LLM_ENTRY.md)
- [docs/LLM_ENTRY_CONFORMITY.md](./docs/LLM_ENTRY_CONFORMITY.md)

Changes that break contract ordering, deterministic guarantees, or verification gates are considered invalid.
