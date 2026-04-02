# Release 0.2.1a

Datum: 2026-04-02
Package-Versionen: `0.2.1-a`
Release-Name: `0.2.1a`

## Scope

- Zielarchitektur fuer MVP konsolidiert und in den Docs verankert.
- Repo-Scan gegen MVP-Zielbild erstellt.
- README und Praesentationsmaterial inhaltlich deutlich erweitert.
- Versionsanhebung auf `0.2.1-a` fuer root/backend/frontend.

## Enthaltene Dokumente

- `docs/ZIELARCHITEKTUR_MVP.md`
- `docs/MVP_SCOPE_SCAN_0.2.1a.md`
- `docs/PRAESENTATION_0.2.1a.md`

## Technischer Stand

- Runtime-Kette ist auf Backend -> Orchestrator -> Inference ausgerichtet.
- Inference-Default ist deterministic-offline; live nur per Opt-in.
- Session-Memory-Persistenzvertrag inkl. SQLite-Adapter vorhanden.

## Bekannte Restpunkte

1. CI-Gates noch nicht als Pflichtworkflow verankert.
2. SQLite-Migrationsstrategie noch nicht voll spezifiziert.
3. E2E-Browser-Flow nicht im Standard-Verify enthalten.
