# LLM_ENTRY Conformity Report

Stand: 2026-04-02

## Referenz

Die Konformitätsregeln wurden aus folgender Referenz abgeleitet:

- `reference/source_snapshots/BioEmergenzia_min/AKTUELL/BioEmergenzia/LLM_ENTRY.md`

## Übertrag auf ShinonLLM

Die BioEmergenzia-Referenz ist auf ein `src/kernel/*` + `project.manifest` Contract-System ausgelegt.  
ShinonLLM nutzt stattdessen eine modulare Runtime-Struktur (`backend`, `orchestrator`, `inference`, `telemetry`, `tests`).

Deshalb wurde die Konformität semantisch umgesetzt:

- Pflicht-Lesereihenfolge definiert in [../LLM_ENTRY.md](../LLM_ENTRY.md)
- Contract-First Enforcement über `orchestrator/src/contracts/*`
- Determinismus-/Replay-Gate über `tests/gates/replay-gate.spec.ts`
- Contract-Gate über `tests/gates/contract-gate.spec.ts`
- Fail-closed Backend-Verhalten über `backend/src/routes/*`

## Pflicht-Gates

Vor jedem Push müssen folgende Checks grün sein:

1. `npm run verify:backend`
2. `cd frontend && npm run build`

## Git Scope (was gehört ins Repo)

Commitbar:

- Source-Code
- Tests
- Konfigurationsdateien
- Lockfiles (`package-lock.json`)
- Dokumentation

Nicht commitbar:

- `node_modules/`
- Build-Artefakte (`.next/`, `dist/`, `build/`)
- lokale Cache-/Tempdateien
- `.env*` (außer bewusst gepflegtes `.env.example`)

