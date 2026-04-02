# ShinonLLM

Release: **0.2.3** (Package: `0.2.3`)

[![Release](https://img.shields.io/badge/release-0.2.3-1f6feb.svg)](./docs/releases/RELEASE_0.2.3.md)
[![Verify](https://img.shields.io/badge/verify-backend%20%2B%20frontend-0ea5e9.svg)](./docs/TESTING_AND_BASELINE.md)

## Consumer-Teil

### Was das Produkt jetzt leistet
ShinonLLM ist eine lokale Runtime-Web-App, bei der **die Runtime entscheidet** und das Modell nur den finalen Text formuliert.
Der Fokus liegt auf kontrollierbarem Verhalten statt auf Prompt-Zufall.

![Consumer Value Map](./docs/assets/consumer-value-map.svg)

### Warum das relevant ist

1. Mehr Kontrolle
- Live-Inference ist Standardpfad, aber durch verpflichtende Offline-Evaluator-Pruefung abgesichert.
- Runtime-Planning und Evaluator-Evidenz (Replay-Hash) sind feste Bestandteile pro Turn.

2. Mehr Stabilitaet
- Contract-Gates verhindern ungeregelte Payloads.
- Replay/Baseline-Checks sichern reproduzierbares Verhalten.

3. Mehr Betriebssicherheit
- Session-Memory kann persistiert werden (SQLite Opt-in).
- Decay ist Pflichtpfad nach jedem Session-Write; TTL wirkt als zusaetzliche Verfallsgrenze.

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
- Orchestrator baut Kontexte, Guardrails und einen deterministischen Runtime-Plan.
- Inference nutzt Live-Execution mit verpflichtendem Offline-Evaluator inkl. Replay-Hash-Evidenz.
- Memory-Pfade sind explizit (load -> generate -> append -> decay).

### Zielarchitektur (MVP)

- `backend/`: API-Entry und Fehlerklassifikation
- `orchestrator/`: Contracts, Prompt, Guardrails, Routing
- `inference/`: Backend-Router + Adapter (`ollama`, `llama.cpp`)
- `memory/`: Retrieval, Session-Store, Persistenzvertrag, Decay
- `tests/`: Contract-/Replay-/Baseline-Gates + Unit/Integration

![Runtime Overview](./docs/assets/runtime-overview.svg)

### Laufzeitprofile

Inference:
- Default: Live-Execution gegen lokales Backend
- Pflicht: Offline-Evaluator + Replay-Hash pro Aufruf (auch bei Live-Response)

Persistenz:
- Default: In-Memory (volatil)
- SQLite Opt-in: `SHINON_MEMORY_SQLITE_PATH`
- TTL optional: `SHINON_MEMORY_TTL_SECONDS`
- Decay Pflicht: nach jedem Write, optional konfigurierbare Retention via `SHINON_MEMORY_KEEP_LATEST_PER_CONVERSATION`

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
npm --prefix frontend run build
npm run verify:full
```

Lokalen Frontend+Backend-Stack direkt starten:

```powershell
npm run start:local
```

Bei Port-Konflikten (`EADDRINUSE`) zuerst:

```powershell
npm run stop:local
```

## Release- und Architektur-Dokumente

- [docs/ZIELARCHITEKTUR_MVP.md](./docs/ZIELARCHITEKTUR_MVP.md)
- [docs/MVP_SCOPE_SCAN_0.2.3.md](./docs/MVP_SCOPE_SCAN_0.2.3.md)
- [docs/PRAESENTATION_0.2.3.md](./docs/PRAESENTATION_0.2.3.md)
- [docs/GITHUB_PRESENTATION_0.2.3.md](./docs/GITHUB_PRESENTATION_0.2.3.md)
- [docs/REPO_HYGIENE_0.2.3.md](./docs/REPO_HYGIENE_0.2.3.md)
- [docs/releases/RELEASE_0.2.3.md](./docs/releases/RELEASE_0.2.3.md)
- [docs/REQUIREMENTS.md](./docs/REQUIREMENTS.md)
- [docs/TESTING_AND_BASELINE.md](./docs/TESTING_AND_BASELINE.md)
- [docs/GITHUB_RELEASE_PLAYBOOK.md](./docs/GITHUB_RELEASE_PLAYBOOK.md)
- [CHANGELOG.md](./CHANGELOG.md)

## GitHub-Präsentation

- Repo-Story: Runtime-first, Contract-gated, replay-evident.
- Release-Artefakte: klare `docs/releases/*` Eintraege statt verstreuter Notizen.
- Hygiene-Basis: [docs/REPO_HYGIENE_0.2.3.md](./docs/REPO_HYGIENE_0.2.3.md)

## Source of Truth

- [LLM_ENTRY.md](./LLM_ENTRY.md)
- [docs/LLM_ENTRY_CONFORMITY.md](./docs/LLM_ENTRY_CONFORMITY.md)
- [docs/ZIELARCHITEKTUR_MVP.md](./docs/ZIELARCHITEKTUR_MVP.md)
- [docs/MVP_SCOPE_SCAN_0.2.3.md](./docs/MVP_SCOPE_SCAN_0.2.3.md)
