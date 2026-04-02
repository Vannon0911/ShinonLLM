# DETERMINISTISCHES LLM-RUNTIME-KONZEPT
## Technisches Konzept-Dokument - Proof-of-Concept Basis
**Destilliert aus: CHATKI / Jax / Shinon / VGRAF / Crafting Clicker / LifexLab / SoD / SeedWorld**  
**Stand: April 2026 | Autor: Felix Vannon (Operator)**

---

## 0. KERNIDEE (1 Satz)

> Ein deterministischer Laufzeit-Layer der zwischen Langzeit-Archiv und LLM-Prompt sitzt, jeden Schreibzugriff gated, Memory nach Prioritaet vorsortiert, und Beweis-Artefakte fuer jeden Zustandswechsel hinterlaesst - sodass das LLM nur noch interpretiert, nie mehr kontrolliert.

---

## 1. PROBLEM - WARUM ALLE ANDEREN SCHEITERN

Bestehende Companion/Memory-Systeme scheitern an denselben drei Fehlern:

**Fehler 1: Chat-Historie != Memory**  
Sie speichern Dialoge, nicht Fakten. Das LLM bekommt Rohrpost statt Briefing. Latenz explodiert sobald das Archiv waechst, weil alles durch den Hot Path muss.

**Fehler 2: LLM als Gott**  
Das LLM entscheidet selbst was relevant ist, was gespeichert wird, was vergessen wird.

**Fehler 3: Kein Decay, keine Grenze**  
Systeme akkumulieren Memory ohne Bereinigung. Emotionale Reinforcement-Loops entstehen - das System verstaerkt was der User hoeren will, nicht was wahr ist.

---

## 2. ARCHITEKTUR - DER STACK

```text
+-----------------------------------------+
|               USER INPUT                |
+----------------+------------------------+
                 |
+----------------v------------------------+
|      SCANNER 1 (Hot Path)               |
|  - Intent-Extraktion                    |
|  - Tag-Zuweisung                        |
|  - Keine LLM-Zeit                       |
+----------------+------------------------+
                 |
+----------------v------------------------+
|      RETRIEVAL + FILTER                 |
|  - Priority Score abrufen               |
|  - intent / recency / confidence gates  |
+----------------+------------------------+
                 |
+----------------v------------------------+
|      CONTEXT COMPILER (Gate)            |
|  - Hard Cap: N Token max                |
|  - Nur freigegebene Memory-Keys rein    |
|  - assertMemoryAllowed()                |
+----------------+------------------------+
                 |
+----------------v------------------------+
|           LLM (Interpret)               |
|  - Sieht NUR was Runtime liefert        |
|  - Antwortet, keine State-Writes        |
+----------------+------------------------+
                 |
+----------------v------------------------+
|      RUNTIME POST-PROCESSOR             |
|  - Parsed LLM-Output                    |
|  - Extrahiert Memory-Updates            |
|  - Schreibt NUR via dispatch()          |
+----------------+------------------------+
                 |
+----------------v------------------------+
|      MEMORY STORE (SQLite)              |
|  - goal/fact/pref/relation/open_loop/   |
|    constraint                            |
|  - Priority Score pro Entry             |
|  - ADD / UPDATE / DELETE / DECAY        |
+----------------+------------------------+
                 |
+----------------v------------------------+
|      SCANNER 2 (Cold Path)              |
|  - asynchron / nachts                   |
|  - deduplizieren, decay, merge          |
+-----------------------------------------+
```

---

## 3. MEMORY POLICY (KANONISCHER VERWEIS)

Dieses Konzeptdokument beschreibt Architekturprinzipien. Die verbindliche Memory-Policy (TTL, Decay-Retention, SQLite-Opt-in, Fail-Closed/Best-Effort, Migrationsregeln) ist zentral dokumentiert in:

- [MEMORY_POLICY.md](./MEMORY_POLICY.md)

Die Runtime-Regel bleibt unveraendert: Das LLM bekommt nur freigegebenen, runtime-kuratierten Kontext und schreibt keinen Zustand direkt.

---

## 8. REALE TECHNOLOGIEN PRO LAYER

| Layer | Option A (Lokal/Termux) | Option B (Cloud/API) |
|-------|--------------------------|----------------------|
| LLM | llama.cpp | GPT-4o-mini / Claude Haiku |
| Memory Store | SQLite + FTS5 | Supabase (Postgres) |
| Scanner 1 | regex / Trie / spaCy | kleiner Classifier |
| Context Compiler | Custom Node.js | Custom Python |
| Scanner 2 | Worker Thread | Cron Job |
| Kernel/Write-Gate | SoD-Pattern | identisch |
| Proof-Artefakte | JSONL Change Matrix | identisch |

---

## 9. POC - MINIMALER BEWEIS

POC-Ziel:

> Zeige, dass ein LLM mit runtime-kuratiertem 800-Token-Kontext aus einem 10.000-Token-Archiv konsistenter und schneller antwortet als mit vollem Rohkontext.

Minimal:
1. SQLite mit 50 Memory-Eintraegen
2. Deterministische Score-Funktion
3. Context Compiler (Hard Cap 800)
4. 5 identische Test-Prompts (mit/ohne Runtime-Kuration)
5. Messen: Latenz, Kohaerenz, Halluzinationen

---

## 10. WAS BEREITS VORHANDEN IST

| Komponente | Herkunft |
|------------|----------|
| Write-Gate Muster | SoD `patches.js` |
| Deterministischer Store | SoD `store.js` |
| Beweis-Artefakte Pattern | CHANGE_MATRIX JSONL |
| Agentenvertrag Pattern | LLM_ENTRY |
| Scoring-Idee | VGRAF `scoring.py` |
| Governance-Struktur | SHINON `.llm/` Linie |
| Contract-Pattern | Crafting Clicker DATA_CONTRACT |

---

## 11. OFFENE FRAGEN

1. Welches lokale 1B/Small-Modell ist auf Zielhardware tragfaehig?
2. Wie weit kommt Scanner 1 ohne LLM-Klassifier?
3. Welcher Decay-Faktor ist in realen Sessions stabil?
4. Wie wird der Persona-Layer sauber als Skin integriert?

---

## 12. LEITSATZ

**Die Runtime denkt, das LLM formuliert Text.**
