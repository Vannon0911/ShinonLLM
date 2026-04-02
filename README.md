# ShinonLLM

## Für Nutzer (Consumer) - zuerst

### Was ist ShinonLLM?
ShinonLLM ist dein lokaler KI-Begleiter fuer fokussierte, nachvollziehbare Antworten.
Der Kernansatz ist einfach: Das System steuert die Logik, das Sprachmodell formuliert nur den Text.

### Was bringt dir das konkret?
- Mehr Konsistenz: Antworten springen weniger, weil Regeln und Kontext sauber gesteuert werden.
- Mehr Kontrolle: Du kannst lokal arbeiten, statt alles in einen Blackbox-Cloud-Flow zu schieben.
- Mehr Verlaesslichkeit: Entscheidungen im System sind besser pruefbar und reproduzierbar.

### Fuer wen ist das gemacht?
- Creator, Solopreneure und kleine Teams, die einen lokalen KI-Workflow wollen.
- Nutzer, die keine KI wollen, die heute A und morgen B behauptet.
- Menschen, die lieber ein klares Produkt als ein Prompt-Spielzeug wollen.

### Person hinter dem Projekt
Ich bin **Felix Vannon**.
Ich baue ShinonLLM als bewusstes Gegenmodell zu unkontrollierten Chat-Setups: weniger Hype, mehr Substanz, mehr Verantwortung im Runtime-Layer.

### Ziel und Vision
**Ziel:** Eine lokale Web-App, die in Alltag und Arbeit stabil nutzbar ist, nicht nur in Demos.

**Vision:** Ein Consumer-Produkt, bei dem KI nuetzlich bleibt, weil die Plattform klar fuehrt.
Keine magische Selbsttaeuschung, kein "trust me bro" - sondern ein System, das sich verhalten kann.

---

## Fuer Entwickler (Technical)

### Projektphilosophie
**The runtime thinks, the LLM formulates text.**

Das heisst:
- Runtime entscheidet ueber Kontext, Regeln, Priorisierung und Memory-Schreiben.
- Das Modell bekommt ein kuratiertes Paket und produziert Sprachoutput.
- Fail-closed und Determinismus haben Vorrang vor "sieht cool aus".

### Architektur (kurz)
- `backend/`: HTTP-Entry und Route-Verhalten
- `orchestrator/`: Contracts, Prompt-Building, Modellrouting, Guardrails
- `inference/`: Adapter fuer `ollama` und `llama.cpp`
- `memory/`: Session/Longterm Retrieval- und Store-Logik
- `telemetry/`: Replay/Hash/Evidence fuer reproduzierbare Pruefungen
- `tests/`: Gates, Unit, Integration

### Vergleich zu typischen Loesungen

| Bereich | ShinonLLM | Typische Chat-Wrapper | Typische Agent-Stacks |
|---|---|---|---|
| Entscheidungsautoritaet | Runtime-first | oft model-first | haeufig tool-chain-first |
| Memory Writes | contract-gated | oft implizit | je nach Framework uneinheitlich |
| Reproduzierbarkeit | Replay/Gates | meist best effort | haeufig schwer nachzuvollziehen |
| Lokaler Betrieb | explizit vorgesehen | oft cloud-zentriert | gemischt |
| Produktfokus | Runtime-Produkt | UI-orientierte Huelle | Entwickler-Toolkit |

### Aktueller Produktstand (ehrlich)
- Runtime-, Contract- und Replay-Basics sind vorhanden.
- Lokaler `llama.cpp`-Pfad inkl. Quick-QA Setup ist vorbereitet.
- Memory-Persistenz ueber Restart (SQLite + Decay im produktiven Pfad) ist als naechste Kernstufe definiert.

### Schnellstart
Voraussetzung: Node.js LTS

```powershell
npm install
cd frontend; npm install; cd ..
npm run verify:backend
cd frontend; npm run build; cd ..
```

Lokaler `llama.cpp` Setup:
- [docs/LOCAL_LLAMACPP_SETUP.md](./docs/LOCAL_LLAMACPP_SETUP.md)

GitHub Release Ablauf:
- [docs/GITHUB_RELEASE_PLAYBOOK.md](./docs/GITHUB_RELEASE_PLAYBOOK.md)

### Dokumentation
- [docs/README.md](./docs/README.md)
- [docs/TARGET_SYSTEM_OVERVIEW.md](./docs/TARGET_SYSTEM_OVERVIEW.md)
- [docs/DETERMINISTISCHES_LLM_RUNTIME_KONZEPT.md](./docs/DETERMINISTISCHES_LLM_RUNTIME_KONZEPT.md)
- [docs/releases/RELEASE_PROCESS.md](./docs/releases/RELEASE_PROCESS.md)
- [CHANGELOG.md](./CHANGELOG.md)

### Source of Truth
`README.md` ist Einstieg, nicht alleinige technische Wahrheit.

Autoritative Referenzen:
- [LLM_ENTRY.md](./LLM_ENTRY.md)
- [docs/LLM_ENTRY_CONFORMITY.md](./docs/LLM_ENTRY_CONFORMITY.md)
- [docs/DETERMINISTISCHES_LLM_RUNTIME_KONZEPT.md](./docs/DETERMINISTISCHES_LLM_RUNTIME_KONZEPT.md)
