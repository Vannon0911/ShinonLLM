# Target System Overview (VGRAF + SHINON + ChatKI)

Stand: 2026-04-02

## Kernfakt

Das Zielprodukt ist kein einzelnes Modul, sondern die Kombination aus:

`VGRAF-Scanner + SHINON-State-System + ChatKI-Definitionsbasis + lokale 1B-LLM-Runtime`

Leitprinzip: **Die Runtime denkt, das LLM formuliert Text.**

## Gesamtuebersicht

- `VGRAF`: Scanner-/Scoring-Keim (Signalerkennung, Priorisierung, Gewichtung)
- `ChatKI`: statische Definitionsbasis (Welten, Entitaeten, Szenen, Quests)
- `SHINON`: Story-/State-/Memory-Betriebssystem
- `Runtime`: orchestriert Ablauf, Kontext, Prioritaet, Zeitgewichtung
- `LLM (1B)`: nur Ausgabeformat + Sprachstil

## Vergleich VGRAF vs SHINON/ChatKI

| Teil | Aufgabe |
|---|---|
| VGRAF | externe Signale erfassen, Muster erkennen, Relevanz scoren |
| SHINON | Zustand/Marker/Memory tragen und Kontinuitaet sichern |
| ChatKI | feste Regeln und Definitionsstruktur liefern |

Kurz:
- VGRAF = Scanner-Hund
- ChatKI = Regelbuch
- SHINON = State-/Story-OS

## Runtime-, Memory- und Persona-Regeln

### Runtime-Regeln

1. LLM bekommt nie ungefilterte Rohdaten.
2. Marker/Index/Prioritaet/Zeitgewichtung werden nur von der Runtime gesetzt.
3. Runtime steuert Ablauf, nicht das Modell.

### Memory-Regeln

1. Trennung in `Core`, `Session`, `Archive`.
2. Jede Entitaet hat stabile ID.
3. Wichtigkeit wird durch Runtime-Scoring gesetzt, nicht durch Modell-Intuition.

### Persona-Regeln

1. Persona ist Core-Memory, kein spontaner Rollenspielmodus.
2. Userstyle wirkt als Stilfilter, nicht als Logikquelle.
3. Antworten entstehen auf Basis eines Runtime-Kontextpakets.

## Technischer Bauplan (V1)

Module:

- `vgraf_ingest`
- `pattern_scanner`
- `scoring_engine`
- `memory_chain`
- `context_builder`
- `llm_adapter`
- `shinon_core`
- `postprocessor`

Ablauf:

1. Input kommt rein.
2. Scanner erkennt Muster, Zeitbezug, Prioritaet, Marker.
3. Scoring bewertet Treffer.
4. Memory-Chain liefert passende Core-/Session-/Archive-Bloecke.
5. Context-Builder erzeugt ein kompaktes Arbeitspaket.
6. LLM verarbeitet nur Stil + Aufgabe + freigegebene Fakten.
7. Postprocessor aktualisiert Marker/Index/Memory.

## Mastertabelle der Ideen

| Idee | Kategorie | Reifegrad | Urteil |
|---|---|---|---|
| Deterministische Bio-/Emergenz-Simulation | Simulationssystem | hoch | behalten |
| ChatKI RPG Framework | RPG/State-System | mittel-hoch | behalten |
| SHINON | Story-/Memory-System | mittel | behalten, aus ChatKI ableiten |
| VGRAF | Scanner/Scoring-System | niedrig-mittel | behalten, umbauen |
| Runtime-first Local LLM System | Plattformkonzept | mittel | zentralisieren |
| Utility-App Einkauf | App/Tooling | mittel | separat |
| Code Quest | Lern-/Game-Prototyp | niedrig-mittel | separat |

## Die staerksten 5 Konzepte

1. Deterministische Bio-/Emergenz-Simulation
2. ChatKI RPG Framework
3. SHINON als Story-/Memory-Schicht
4. VGRAF als Scanner-/Priorisierungsmodul
5. Runtime-first Local LLM System

## Vergleich BioEmergenzia vs RPG-System

| Bereich | BioEmergenzia | ChatKI/SHINON |
|---|---|---|
| Schwerpunkt | deterministische Simulation | narrative Kontinuitaet |
| Staerke | technische Regelhaerte | semantische Zustandspflege |
| Gemeinsamer Kern | IDs, Zustandstrennung, Runtime-Kontrolle, kontrollierte Uebergaenge |

## Zielzustand in einem Satz

Ein lokales 1B-System, bei dem Runtime-Scanner/Scoring/Memory/Priorisierung die Entscheidungen tragen und das LLM nur den finalen Text produziert.

## Scope-Hinweis

`VGRAF` liegt aktuell als externer Keim/Quellmaterial vor und ist noch nicht vollstaendig als eigenes Modul in dieser Repository-Struktur integriert.
