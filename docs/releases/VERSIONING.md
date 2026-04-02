# Versioning Policy

ShinonLLM nutzt Semantic Versioning nach `MAJOR.MINOR.PATCH`.

## SemVer Regeln

- `MAJOR`: Breaking Change an Runtime-Verhalten, oeffentlichem API-Vertrag oder Persistenz-Semantik.
- `MINOR`: Rueckwaertskompatible Features oder neue produktrelevante Faehigkeiten.
- `PATCH`: Rueckwaertskompatible Fehlerbehebungen, Stabilitaetsverbesserungen, Doku-/Ops-Korrekturen.

## Monorepo-Version (verbindlich)

Dieses Repo fuehrt eine einheitliche Produkt-Version ueber mehrere Pakete:

- `package.json` (root)
- `backend/package.json`
- `frontend/package.json`

Regel: Alle drei Versionen muessen identisch sein.

## Tagging und Releases

- Git-Tag-Format: `vMAJOR.MINOR.PATCH` (Beispiel: `v0.3.0`).
- Ein Tag im gueltigen Format triggert den GitHub-Release-Workflow.
- Release Notes werden aus dem passenden Abschnitt in `CHANGELOG.md` erzeugt.

## Pre-Releases

Pre-Releases sind erlaubt (z. B. `0.3.0-rc.1`), muessen aber bewusst entschieden und dokumentiert werden.
Der Standard-Release-Workflow in GitHub Actions ist aktuell auf stabile Tags `vMAJOR.MINOR.PATCH` ausgerichtet.

## Version-Bump Entscheidung

- API- oder Contract-Break: immer MAJOR.
- Neues Verhalten ohne Break: MINOR.
- Fix ohne neue Faehigkeit: PATCH.

## Verbindliche Regel

Wenn unklar ist, ob ein Break vorliegt, wird konservativ als Breaking eingeordnet und MAJOR gewaehlt.

