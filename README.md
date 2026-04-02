# ShinonLLM

Release: **0.2.3** (Package `0.2.3`)

## Elevator Pitch

ShinonLLM is a runtime-first local LLM system.
The core rule is simple: **the runtime thinks, the LLM formulates text.**

This repository presents a controlled architecture where scoring, memory policy, and write decisions are deterministic runtime responsibilities, not prompt improvisation.

## Why This Project Exists

Most chat systems drift when context grows:
- memory becomes noisy chat history
- model decisions become hard to audit
- behavior is difficult to reproduce

ShinonLLM addresses this with a strict runtime layer that gates context, validates flow, and keeps a deterministic verification path.

## Product Direction

ShinonLLM targets a local-first assistant runtime with:
- deterministic orchestration
- explicit memory lifecycle
- controlled inference routing
- evidence-backed verification gates

The project is positioned as a runtime platform, not a prompt collection.

## What Makes It Different

1. Runtime-owned decisions  
Policy, scoring, memory writes, and gates are owned by code, not by the model.

2. Determinism as a release condition  
Contract, replay, and baseline checks are part of the release handshake.

3. Frontend as delivery surface  
UI delivers interaction. It does not own decision logic.

4. Consolidated documentation model  
One maintained current-state handshake plus canonical docs.

## High-Level System View

Flow ownership:
- `backend` -> request entry and validation
- `orchestrator` -> contract-first runtime flow
- `inference` -> routing with evaluator evidence
- `memory` -> session handling and decay
- `tests/gates` -> determinism and baseline checks

![Runtime Overview](./docs/assets/runtime-overview.svg)

## Current State (0.2.3)

- Runtime entry and validation are active.
- Contract-first orchestration is active.
- Inference routing includes mandatory offline evaluator evidence on live path.
- Session memory path with decay exists.
- Consolidation cleanup completed (legacy split reports removed).

Current verified handshake:
- [docs/HANDSHAKE_CURRENT_STATE.md](./docs/HANDSHAKE_CURRENT_STATE.md)

## Verification Baseline

Mandatory local checks:

```powershell
npm install
npm --prefix frontend install
npm run test:determinism
npm run verify:backend
npm --prefix frontend run build
```

Optional local run:

```powershell
npm run start:local
```

Stop local run:

```powershell
npm run stop:local
```

## Repository Map

- `backend/` - runtime entry, HTTP routes, validation
- `orchestrator/` - runtime contracts and turn orchestration
- `inference/` - adapter and routing layer for model execution
- `memory/` - session/long-term memory primitives
- `telemetry/` - event and replay support
- `frontend/` - user-facing delivery interface
- `tests/` - unit, integration, e2e, and gate checks
- `docs/` - canonical project documentation

## Roadmap Snapshot

Near-term priorities are tracked in:
- [docs/TODO.md](./docs/TODO.md)

Current focus:
- self-contained gate scripts
- memory policy alignment in one canonical place
- stronger local artifact cleanup automation
- CI-visible verification confidence

## Documentation Model

Documentation was hardened and consolidated.
Use these canonical documents:

- [docs/HANDSHAKE_CURRENT_STATE.md](./docs/HANDSHAKE_CURRENT_STATE.md)
- [docs/DETERMINISTISCHES_LLM_RUNTIME_KONZEPT.md](./docs/DETERMINISTISCHES_LLM_RUNTIME_KONZEPT.md)
- [docs/TODO.md](./docs/TODO.md)
- [docs/releases/VERSIONING.md](./docs/releases/VERSIONING.md)
- [docs/releases/RELEASE_PROCESS.md](./docs/releases/RELEASE_PROCESS.md)
- [CHANGELOG.md](./CHANGELOG.md)

Full docs index:
- [docs/README.md](./docs/README.md)

## Contributing and Release

- Contribution rules: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Security policy: [SECURITY.md](./SECURITY.md)
- Release process: [docs/releases/RELEASE_PROCESS.md](./docs/releases/RELEASE_PROCESS.md)
- Versioning: [docs/releases/VERSIONING.md](./docs/releases/VERSIONING.md)

## Source of Truth Notice

`README.md` is a presentation and orientation layer.
It is explicitly **not** the source of truth.

Authoritative references:
- [LLM_ENTRY.md](./LLM_ENTRY.md)
- [docs/LLM_ENTRY_CONFORMITY.md](./docs/LLM_ENTRY_CONFORMITY.md)
- [docs/HANDSHAKE_CURRENT_STATE.md](./docs/HANDSHAKE_CURRENT_STATE.md)
