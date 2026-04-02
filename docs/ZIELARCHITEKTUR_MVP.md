# Zielarchitektur MVP (Release 0.2.3)

Stand: 2026-04-02
Quelle: `FELIX_SYSTEM_ARCHITECTURE-1.docx` (MVP-Scope)

## 1. Zweck

Dieses Dokument uebersetzt die Architekturprinzipien aus dem Rebuild-Dokument in die aktuelle ShinonLLM-Repository-Struktur.
Es ist die operative Zielarchitektur fuer den MVP und ersetzt unklare Teil-Notizen.

## 2. Nicht verhandelbare Invarianten

1. State wird nicht implizit veraendert, sondern nur ueber explizite Runtime-Aktionen.
2. Jede Aktion hat Contract-Gates (Input, Output, erlaubte Actions).
3. Determinismus ist Invariante fuer Replay/Gates (seed- und sequence-stabil).
4. Read-Pfade sind von Write-Pfaden getrennt (UI/LLM lesen nicht den rohen Mutationspfad).
5. LLM-Integration ist Vertrag, nicht freie Prompt-Spielwiese.

## 3. MVP-Architektur-Schichten im Repo

### 3.1 Edge / API
- `backend/src/httpServer.ts`
- `backend/src/routes/chat.ts`
- `backend/src/routes/health.ts`

Verantwortung:
- API-Einstieg (`/api/chat`, `/api/health`)
- Validierung, Fehlerklassifikation, Fail-closed Responses
- Session-Memory Read/Write Kopplung im Chat-Flow

### 3.2 Runtime / Orchestrator
- `orchestrator/src/pipeline/orchestrateTurn.ts`
- `orchestrator/src/contracts/*`

Verantwortung:
- Turn-Normalisierung
- Prompt-Bundle mit Memory-Summary
- Routing in Inference-Layer
- Guardrails fuer Assistant-Payload

### 3.3 Inference / Adapter
- `inference/src/router/backendRouter.ts`
- `inference/src/adapters/ollamaAdapter.ts`
- `inference/src/adapters/llamacppAdapter.ts`

Verantwortung:
- Backend-Auswahl und Fallback
- Live-Ausfuehrung mit verpflichtendem Offline-Evaluator und Replay-Hash-Evidenz
- Live nur per Opt-in (`options.live===true`)

### 3.4 Memory / Persistence
- `memory/src/session/sessionMemory.ts`
- `memory/src/session/sessionPersistence.ts`
- `memory/src/longterm/memoryStore.ts`
- `memory/src/retrieval/*`

Verantwortung:
- Session-Retrieval und Tokenbudget
- Persistenz-Contract (In-Memory + SQLite-Adapter)
- Decay-Regeln (TTL/Retention)

### 3.5 Quality Gates
- `tests/gates/*`
- `tests/unit/*`
- `tests/integration/*`

Verantwortung:
- Contract-Gates
- Replay/Determinismus-Gates
- Baseline Integrity (Seed-Pair + Action-Set)
- Unit/Integration fuer Orchestrator, Router, Persistenz, Chat-Flow

## 4. Laufzeitfluss (MVP)

1. Client sendet User-Message an `/api/chat`.
2. Chat-Route validiert Request und laedt Session-Memory (Scope: sessionId + conversationId).
3. Orchestrator baut Prompt-Kontext und routed in `routeBackendCall`.
4. Inference liefert deterministic-offline (Default) oder Live-Backend (Opt-in).
5. Guardrails validieren Antwortpayload.
6. Chat-Route persistiert User+Assistant Turn, optional mit TTL und Decay.
7. Response wird als `ok/success` oder fail-closed `ok/error` ausgegeben.

## 5. Daten- und Vertragsgrenzen

### 5.1 Chat-Request/Response
- Request braucht nicht-leeren Message-Content.
- Response folgt strikt `ok/status/data|error`.

### 5.2 Action-Gates
- `allowedActions` muss korrekt deklariert sein.
- nicht deklarierte Actions werden blockiert.

### 5.3 Replay-Gates
- `run_id` darf nicht leer sein.
- `revision > 0`, `sequence >= 0`.
- Hash-Vergleich muss seed-stabil sein.

### 5.4 Session-Persistenz
- Minimalfelder: `sessionId`, `conversationId`, `role`, `content`.
- Optional: `ttlSeconds`, `metadata`.
- Decay entfernt abgelaufene und alte Eintraege (retention-bounded).

## 6. Konfigurationsprofil (MVP)

Inference:
- Default: Live-Ausfuehrung gegen lokales Backend
- `routeDecision.options.live=false` ist unzulaessig (Contract-Verletzung)

Memory:
- Default: In-Memory volatil
- SQLite Opt-in: `SHINON_MEMORY_SQLITE_PATH`
- TTL global optional: `SHINON_MEMORY_TTL_SECONDS`
- Decay nach Write ist verpflichtend; optionale Retention ueber `SHINON_MEMORY_KEEP_LATEST_PER_CONVERSATION`

## 7. MVP Scope vs. spaeter

### Im MVP enthalten
- Runtime-first Pfad (Backend -> Orchestrator -> Inference)
- Contract-/Replay-/Baseline-Gates
- Session-Persistenz-Contract inkl. SQLite-Adapter
- Fail-closed API-Verhalten

### Nach MVP (bewusst offen)
- Vollstaendige Core/Session/Archive-Hierarchie als produktive Policy-Engine
- Persistente Migrationspfade und DB-Schema-Versionierung
- Erweiterte E2E-Browser-Automation im Standard-Verify
- CI-Policy-Enforcement fuer alle Release-Gates

## 8. Definition of Done fuer 0.2.3 Basis

1. Architektur und Scope sind zentral dokumentiert.
2. Release-/Version-Regeln fuer `0.2.3` sind eindeutig.
3. Repo-Scan (Gap-Analyse) ist dokumentiert und priorisiert.
4. README/Docs spiegeln den realen Runtime- und Persistenzstand.



