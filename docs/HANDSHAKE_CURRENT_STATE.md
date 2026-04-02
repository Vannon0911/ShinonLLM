# HANDSHAKE CURRENT STATE

Date: 2026-04-03
Release baseline: 0.2.3a

## One-line truth

The runtime thinks, the LLM formulates text. Wir bauen eine **Real Persona**, keinen Chat-Wrapper.

## Current architecture state

- Runtime entry and request validation are active in `backend`.
- Contract-first orchestration is active in `orchestrator`.
- Inference routing is active in `inference` with mandatory offline evaluator evidence and a newly added retry mechanism.
- Session memory handling and decay path exist in `memory`.
- SQLite session memory migration path is active via `PRAGMA user_version` (v0 -> v1).
- Determinism and baseline gates exist in `tests/gates`.
- **Live Inference** successfully tested via llama.cpp (Qwen 0.5B local) for DE, EN, JP, and stress conditions.

## Determinism and verification policy

Mandatory checks:

1. `npm run test:determinism`
2. `npm run verify:backend`
3. `npm --prefix frontend run build`

Fail-closed principle:

- If contract, replay, or baseline checks fail, release handshake is blocked.

## Latest verification run

Executed on 2026-04-03:

- `npm run test:determinism` -> PASS
- `npm run verify:backend` -> PASS
- `npm run test:e2e` -> PASS
- Manual Live Stresstest -> PASS (Runtime stables, Context Bleed identified at LLM level)

## Scope boundaries: Pattern Analytics vs. Data Hoarding

- **MVP Phase:** Local-first, persistent session runtime optimized for 0.5B-7B models.
- **Product Phase:** Real Persona behavior through Pattern Analytics scoring (Impact & Frequency), explicitly NOT raw vector-db chat hoarding.
- Frontend is a delivery surface, not the runtime decision source.
- Model role remains constrained to text generation and style rendering.

## Open risks

- **Frontend Memory Binding:** The `page.tsx` does not currently pass `sessionId` and `conversationId` into `ChatShell`. This leaves the entire Session Memory system inactive in the default UI flow. Will be addressed in the next release.
- **Model Context Bleed:** The llama.cpp KV-cache bleeds previous replies when the model is forcefully fed nonsense, since it's lacking explicit cache isolation between REST calls.

## Next checkpoint

After fixing the Frontend Memory Binding, bump to the next minor release and focus on Pattern tracking.
