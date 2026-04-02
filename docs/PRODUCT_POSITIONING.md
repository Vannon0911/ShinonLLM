# Product Positioning

Stand: 2026-04-02
Release-Kontext: 0.2.3

## One-Line Positioning

ShinonLLM ist ein runtime-first Local-LLM-System, das Entscheidung, Kontext und Memory-Pfade in Code verankert statt in promptbasierten Zufall.

## Problem, das adressiert wird

Viele lokale LLM-Setups scheitern nicht an Modellqualitaet, sondern an Systemgrenzen:
- unklare Verantwortungen zwischen Runtime und Modell
- unkontrollierte Memory-Writes
- fehlende Reproduzierbarkeit im Betrieb

## Product Promise

1. Vorhersagbares Verhalten
- Contract-Gates und fail-closed Verhalten im API-/Runtime-Pfad.

2. Nachvollziehbare Qualitaet
- Replay/Baseline/Contract-Gates als feste Integritaetsgrenze.

3. Lokale Betriebsfaehigkeit
- Inference mit deterministic-offline Default.
- SQLite-basierte Session-Persistenz als Opt-in.

## Zielgruppen

### Consumer
- wollen stabile Antworten ohne Cloud-Zwang
- brauchen klare Nutzbarkeit statt Experimentierchaos

### Developer/Operators
- brauchen kontrollierte Contracts, deterministische Tests und klare Runtime-Rollen

## Kern-Differenzierung

- Runtime-first statt model-first
- Memory als kontrollierter Kanal statt ungebremster Kontext-Speicher
- Release-/Gate-Disziplin statt ad-hoc Iteration

## What ShinonLLM Is Not

- Kein Prompt-Wrapper mit kosmetischer UI.
- Keine Agenten-Spielwiese ohne harte Vertragsgrenzen.
- Kein Demo-Stack, der nur im Happy-Path funktioniert.

## Evidence im Repo

- Runtime chain: `backend -> orchestrator -> inference`
- Contracts/Gates: `tests/gates/*`
- Session persistence contract: `memory/src/session/sessionPersistence.ts`
- Dokumentierte Zielarchitektur: `docs/ZIELARCHITEKTUR_MVP.md`

## Strategischer Fokus (MVP)

1. Laufzeitstabilitaet und Integritaet priorisieren.
2. Memory-Persistenz und Decay kontrolliert ausbauen.
3. Release-Prozess als verifizierbare Kette halten.

