# Repo Hygiene 0.2.3

Stand: 2026-04-02

## Ziel

Projektweite Hygiene-Regeln verbindlich machen, damit Releases reproduzierbar bleiben.

## Eingefuehrte Massnahmen

1. Einheitliche Editor-Regeln via `.editorconfig`.
2. Einheitliche Git-Textbehandlung via `.gitattributes`.
3. Root-Start/Stop-Skripte fuer lokale Laufzeitports (`start-local.ps1`, `stop-local.ps1`).
4. Dokumentationsindex auf aktuelle Release-Artefakte aktualisiert.

## Operative Regeln

1. Keine Build-Artefakte committen (`.next/`, `dist/`, `build/`).
2. Release nur nach `verify:backend` + Frontend-Build.
3. Runtime-/Inference-Policy-Aenderungen immer mit Gate-Updates zusammen committen.
4. Doku muss bei Verhaltensaenderungen im selben PR aktualisiert werden.

## Offene Hygiene-Punkte

1. CI-Pflichtgates fuer `main` branch erzwingen.
2. Lockfile-Root-Warnung in Next.js gezielt adressieren (`turbopack.root` oder Lockfile-Strategie).
