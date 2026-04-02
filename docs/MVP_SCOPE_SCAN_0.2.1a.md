# MVP Scope Scan Report (0.2.1a)

Stand: 2026-04-02
Baseline: `docs/ZIELARCHITEKTUR_MVP.md` + `FELIX_SYSTEM_ARCHITECTURE-1.docx`

## 1. Ziel des Scans

Dieser Scan vergleicht den aktuellen Codebestand gegen die MVP-Zielarchitektur und markiert Luecken nach Prioritaet.

## 2. Ergebnis auf einen Blick

- Gesamtstatus: **teilweise aligned, tragfaehig fuer MVP-Weiterbau**
- Starke Bereiche: Contracts/Gates, Runtime-Pfad, deterministischer Offline-Default
- Kritische Restluecken: CI-Enforcement, produktive DB-Migrationsstrategie, E2E-Standardisierung

## 3. Architektur-Checkliste

| Bereich | Ziel | Ist | Status |
|---|---|---|---|
| API Entry | Kanonische Chat/Health-Endpunkte | `/api/chat`, `/api/health` + Aliase vorhanden | Erfuellt |
| Runtime Chain | Backend -> Orchestrator -> Inference | umgesetzt | Erfuellt |
| Inference Default | Kein Live-Default | `live=false` Standard | Erfuellt |
| Session Memory | Persistenz ueber Restart moeglich | In-Memory + SQLite-Adapter Contract | Teilweise |
| Decay | TTL/Retention | TTL + Decay Hooks vorhanden | Teilweise |
| Contract Gates | fail-closed | input/output/action gates aktiv | Erfuellt |
| Replay Gates | deterministische Integritaet | aktiv inkl. Baseline testline | Erfuellt |
| Release Governance | reproduzierbarer Release-Flow | vorhanden, aber CI nicht hart erzwungen | Teilweise |

## 4. Evidenz (Dateien)

- Runtime-Pfad: `backend/src/routes/chat.ts`, `orchestrator/src/pipeline/orchestrateTurn.ts`, `inference/src/router/backendRouter.ts`
- Persistenz: `memory/src/session/sessionPersistence.ts`, `backend/src/httpServer.ts`
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

## 6. Release 0.2.1a Entscheidung

Release ist als MVP-Dokumentations- und Architektur-Haertung sinnvoll, wenn lokal folgende Checks gruen laufen:

1. `npm run verify:backend`
2. `cd frontend && npm run build`

Hinweis: In der Package-Semantik wird `0.2.1-a` genutzt (SemVer-kompatibel), waehrend der Release-Name als `0.2.1a` gefuehrt wird.
