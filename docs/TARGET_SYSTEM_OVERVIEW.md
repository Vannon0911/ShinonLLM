# Target System Overview

Stand: 2026-04-02
Release-Basis: 0.2.1a (Package `0.2.1-a`)

## Kernfakt

Das Zielsystem ist ein Runtime-first Lokalstack fuer Chat/QA mit klarer Trennung:
- Runtime entscheidet
- Memory liefert Kontext nach Regeln
- LLM formuliert Text

## Systembild (MVP)

1. API Edge
- `backend/src/httpServer.ts`
- `backend/src/routes/chat.ts`

2. Orchestration
- `orchestrator/src/pipeline/orchestrateTurn.ts`
- `orchestrator/src/contracts/*`

3. Inference
- `inference/src/router/backendRouter.ts`
- Adapter fuer `llama.cpp` und `ollama`

4. Memory
- Retrieval: `memory/src/retrieval/*`
- Session-Store: `memory/src/session/sessionMemory.ts`
- Persistenzvertrag: `memory/src/session/sessionPersistence.ts`

5. Quality
- `tests/gates/*`
- `tests/unit/*`
- `tests/integration/*`

## MVP-Leitregeln

1. Kein Live-Default in Inference.
2. Kein Write-Pfad ohne expliziten Contract.
3. Fail-closed bei Contract- und Schema-Verletzungen.
4. Deterministische Gate-Pfade als harte Freigabegrenze.

## Scope-Hinweis

Die vollstaendige Core/Session/Archive-Policy-Engine ist als naechste Ausbaustufe geplant, aber nicht Teil des 0.2.1a MVP-Scope.
