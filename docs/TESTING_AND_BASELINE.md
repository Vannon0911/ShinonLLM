# Testing And Baseline Integrity

Stand: 2026-04-02

## Ziel

Diese Seite definiert den verbindlichen Testpfad fuer ShinonLLM mit fail-closed Fokus.

## Test-Scopes

1. Gates
- Contract-Validierung
- Replay-/Determinismus-Validierung
- Baseline-Integrity (Seed-Doppeltests + Action-Set-Abgleich)

2. Backend
- Unit: Orchestrator, Router, Session-Persistenz
- Integration: Fallback- und Chat-Flow

3. Frontend
- Build/Type-Checks als Integritaetsgrenze vor Release

## Standardbefehle

```powershell
npm run test:baseline-integrity
npm run test:gates
npm run verify:backend
cd frontend
npm run build
```

## Baseline Integrity (fail-closed)

Script: `tests/gates/baseline-integrity.spec.ts`

Gepruefte Invarianten:

1. Deterministische Seeds
- gleicher Seed doppelt -> gleicher Replay-Hash
- gleiche Payload mit anderer Key-Reihenfolge -> gleicher Replay-Hash

2. Sequenz-Integritaet
- gleiche Payload mit anderer Sequence -> anderer Replay-Hash

3. Action-Set-Integritaet
- erlaubte Action (`send_message`) innerhalb `allowedActions` -> akzeptiert
- unerlaubte Action ohne `allowedActions` -> blockiert
- fehlerhafte `allowedActions`-Typen -> blockiert

4. Contract fail-closed
- fehlendes `turn` bei `inputSchema` -> blockiert
- fehlendes `turn` bei `outputSchema` -> blockiert

5. Replay fail-closed
- leeres `run_id` -> blockiert
- `revision <= 0` -> blockiert
- negative `sequence` -> blockiert

## Zusatzabdeckung

1. Session-Persistenz
- `tests/unit/session-persistence.spec.ts` prueft In-Memory-Persistenz (`load`, `append`, `decay`)
- gleiches Script prueft SQLite-Adapter-Contract (Schema/Insert/Select)

2. Inference-Default-Policy
- Router-/Fallback-Tests pruefen `raw.mode=deterministic-offline` als Standard
- Live-Inference nur per Opt-in (`options.live === true`)

## Maschinenlesbare Testline

```text
testline | seed_pair=replay-gate-run|rev=1|seq=7 | replay_hash_equal=1 | sequence_variant_diff=1 | action_set_declared=send_message,log_event | action_send_message=accepted | action_blocked_action=rejected
```

## Release-Anforderung

Vor Tag/Release muessen mindestens folgende Befehle ohne Abbruch durchlaufen:

1. `npm run verify:backend`
2. `cd frontend && npm run build`

Siehe auch:
- `docs/releases/RELEASE_PROCESS.md`
- `docs/GITHUB_RELEASE_PLAYBOOK.md`
