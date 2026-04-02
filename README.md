# ShinonLLM

ShinonLLM is a runtime-first companion stack for local and hybrid LLM workflows.

Core principle: **The runtime thinks, the LLM formulates text.**

## Product Vision

ShinonLLM is built as a deterministic runtime product, not a prompt playground.
The runtime owns state, memory policy, scoring, and context boundaries.
The model is intentionally scoped to language output, tone adaptation, and response formatting.

## Why This Exists

Typical companion stacks blur responsibility: the model decides too much, memory drifts, and behavior becomes hard to verify.
ShinonLLM enforces strict runtime ownership so decisions are testable, replayable, and operationally controllable.

## Unique Selling Points

- Runtime-first control plane with explicit contracts and fail-closed behavior.
- Determinism gates and replay checks for reproducible outputs.
- Contract-scoped memory writes instead of free-form model mutation.
- Local-first architecture with adapter-ready inference integration.
- Clear separation between orchestration logic and text generation logic.

## Runtime Model (Visual)

![ShinonLLM runtime overview](./docs/assets/runtime-overview.svg)

## ShinonLLM vs Typical Companion Stacks

| Area | ShinonLLM | Typical Companion Stack |
|---|---|---|
| Decision authority | Runtime contracts and gates | Model heuristics |
| Memory writes | Contract-gated, fail-closed | Often implicit and permissive |
| Reproducibility | Replay and gate checks | Best-effort, hard to prove |
| Context assembly | Runtime curated package | Prompt growth and drift |
| Product operations | Explicit release and gate process | Ad hoc scripts and manual checks |

## Clear Objectives

1. Ship a runtime that is explainable under load, not only in demos.
2. Keep model behavior bounded by deterministic runtime contracts.
3. Make releases audit-ready through CI gates and changelog discipline.

## Quickstart

Prerequisites: Node.js LTS.

```powershell
npm install
cd frontend; npm install; cd ..
npm run verify:backend
cd frontend; npm run build; cd ..
```

## Documentation Map

- Product framing: [docs/PRODUCT_POSITIONING.md](./docs/PRODUCT_POSITIONING.md)
- Docs index: [docs/README.md](./docs/README.md)
- Runtime concept: [docs/DETERMINISTISCHES_LLM_RUNTIME_KONZEPT.md](./docs/DETERMINISTISCHES_LLM_RUNTIME_KONZEPT.md)
- Target overview: [docs/TARGET_SYSTEM_OVERVIEW.md](./docs/TARGET_SYSTEM_OVERVIEW.md)
- Versioning policy: [docs/releases/VERSIONING.md](./docs/releases/VERSIONING.md)
- Release process: [docs/releases/RELEASE_PROCESS.md](./docs/releases/RELEASE_PROCESS.md)
- Changelog: [CHANGELOG.md](./CHANGELOG.md)

## Source of Truth

`README.md` is not Source of Truth.

Authoritative references:
- [LLM_ENTRY.md](./LLM_ENTRY.md)
- [docs/LLM_ENTRY_CONFORMITY.md](./docs/LLM_ENTRY_CONFORMITY.md)
- [docs/DETERMINISTISCHES_LLM_RUNTIME_KONZEPT.md](./docs/DETERMINISTISCHES_LLM_RUNTIME_KONZEPT.md)
