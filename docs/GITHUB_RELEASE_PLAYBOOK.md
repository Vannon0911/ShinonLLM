# GitHub Release Playbook

Dieses Playbook beschreibt einen klaren, reproduzierbaren Release-Ablauf auf GitHub fuer ShinonLLM. Es ergaenzt den bestehenden Prozess in `docs/releases/RELEASE_PROCESS.md` und fokussiert auf praktische Ausfuehrung im Repository.

## Zielbild

- Nach jedem Release existieren ein sauberer Tag, verifizierte CI-Laeufe und nachvollziehbare Release Notes.
- Rollback bleibt innerhalb weniger Minuten moeglich, ohne ad-hoc Aktionen.
- Release-Kommunikation ist fuer Team, Nutzer und Betrieb konsistent.

![Release Flow Uebersicht](./assets/release-flow.svg)

## 1) Vorbereitung vor dem Tag

1. Scope und Version bestimmen (SemVer gemaess `docs/releases/VERSIONING.md`).
2. Changelog pflegen (`CHANGELOG.md`, Abschnitt `[Unreleased]` in neue Version ueberfuehren).
3. Lokale Pruefungen durchfuehren:
   - `npm run verify:backend`
   - `cd frontend && npm run build`
4. Sicherstellen, dass `main` sauber und aktuell ist (kein lokaler Sonderzustand).

## 2) Tag erstellen und pushen

1. Annotierten Tag anlegen:

```bash
git tag -a vX.Y.Z -m "Release vX.Y.Z"
```

2. Tag pushen:

```bash
git push origin vX.Y.Z
```

3. Kontrolle auf GitHub: Tag erscheint unter *Releases/Tags* und triggert Release-Workflow.

![Tag und Artefakte](./assets/release-tag.svg)

## 3) Release Notes erstellen

1. In GitHub auf *Draft new release* gehen und den Tag `vX.Y.Z` waehlen.
2. Struktur fuer Notes nutzen:
   - Summary
   - Added
   - Changed
   - Fixed
   - Breaking (falls vorhanden)
3. Wichtige Referenzen verlinken:
   - `CHANGELOG.md`
   - relevante Doku in `docs/`
   - ggf. Migrationshinweise
4. Notes veroeffentlichen, sobald CI komplett gruen ist.

![Release Notes Struktur](./assets/release-notes.svg)

## 4) CI-Gates und Freigabe

1. GitHub Actions pruefen (mindestens `CI` und `Release`).
2. Gate-Kriterien:
   - Build erfolgreich
   - Tests/Gates erfolgreich
   - keine kritischen Security- oder Policy-Fehler
3. Erst bei gruenen Gates den Release als final betrachten.

## 5) Rollback-Strategie

Standardfall: kein Tag-Loeschen als erste Reaktion. Stattdessen schnelle Korrektur per Patch-Release.

1. Fehler analysieren und Hotfix auf `main` mergen.
2. Patch-Version erhoehen (`vX.Y.(Z+1)`).
3. Neuen Tag + neue Release Notes publizieren.
4. In den Notes von `vX.Y.Z` auf den Korrektur-Release verweisen.

Fallback (nur falls zwingend notwendig): fehlerhaften Release auf GitHub als *pre-release* markieren oder klar als ersetzt kennzeichnen.

![Rollback Pfad](./assets/release-rollback.svg)

## UI/UX-Konzept fuer Release-Dokumentation

Ziel: Release-Infos in Doku und GitHub sofort erfassbar machen, ohne Textwand.

- Ein visuelles 3-Spalten-Muster nutzen: `Prepare -> Validate -> Publish`.
- Pro Abschnitt genau ein Callout mit Zustand (`Ready`, `Blocked`, `Done`).
- Einheitliche Farbsemantik: Blau (Info), Gruen (OK), Orange (Achtung), Rot (Blocker).

![UI/UX Konzeptbild: Release Dashboard](./assets/release-uiux-concept.svg)

### Mini-Checkliste fuer den visuellen Auftritt

- Ueberschriften kurz und handlungsorientiert formulieren.
- Maximal 5 Bulletpoints pro Abschnitt.
- Wichtige Entscheidungen als Box oder Badge hervorheben.

## Quick Reference

```bash
# 1) Vorbereiten
npm run verify:backend
cd frontend && npm run build

# 2) Taggen
git tag -a vX.Y.Z -m "Release vX.Y.Z"
git push origin vX.Y.Z

# 3) Auf GitHub
# Draft Release -> Notes einfuegen -> CI pruefen -> Publish
```
