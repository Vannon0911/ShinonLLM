# Testing And Baseline Integrity

Stand: 2026-04-02

## Ziel

Diese Seite definiert den vollständigen Testpfad für ShinonLLM und erklärt die Baseline-Integrity-Tests mit fail-closed Fokus.

## Test-Scopes

1. `Gates`
- Contract-Validierung
- Replay-/Determinismus-Validierung
- Baseline-Integrity (Seed-Doppeltests + Action-Set-Abgleich)

2. `Backend`
- Unit-Tests für Orchestrator/Router
- Integrationstests für Fallback- und Chat-Flow

3. `Frontend`
- Build/Type-Checks als Integritätsgrenze vor Release

## Standardbefehle

```powershell
# Baseline Integrität explizit
npm run test:baseline-integrity

# Alle Gates
npm run test:gates

# Vollständiger Backend-Verify-Flow
npm run verify:backend

# Frontend
cd frontend
npm run build
```

## Baseline Integrity (fail-closed)

Script: `tests/gates/baseline-integrity.spec.ts`

Geprüfte Invarianten:

1. Deterministische Seeds
- gleicher Seed doppelt -> gleicher Replay-Hash
- gleiche Payload mit anderer Key-Reihenfolge -> gleicher Replay-Hash

2. Sequenz-Integrität
- gleiche Payload mit anderer Sequence -> anderer Replay-Hash

3. Action-Set-Integrität
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

## Maschinenlesbare Testline

Der Baseline-Test gibt eine standardisierte Zeile aus:

```text
testline | seed_pair=replay-gate-run|rev=1|seq=7 | replay_hash_equal=1 | sequence_variant_diff=1 | action_set_declared=send_message,log_event | action_send_message=accepted | action_blocked_action=rejected
```

Diese Zeile ist als kompakter Beleg für Seed-Doppeltest + Action-Set-Abgleich gedacht.

## Release-Anforderung

Vor Tag/Release müssen mindestens folgende Befehle ohne Abbruch durchlaufen:

1. `npm run verify:backend`
2. `cd frontend && npm run build`

Siehe auch:
- `docs/releases/RELEASE_PROCESS.md`
- `docs/GITHUB_RELEASE_PLAYBOOK.md`
