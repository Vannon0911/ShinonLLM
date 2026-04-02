# TODO - Runtime-First Alignment

- Date: 2026-04-02
- Ziel: "Die Runtime denkt, das LLM formuliert Text."

## P0 (kritisch)
- [ ] Default-Laufpfad klar auf Runtime -> Orchestrator -> Inference festziehen (kein impliziter Fallback als Standard).
- [ ] Gate-Skripte repo-self-contained machen (keine externen Pflichtpfade).
- [ ] Route-Konsistenz fuer Chat-Endpunkt finalisieren (`/api/chat` vs `/chat`).

## P1 (wichtig)
- [ ] Memory-Chain formalisieren: Core / Session / Archive inkl. Decay- und Prioritaetsregeln.
- [ ] Inference-Live-Modus als klar dokumentiertes Profil verankern.
- [ ] E2E in den Standard-Verify-Flow integrieren oder bewusst als optional dokumentieren.

## P2 (qualitaet)
- [ ] CI-Workflows fuer `verify:backend` und Frontend-Build anlegen.
- [ ] Operator-Doku in `docs/` um konkrete Failure-Modes und Recovery-Playbooks erweitern.
- [ ] Standard-Repo-Meta ergaenzen (`LICENSE`, `CONTRIBUTING.md`, `SECURITY.md`).
