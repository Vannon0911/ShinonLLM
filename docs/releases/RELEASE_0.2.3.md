# Release 0.2.3

Datum: 2026-04-02
Package-Versionen: `0.2.3`
Release-Name: `0.2.3`

## Scope

- Runtime-Policy auf Live+Evaluator-Pflicht ausgerichtet.
- `live=false` als unzulaessig im Routing-Contract verankert.
- Replay-Hash-Evidenz und Decay-Pflicht im Laufzeitpfad.
- Frontend-Chat-Flow gegen Hangs/Locking gehaertet (Timeout + bessere Eingabe-UX).
- Repo-Hygiene und Doku-Haertung projektweit erweitert.

## Enthaltene Dokumente

- `docs/ZIELARCHITEKTUR_MVP.md`
- `docs/MVP_SCOPE_SCAN_0.2.3.md`
- `docs/PRAESENTATION_0.2.3.md`
- `docs/REPO_HYGIENE_0.2.3.md`

## Technischer Stand

- Runtime-Kette: Backend -> Orchestrator (Plan) -> Inference (Live + Evaluator)
- Inference: Offline-Evaluator + replayHash bei jedem Aufruf.
- Session-Memory: Persistenz-Contract und verpflichtendes Decay nach jedem Write.

## Bekannte Restpunkte

1. CI-Gates noch nicht als Pflichtworkflow verankert.
2. SQLite-Migrationsstrategie noch nicht voll spezifiziert.
3. E2E-Browser-Flow nicht im Standard-Verify enthalten.
