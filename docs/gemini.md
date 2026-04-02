# ShinonLLM — Gemini Context Summary

## 1. Scope & Vision
**ShinonLLM** ist ein "Runtime-first", LLM-System.
- **Vision:** Die Runtime (TypeScript) denkt und trifft Entscheidungen; das LLM (Ollama/Llama.cpp) formuliert lediglich den Text.
- **Ziel:** Deterministisches Verhalten, das über Release-Gates (Replay/Contract) verifiziert werden kann, anstatt sich auf unzuverlässige Prompts zu verlassen.

## 2. Systemstatus (Version 0.2.3)
Die Architektur ist modular aufgebaut:
- `backend/`: API-Einstieg, Request-Validierung (`/chat`, `/health`).
- `orchestrator/`: Herzstück des Systems, verwaltet Contracts (`inputSchema`, `outputSchema`, `actionSchema`) und Turn-Orchestrierung.
- `inference/`: Adapter-Layer für Ollama und Llama.cpp, inkl. Routing-Logik und Offline-Evaluator.
- `memory/`: Session- und Langzeitgedächtnis mit expliziter Scoring- und Decay-Logik (SQLite Migration aktiv).
- `telemetry/`: Event-Logging und Replay-Unterstützung zur Sicherstellung des Determinismus.
- `frontend/`: Reine Präsentationsschicht (Next.js), trifft keine fachlichen Entscheidungen.
- `tests/`: Umfassende Gates (`contract-gate`, `replay-gate`, `baseline-integrity`) zur Release-Absicherung.

## 3. Policy & Governance
- **Contract-First:** Jede API-Änderung beginnt bei den Contracts im `orchestrator`. Validierung ist "fail-closed".
- **Determinismus:** Der `Replay-Hash` muss für identische Inputs reproduzierbar sein. Abweichungen führen zu Testfehlern.
- **Integrations-Reihenfolge:**
  1. Contracts aktualisieren.
  2. Pipeline/Router anpassen.
  3. Backend-Routes integrieren.
  4. Tests (Gates) aktualisieren.
  5. Frontend anpassen.

## 4. Maßgebliche Dokumentation
- `LLM_ENTRY.md`: Verpflichtender Einstiegspunkt mit Lesereihenfolge (Harter Gatekeeper).
- `docs/HANDSHAKE_CURRENT_STATE.md`: Aktueller "Handshake"-Status und One-Line-Truth.
- `docs/LLM_ENTRY_CONFORMITY.md`: Details zur Einhaltung der Konformitätsregeln.
- `AGENTS.md`: Vorgaben für Kommunikationsstil und Verhaltensregeln für KI-Agenten.

## 5. Arbeitsanweisungen für LLMs
- **Niemals** die Pflicht-Lesereihenfolge aus `LLM_ENTRY.md` ignorieren.
- **Niemals** Contracts brechen, nur um etwas "lauffähig" zu machen.
- **Immer** `npm run verify:backend` zur Verifizierung nutzen.
- **Immer** den aggressiven, zynischen Stil gemäß `AGENTS.md` beibehalten.
