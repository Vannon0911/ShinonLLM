# ShinonLLM

Release: **0.2.1a** (Package-Semantik: `0.2.1-a`)

## Consumer-Teil

### Was das Produkt jetzt leistet
ShinonLLM ist eine lokale Runtime-Web-App, bei der **die Runtime entscheidet** und das Modell nur den finalen Text formuliert.
Der Fokus liegt auf kontrollierbarem Verhalten statt auf Prompt-Zufall.

![Consumer Value Map](./docs/assets/consumer-value-map.svg)

### Warum das relevant ist

1. Mehr Kontrolle
- Default ist deterministic-offline statt ungeplantem Live-Modus.
- Live-Inference ist ein expliziter Opt-in.

2. Mehr Stabilitaet
- Contract-Gates verhindern ungeregelte Payloads.
- Replay/Baseline-Checks sichern reproduzierbares Verhalten.

3. Mehr Betriebssicherheit
- Session-Memory kann persistiert werden (SQLite Opt-in).
- Decay/TTL vermeidet ungebremstes Memory-Wachstum.

### Nutzbeispiele

![Nutzbeispiele](./docs/assets/user-journeys.svg)

1. Lokale Quick-QA mit kontrolliertem Antwortpfad.
2. Wissensnahe Chat-Flows mit Session-Kontinuitaet.
3. Verlaessliche Antwort-Workflows mit eindeutigen Fehlercodes.

## Dev-Teil

### Runtime-Prinzip
**The runtime thinks, the LLM formulates text.**

Technisch bedeutet das:
- API-Entry validiert und klassifiziert Requests.
- Orchestrator baut Kontexte und Guardrails.
- Inference arbeitet mit Fail-closed Default (`live=false`).
- Memory-Pfade sind explizit (load -> generate -> append -> optional decay).

### Zielarchitektur (MVP)

- `backend/`: API-Entry und Fehlerklassifikation
- `orchestrator/`: Contracts, Prompt, Guardrails, Routing
- `inference/`: Backend-Router + Adapter (`ollama`, `llama.cpp`)
- `memory/`: Retrieval, Session-Store, Persistenzvertrag, Decay
- `tests/`: Contract-/Replay-/Baseline-Gates + Unit/Integration

![Runtime Overview](./docs/assets/runtime-overview.svg)

### Laufzeitprofile

Inference:
- Default: deterministic offline
- Opt-in live: `memoryContext.inferenceLive=true`

Persistenz:
- Default: In-Memory (volatil)
- SQLite Opt-in: `SHINON_MEMORY_SQLITE_PATH`
- TTL optional: `SHINON_MEMORY_TTL_SECONDS`
- Decay optional: `SHINON_MEMORY_DECAY_AFTER_WRITE=1`

### Vergleich

![ShinonLLM vs Alternatives](./docs/assets/shinon-vs-alternatives.svg)

- Runtime-first statt model-first
- Gate-first statt best-effort
- Reproduzierbarkeit statt ad-hoc Verhalten

### Person, Ziel, Vision
Projekt von **Felix Vannon**.

Kurzfristiges Ziel:
- lokaler, belastbarer MVP fuer Runtime-first LLM-Betrieb

Mittelfristige Vision:
- consumer-taugliche lokale AI-Plattform mit festen Vertragsgrenzen, nicht mit Prompt-Glueck

![Vision Roadmap](./docs/assets/vision-roadmap.svg)

## Quickstart

```powershell
npm install
cd frontend
npm install
cd ..
npm run verify:backend
cd frontend
npm run build
cd ..
```

## Release- und Architektur-Dokumente

- [docs/ZIELARCHITEKTUR_MVP.md](./docs/ZIELARCHITEKTUR_MVP.md)
- [docs/MVP_SCOPE_SCAN_0.2.1a.md](./docs/MVP_SCOPE_SCAN_0.2.1a.md)
- [docs/PRAESENTATION_0.2.1a.md](./docs/PRAESENTATION_0.2.1a.md)
- [docs/REQUIREMENTS.md](./docs/REQUIREMENTS.md)
- [docs/TESTING_AND_BASELINE.md](./docs/TESTING_AND_BASELINE.md)
- [docs/GITHUB_RELEASE_PLAYBOOK.md](./docs/GITHUB_RELEASE_PLAYBOOK.md)
- [CHANGELOG.md](./CHANGELOG.md)

## Source of Truth

- [LLM_ENTRY.md](./LLM_ENTRY.md)
- [docs/LLM_ENTRY_CONFORMITY.md](./docs/LLM_ENTRY_CONFORMITY.md)
- [docs/ZIELARCHITEKTUR_MVP.md](./docs/ZIELARCHITEKTUR_MVP.md)
- [docs/MVP_SCOPE_SCAN_0.2.1a.md](./docs/MVP_SCOPE_SCAN_0.2.1a.md)
