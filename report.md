# Zielbild Report: Lokale Web-App mit LLM Runtime Memory Persistenz Decay

- Datum: 2026-04-02
- Scope: gesamtes Repository
- Zielbild: lokaler Betrieb mit Runtime-first, echter LLM-Anbindung, persistenter Memory-Schicht (Restart-safe), deterministischem Decay

## 1) Ist-Zustand (repo-basiert, nicht behauptet)

### Backend und API
- HTTP-Server ist vorhanden und stabil auf `/chat` und `/health`: `backend/src/httpServer.ts`.
- Chat-Route liefert ohne explizite Orchestrator-Dependency einen Echo-Fallback: `backend/src/routes/chat.ts`.
- Frontend defaultet auf `/api/chat`, Backend bedient `/chat` direkt, aktuell nur implizit kompatibel je nach Proxy/Rewrite: `frontend/src/components/chat/ChatShell.tsx`, `backend/src/httpServer.ts`.

### Runtime und Orchestrator
- Orchestrator-Pipeline ist strukturell vorhanden, erzeugt aktuell aber deterministische Textableitung statt echter Inference-Ausführung: `orchestrator/src/pipeline/orchestrateTurn.ts`.
- Routing-Policy/Guardrails sind gut vorbereitet, aber nicht als produktiver End-to-End-Pfad verdrahtet.

### LLM-Anbindung
- Adapter für Ollama und llama.cpp sind implementiert: `inference/src/adapters/ollamaAdapter.ts`, `inference/src/adapters/llamacppAdapter.ts`.
- Router nutzt standardmäßig Offline-/Echo-Verhalten, Live-Backend nur mit `options.live === true`: `inference/src/router/backendRouter.ts`.
- Ergebnis: LLM-Anbindung ist technisch vorhanden, aber nicht im Default-Laufpfad aktiviert.

### Memory und Persistenz
- Session-Memory und Longterm-Memory existieren als In-Memory-Store (prozesslokaler Zustand): `memory/src/session/sessionMemory.ts`, `memory/src/longterm/memoryStore.ts`.
- Keine echte DB-Implementierung für Memory-Zustand, kein persistenter Snapshot über Prozess-Restart.
- Telemetry schreibt Artefakte ins Dateisystem (`evidence`), ist aber kein Memory-Store: `telemetry/src/events/eventWriter.ts`.

### Decay
- Decay ist im Konzept dokumentiert, aber nicht in produktivem Memory-Write/Read-Zyklus implementiert: `docs/DETERMINISTISCHES_LLM_RUNTIME_KONZEPT.md`, `memory/src/*`.

### Lokaler Betrieb
- `ops/docker-compose.local.yml` startet aktuell Stub-HTTP-Server für frontend/backend, nicht die reale App-Implementierung.
- Lokale Modellcontainer sind definiert (ollama, llama.cpp), aber Runtime-Integration bleibt dadurch ungetestet im Compose-Default.

## 2) Gap gegen Zielbild

1. Kein echter Default-Pfad `Frontend -> Backend -> Orchestrator -> Inference(Live) -> Memory(Persistent)`.
2. Keine SQLite-Memory-Persistenz über Neustarts.
3. Kein deterministischer Decay-Job auf persistenten Memory-Einträgen.
4. Lokaler Stack nutzt Stubs statt realer Runtime.
5. API-Pfadkontrakt `/api/chat` vs `/chat` ist nicht explizit vereinheitlicht.

## 3) Priorisierter To-do-Plan (in Reihenfolge)

### P0 - Funktionsfähiger lokaler End-to-End Kern

1. Einheitlichen API-Kontrakt festziehen.
Aktion: Backend entweder zusätzlich auf `/api/chat` und `/api/health` exponieren oder Frontend auf `/chat` umstellen; Entscheidung dokumentieren und Tests anpassen.
Akzeptanz: Chat funktioniert lokal ohne implizite Proxy-Annahmen.

2. Produktiven Orchestrator-Flow in `createChatRoute` verdrahten.
Aktion: `createChatRoute` muss standardmäßig `orchestrateTurn` verwenden statt `defaultOrchestrateTurn` Echo.
Akzeptanz: Integrationstest validiert, dass Antwortpfad von Orchestrator kommt und nicht Fallback-Echo.

