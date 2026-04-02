# ShinonLLM

**Vision:** The runtime thinks. The LLM formulates text.

Release: **0.2.3** (root/backend/frontend packages: `0.2.3`)

![ShinonLLM Runtime Overview](./docs/assets/runtime-overview.svg)

## What It Is

ShinonLLM is a runtime-first, local-first LLM system where **the runtime owns decisions** (contracts, routing, memory writes, scoring) and the **model is constrained to text formulation**.
The outcome is a system that behaves like a product runtime, not like an improvised prompt stack.

## Goals

- Deterministic behavior that can be verified (and blocked) by gates.
- Explicit memory lifecycle (typed entries, scoring, decay) instead of raw chat logs.
- Auditable change surfaces (contracts, replay, baseline integrity) that keep releases reproducible.

## Who It Is For

- Builders who want a local-first assistant runtime with predictable behavior.
- Teams who need contracts, replayability, and "release gates" instead of prompt folklore.
- Anyone who treats memory writes as a controlled interface, not as a vibe.

## Non-goals

- A "prompt collection" repo.
- An agent that can silently mutate state because the prompt felt like it.
- A hosted SaaS product (this repo is local-first by default).

## Unique Selling Points (USPs)

- **Runtime-owned decisions:** policy, scoring, memory writes, and gates are enforced in code (fail-closed), not in model prose.
- **Contract-first orchestration:** schema validation is part of the runtime pipeline, not an afterthought.
- **Determinism as a release condition:** replay/contract/baseline gates are treated as release handshakes, not optional tests.
- **Frontend as delivery surface:** UI delivers interaction; it does not own decision logic.

## ShinonLLM vs Typical Companion Stacks

| Dimension | ShinonLLM | Typical companion stacks |
|---|---|---|
| Who "decides" | Runtime code decides; model formats text | Model/prompt decides (often implicitly) |
| Memory | Typed, scored entries with explicit write-gates | Chat logs + ad-hoc summaries |
| Determinism | Replay/contract/baseline gates are first-class | Best-effort, hard to reproduce |
| Auditability | Contracts + verification artifacts | "Seems fine" until it drifts |
| Failure mode | Fail-closed on invalid writes / schema breaks | Silent drift, hidden state mutation |
| Product surface | Frontend is delivery only | UI + agent logic often mixed |
| Releases | SemVer + changelog + tag-driven GitHub releases | Ad-hoc versioning (or none) |

## How It Works (High Level)

Request path (synchronous, user-visible):

- `User -> frontend -> backend -> orchestrator -> inference -> backend -> frontend -> User`

State path (runtime-internal, controlled writes):

- `orchestrator/inference -> memory` for session updates and decay handling.

Quality path (verification, not in hot response path):

- `tests/gates` validate determinism and baseline integrity before releases.

## Current State (0.2.3)

- Runtime entry and validation are active.
- Contract-first orchestration is active.
- Inference routing includes mandatory offline evaluator evidence in the live path.
- Session memory path with decay exists.

Current verified handshake:

- [docs/HANDSHAKE_CURRENT_STATE.md](./docs/HANDSHAKE_CURRENT_STATE.md)

## Quickstart (Local Verification Baseline)

Mandatory local checks:

```powershell
npm ci
npm --prefix frontend ci
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

## Documentation

Start here:

- [docs/README.md](./docs/README.md)

Core documents:

- [docs/HANDSHAKE_CURRENT_STATE.md](./docs/HANDSHAKE_CURRENT_STATE.md)
- [docs/ARCHITECTURE_OVERVIEW.md](./docs/ARCHITECTURE_OVERVIEW.md)
- [docs/DETERMINISTISCHES_LLM_RUNTIME_KONZEPT.md](./docs/DETERMINISTISCHES_LLM_RUNTIME_KONZEPT.md)
- [docs/TODO.md](./docs/TODO.md)

Release governance:

- [docs/releases/VERSIONING.md](./docs/releases/VERSIONING.md)
- [docs/releases/RELEASE_PROCESS.md](./docs/releases/RELEASE_PROCESS.md)
- [CHANGELOG.md](./CHANGELOG.md)

## Contributing and Security

- Contribution rules: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Security policy: [SECURITY.md](./SECURITY.md)

## Source of Truth Notice

`README.md` is a presentation and orientation layer.
It is explicitly **not** the source of truth.

Authoritative references:

- [LLM_ENTRY.md](./LLM_ENTRY.md)
- [docs/LLM_ENTRY_CONFORMITY.md](./docs/LLM_ENTRY_CONFORMITY.md)
- [docs/HANDSHAKE_CURRENT_STATE.md](./docs/HANDSHAKE_CURRENT_STATE.md)
