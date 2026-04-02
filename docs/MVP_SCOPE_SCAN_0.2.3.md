# MVP Scope Scan Report (0.2.3)

Stand: 2026-04-02
Baseline: `docs/ZIELARCHITEKTUR_MVP.md` + `FELIX_SYSTEM_ARCHITECTURE-1.docx`

## 1. Ziel des Scans

Dieser Scan vergleicht den aktuellen Codebestand gegen die MVP-Zielarchitektur und markiert Luecken nach Prioritaet.

## 2. Ergebnis auf einen Blick

- Gesamtstatus: **aligned fuer MVP-Release, mit klaren Restluecken**
- Starke Bereiche: Runtime-Planung, Live+Offline-Evaluator, Replay-Hash-Evidenz, Contract-Gates
- Kritische Restluecken: CI-Enforcement, SQLite-Migrationsstrategie, E2E-Standardisierung

## 3. Architektur-Checkliste

| Bereich | Ziel | Ist | Status |
|---|---|---|---|
| API Entry | Kanonische Chat/Health-Endpunkte | `/api/chat`, `/api/health` + Aliase vorhanden | Erfuellt |
| Runtime Chain | Backend -> Orchestrator -> Inference | umgesetzt | Erfuellt |
| Runtime Planning | Runtime plant den Turn vor Inference | `PLAN: intent/next_action` im Promptpfad | Erfuellt |
| Inference Policy | Live + Offline-Evaluator Pflicht | `live=false` unzulaessig, Evaluator + replayHash immer gesetzt | Erfuellt |
| Session Memory | Persistenz ueber Restart moeglich | In-Memory + SQLite-Adapter-Contract vorhanden | Teilweise |
| Decay | Decay im Write-Pfad verpflichtend | nach jedem Chat-Write aktiv | Erfuellt |
| Contract Gates | fail-closed | input/output/action gates aktiv | Erfuellt |
| Replay Gates | deterministische Integritaet | aktiv inkl. Baseline testline | Erfuellt |
| Release Governance | reproduzierbarer Release-Flow | dokumentiert, aber CI nicht hart erzwungen | Teilweise |

## 4. Evidenz (Dateien)

- Runtime-Pfad: `backend/src/routes/chat.ts`, `orchestrator/src/pipeline/orchestrateTurn.ts`, `inference/src/router/backendRouter.ts`
- Persistenz/Decay: `memory/src/session/sessionPersistence.ts`, `backend/src/httpServer.ts`
- Gates: `tests/gates/contract-gate.spec.ts`, `tests/gates/replay-gate.spec.ts`, `tests/gates/baseline-integrity.spec.ts`
- Integrationen: `tests/integration/chat-flow.spec.ts`, `tests/integration/fallback.spec.ts`

## 5. Priorisierte Luecken

### P0
1. CI-Workflow verpflichtend auf `verify:backend` + `frontend build` setzen.
2. SQLite produktiv hardenen (Schema-Version + Migrationspfad + Recovery-Strategie).

### P1
1. Memory-Policy von Session-only zu Core/Session/Archive ausbauen.
2. E2E-Browser-Flow als standardisierten Verify-Schritt etablieren.

### P2
1. Operations-Playbooks fuer Failure-Modes erweitern.
2. Release-Artefakt-Checkliste automatisieren (Tag, Notes, Gate-Status).

## 6. Release-Entscheidung 0.2.3

Release ist fuer MVP sinnvoll, wenn lokal folgende Checks gruen laufen:

1. `npm run verify:backend`
2. `cd frontend && npm run build`
