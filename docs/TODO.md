# TODO - Runtime-First Alignment

- Date: 2026-04-02
- Ziel: "Die Runtime denkt, das LLM formuliert Text."

## P0 (kritisch)
- [x] Default-Laufpfad auf Runtime -> Orchestrator -> Inference festgezogen (`orchestrateTurn` ruft `routeBackendCall`; `live=false` bleibt Default).
- [ ] Gate-Skripte repo-self-contained machen (keine externen Pflichtpfade).
- [x] Route-Konsistenz fuer Chat-Endpunkt finalisiert (`/api/chat` und `/chat` kompatibel).

## P1 (wichtig)
- [x] Session-Memory-Chain um Persistenzvertrag erweitert (`memory/src/session/sessionPersistence.ts`) inkl. Decay.
- [x] Inference-Live-Modus als explizites Opt-in verankert (`memoryContext.inferenceLive===true`).
- [ ] E2E in den Standard-Verify-Flow integrieren oder bewusst als optional dokumentieren.
- [ ] SQLite im Zielbetrieb per nativer Laufzeit absichern (aktuell: Adapter-Vertrag + optional `node:sqlite` Loader in `httpServer.ts`).

## P2 (qualitaet)
- [ ] CI-Workflows fuer `verify:backend` und Frontend-Build anlegen.
- [ ] Operator-Doku in `docs/` um konkrete Failure-Modes und Recovery-Playbooks erweitern.
- [ ] Standard-Repo-Meta ergaenzen (`LICENSE`, `CONTRIBUTING.md`, `SECURITY.md`).
