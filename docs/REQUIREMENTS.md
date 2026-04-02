# Requirements

Stand: 2026-04-02

## Laufzeit

1. Node.js LTS (empfohlen: 20.x oder 22.x)
2. npm
3. PowerShell (fuer `ops/scripts/*.ps1`)

## Optional fuer lokalen LLM-Betrieb

1. Docker Desktop (wenn `ops/docker-compose.local.yml` genutzt wird)
2. Lokales GGUF-Modell in `ops/models/`
3. Python 3.12+ + `huggingface_hub` fuer manuelle Modell-Downloads

## Projektabhaengigkeiten

```powershell
npm install
cd frontend
npm install
cd ..
```

## Pflicht-Checks

```powershell
npm run verify:backend
cd frontend
npm run build
cd ..
```

## Runtime-Profile (wichtig)

Inference:
- Default: Live-Execution gegen lokales Backend
- Pflicht: Offline-Evaluator + Replay-Hash pro Aufruf
- `routeDecision.options.live=false` ist unzulaessig (Contract-Verletzung)

Session-Memory Persistenz:
- Default: In-Memory (volatil)
- SQLite Opt-in ueber `SHINON_MEMORY_SQLITE_PATH`
- optionale TTL pro Eintrag: `SHINON_MEMORY_TTL_SECONDS`
- verpflichtendes Decay nach jedem Write
- optionale Retention pro Conversation: `SHINON_MEMORY_KEEP_LATEST_PER_CONVERSATION`

## Hinweise

1. `node_modules/`, `.next/`, `dist/` werden nicht committed.
2. GGUF-Dateien unter `ops/models/` sind lokal und durch `.gitignore` ausgeschlossen.
3. Falls mehrere Lockfiles vorhanden sind, kann Next.js eine Root-Warnung anzeigen; das ist eine Build-Warnung, kein Abbruchkriterium.
