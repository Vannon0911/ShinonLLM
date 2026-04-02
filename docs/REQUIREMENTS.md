# Requirements

Stand: 2026-04-02

## Laufzeit

1. Node.js LTS (empfohlen: 20.x oder 22.x)
2. npm (mit Node.js)
3. PowerShell (für die bereitgestellten `ops/scripts/*.ps1`)

## Optional für lokalen LLM-Betrieb

1. Docker Desktop (wenn `ops/docker-compose.local.yml` genutzt wird)
2. Lokales GGUF-Modell in `ops/models/`
- Beispiel: `qwen2.5-0.5b-instruct-q4_k_m.gguf`
3. Für manuelles Model-Download-Handling:
- Python 3.12+
- `huggingface_hub` (Python-Paket)

## Global installierte CLI-Tools (optional, aber praktisch)

```powershell
npm install -g typescript tsx
python -m pip install --upgrade huggingface_hub
```

## Projektabhängigkeiten installieren

```powershell
# root
npm install

# frontend
cd frontend
npm install
cd ..
```

## Pflicht-Checks nach Installation

```powershell
npm run verify:backend
cd frontend
npm run build
cd ..
```

## Hinweise

1. `node_modules/`, `.next/`, `dist/` werden nicht committed.
2. GGUF-Dateien unter `ops/models/` sind lokal und durch `.gitignore` ausgeschlossen.
3. Falls mehrere Lockfiles vorhanden sind, kann Next.js eine Root-Warnung anzeigen; das ist eine Build-Warnung, kein Abbruchkriterium.