3. Inference-Router standardmäßig auf Runtime-Live-Pfad umstellen.
Aktion: Live-Backend nicht nur bei `options.live === true`, sondern über klare Runtime-Konfiguration standardmäßig aktivieren (mit Fail-Closed/Fallback-Regeln).
Akzeptanz: Lokaler Request löst echten Adapter-Call gegen ollama/llama.cpp aus.

4. Reales lokales Compose statt Stub-Server.
Aktion: `ops/docker-compose.local.yml` auf echte Startkommandos für Backend/Frontend umstellen.
Akzeptanz: Compose-Stack bedient echte Chat-Logik und echte Health-Checks.

### P1 - SQLite Persistenz und Restart-Sicherheit

5. SQLite-Schema für Memory-Layer einführen.
Aktion: Tabellen für `memory_entries`, `memory_usage`, `memory_decay_runs`, `sessions`, `conversations`, optional `events`.
Akzeptanz: DB-Migration erstellt reproduzierbar dieselbe Struktur lokal.

6. Memory-Repository-Abstraktion einziehen.
Aktion: Interface für `upsert`, `retrieve`, `recordUsage`, `listBySession`, `applyDecay`; In-Memory Implementierung bleibt für Tests, SQLite als Produktions-Implementierung.
Akzeptanz: Session-/Longterm-Store verwenden Repository statt nur `let state`.

7. Restart-Persistenz durch End-to-End Tests absichern.
Aktion: Testfall: Eintrag schreiben, Prozess neu starten, Eintrag wieder abrufen.
Akzeptanz: Persistenztest grün und in `verify:backend` integriert.

### P2 - Decay und Betriebsstabilität

8. Deterministischen Decay-Algorithmus auf DB-Einträgen implementieren.
Aktion: `score = score * factor^days_since_last_access` mit fixen Parametern und Clamp-Regeln.
Akzeptanz: Gleiche Inputs und Zeitbasis liefern reproduzierbare Scores.

9. Decay-Ausführung lokal operationalisieren.
Aktion: Script/Worker (z. B. täglicher Lauf) plus dry-run Modus; Ergebnisse in `memory_decay_runs` protokollieren.
Akzeptanz: Decay-Lauf erzeugt nachvollziehbares Audit und beeinflusst Retrieval-Ranking messbar.

10. Retrieval auf persistente Scores und Session-Scope umstellen.
Aktion: `retrieveContext` muss DB-Ranking und Session/Conversation-Filter nutzen statt nur Array-Input.
Akzeptanz: Relevante Treffer bleiben über Neustarts konsistent und priorisiert.

### P3 - Qualitäts- und Betriebsabschluss für lokales Ziel

11. Gate- und Integrationstests um reale LLM-Integration erweitern.
Aktion: Testprofile `offline` (deterministisch) und `live-local` (ollama/llama.cpp) trennen; beide in Dokumentation klar.
Akzeptanz: Tests zeigen explizit, welcher Pfad geprüft wurde.

12. Betriebsdoku für lokalen Modus finalisieren.
Aktion: Dokumentieren: Startreihenfolge, Modellbereitstellung, DB-Pfad, Restart-Verhalten, Decay-Lauf, Fehlerbilder.
Akzeptanz: Ein neuer Operator kann lokal in einem Ablauf deployen und verifizieren.

## 4) Konkrete nächste Umsetzungswelle

1. API-Kontrakt vereinheitlichen und ChatRoute auf Orchestrator-Default verdrahten.
2. SQLite-Grundschema + Repository einbauen (zuerst nur `memory_entries` + read/write).
3. Compose auf echte Services umstellen und lokalen End-to-End Lauf grün machen.

## 5) Risiken bei Nicht-Umsetzung

1. Ohne SQLite bleibt Memory volatil und Zielbild "Persistenz über Restart" verfehlt.
2. Ohne Live-Default bleibt LLM-Anbindung nur optionaler Nebenpfad.
3. Ohne Decay wächst Memory unkontrolliert und Retrieval-Qualität driftet.
