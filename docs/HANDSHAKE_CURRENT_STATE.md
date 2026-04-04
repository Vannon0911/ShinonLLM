# HANDSHAKE CURRENT STATE

Date: 2026-04-05  
Release baseline: 0.3.0-alpha  
Scope: "Real Persona with Two-Tier Memory"

## One-line truth

Shinon ist eine **Real Persona** mit Gedächtnis, Haltungen und der Fähigkeit zum Konfrontieren – gebaut auf lokaler Runtime-Intelligenz, nicht auf Cloud-Prompt-Tricks.

## Current architecture state

- **Runtime entry and request validation** are active in `backend`.
- **Contract-first orchestration** is active in `orchestrator`.
- **Inference routing** is active in `inference` with retry mechanism and llama.cpp/Ollama support.
- **Session memory** (v1) exists in `memory` with SQLite persistence via `PRAGMA user_version` (v0 → v1).
- **Determinism and baseline gates** exist in `tests/gates`.
- **Live Inference** tested via llama.cpp (Qwen 0.5B local) for DE, EN, JP.
- **Frontend Memory Binding** is active (sessionId/conversationId passed to ChatShell).

## New architecture components (Scope 0.3.0)

The following components are **planned or in development** for the new character-based architecture:

- `character/core/identity.ts` - Shinons feste Basis-Personality
- `character/attitudes/tracker.ts` - Dynamische Haltungen pro User (-10 bis +10)
- `character/experience/patterns.ts` - Pattern-Erkennung & Anker-Bildung
- `character/experience/twoTierMemory.ts` - Schicht 1 (Fakten) + Schicht 2 (Patterns)
- `character/state/emotional.ts` - Aktuelle Stimmung pro Session
- `character/prompts/generator.ts` - "Shinons Gedanken"-Prompts für LLM
- `memory/zones/hotZone.ts` - Aktuelle Session (ungefilterter Zugriff)
- `memory/zones/midZone.ts` - Letzte 10 Sessions (selektiver Zugriff)
- `memory/zones/coldZone.ts` - Archiv mit Pattern-Härtung

## Security boundaries verified in current state

- Live `/api/chat` traffic is validated before route execution.
- Client-supplied `system` and `assistant` roles are not accepted as trusted orchestration history.
- The orchestrator injects the trusted system prompt server-side for backend calls.
- Backend failure and fallback failure are fail-closed; prompt content is not echoed back as a fake successful assistant reply.

## Determinism and verification policy

Mandatory checks:

1. `npm run test:determinism`
2. `npm run verify:backend`
3. `npm --prefix frontend run build`

Fail-closed principle:

- If contract, replay, or baseline checks fail, release handshake is blocked.
- New character components must maintain determinism in pattern extraction and attitude calculation.

## Latest verification run

Executed on 2026-04-05:

- `npm run test:determinism` → PASS
- `npm run verify:backend` → PASS
- `npm run test:e2e` → PASS
- Documentation restructuring → PASS

## Scope boundaries: Two-Tier Memory Architecture

**MVP Phase (0.3.0-alpha):**
- Local-first, persistent session runtime optimized for 0.5B-7B models.
- Two-Tier Memory: Tier 1 (Personal facts) + Tier 2 (Pattern anchors).
- Hot/Mid/Cold Zones with automated pattern extraction from Cold Zone.
- Character attitudes tracked across sessions (warmth, respect, patience, trust).
- Confrontation mode when pattern confidence > 0.8 and patience < 5.

**Product Phase (0.4.0+):**
- Real Persona behavior through Pattern Analytics scoring (Impact & Frequency).
- Drift protection mode (detect persona divergence across conversations).
- Multi-session learning with cross-conversation knowledge transfer.

**Explicitly NOT in Scope:**
- Raw vector-db chat hoarding (we do Pattern Analytics, not data dumping).
- Cloud-based model APIs (local-first only).
- Mutable persona configuration (Shinons core identity is fixed, only attitudes change).

## Open risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Model Context Bleed** | Medium | llama.cpp KV-cache bleeds previous replies; needs explicit cache isolation between REST calls |
| **Pattern Engine Not Implemented** | High | Currently only regex classifier; full pattern recognition pending Phase 3 |
| **Character Attitudes Not Implemented** | High | Attitude tracking system pending; current responses are static |
| **Two-Tier Schema Migration** | Medium | SQLite v1 → v2 migration needed for pattern tables; must be fail-closed |
| **Cold Zone Härtung** | Medium | Pattern extraction from archive not implemented; currently just FIFO decay |
| **Frontend Proxy Auth** | Low | No end-user auth on `/api/chat` yet; tolerable for local dev, security risk for network exposure |

## Next checkpoint

After implementing:
1. SQLite Schema v2 (pattern tables, attitude tracking)
2. Hot/Mid/Cold Zone management
3. Basic pattern extraction (preference, commitment, relationship, contradiction)
4. Attitude tracker with confrontation thresholds
5. Character-aware prompt generator

Bump to 0.3.0-beta and run full determinism verification suite.

## Documentation Reference

| Document | Purpose |
|----------|---------|
| `README.md` | Project overview with AGENTS-style directness |
| `LLM_ENTRY.md` | Mandatory entry gate for developers |
| `ARCHITECTURE_OVERVIEW.md` | Component structure and data flow |
| `MEMORY_POLICY.md` | Two-Tier + Zone Management rules |
| `OPS_PLAYBOOKS.md` | Operational troubleshooting |
| `LOCAL_LLAMACPP_SETUP.md` | Local LLM setup guide |

---

*This is the authoritative current state. For historical versions, check git history.*
