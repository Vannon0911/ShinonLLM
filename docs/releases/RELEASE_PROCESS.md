# Release Process

Dieses Dokument definiert den standardisierten Release-Ablauf fuer ShinonLLM.

## Release-Checkliste

1. Version festlegen gemaess [VERSIONING.md](./VERSIONING.md).
2. `CHANGELOG.md` aktualisieren und `[Unreleased]` in neue Version ueberfuehren.
3. Runtime und Qualitaets-Gates ausfuehren:
   - `npm run verify:backend`
   - `npm --prefix frontend run build`
4. Produktdoku und Einstieg pruefen:
   - `README.md`
   - `docs/README.md`
   - `docs/HANDSHAKE_CURRENT_STATE.md`
   - `docs/TODO.md`
5. Pull Request finalisieren und CI-Status sicherstellen.
6. Tag erstellen: `vMAJOR.MINOR.PATCH`.
7. Tag pushen und automatischen GitHub Release pruefen.
8. Release Notes, Risiken und ggf. Follow-up Tickets dokumentieren.

## Release Notes Struktur

- Summary: Nutzerwirkung in 2-4 Saetzen.
- Added: neue Faehigkeiten.
- Changed: Verhalten oder Architektur ohne Break.
- Fixed: Fehlerbehebungen.
- Breaking: Migrationsrelevante Aenderungen.

## Rollback/Hotfix Regel

- Fehlgeschlagene oder fehlerhafte Releases werden nicht ueberschrieben.
- Korrektur erfolgt ueber neuen Patch-Release und Changelog-Eintrag mit Root-Cause-Hinweis.

