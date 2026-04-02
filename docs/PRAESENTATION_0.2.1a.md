# Praesentationserweiterung 0.2.1a

Stand: 2026-04-02
Audience: Consumer zuerst, danach Dev/Technik

## 1. Executive Storyline

1. Problem: Viele lokale LLM-Setups wirken stark, sind aber im Betrieb unkontrolliert.
2. Antwort: ShinonLLM trennt Runtime-Entscheidung und Modell-Formulierung strikt.
3. Ergebnis: reproduzierbares Verhalten, kontrollierte Memory-Pfade, saubere Releases.

## 2. Consumer-Teil (Deck-Abschnitte)

### Abschnitt A: Warum Nutzer das brauchen
- Konsistente Antworten statt wechselnder Modell-Laune.
- Klarer lokaler Betriebspfad fuer Datenschutz und Kontrolle.
- Nachvollziehbare Fehlerbilder statt Blackbox-Verhalten.

### Abschnitt B: Nutzszenarien
- Quick-QA lokal mit kontrollierter Antwortkette.
- Support- und Antwortautomation mit Runtime-Regeln.
- Wissensnahe Chat-Flows mit Session-Memory und Decay.

### Abschnitt C: Was besser ist
- Keine impliziten Side-Effects als Standard.
- Deterministischer Offline-Default statt ungeplantes Live-Verhalten.
- Contract-Gates als Sicherheitszaun fuer Integritaet.

## 3. Dev-Teil (Deck-Abschnitte)

### Abschnitt D: Zielarchitektur
- API Entry -> Orchestrator -> Inference
- Session-Memory Persistenzvertrag + Decay
- Contract-/Replay-/Baseline-Gates

### Abschnitt E: Betriebsprofil
- Live-Inference ist Opt-in.
- SQLite ist Opt-in fuer Restart-Persistenz.
- Fail-closed ist Standard bei Contract-Verletzung.

### Abschnitt F: Vergleich zu typischen Loesungen
- Prompt-first Stacks: schnell, aber schwer zu reproduzieren.
- Agent-first Stacks: flexibel, aber oft komplex und diffusionsanfaellig.
- ShinonLLM: Runtime-first mit klarer Contract- und Gate-Haerte.

## 4. Visual-Map fuer bestehende Assets

- Produktnutzen: `docs/assets/consumer-value-map.svg`
- User Journeys: `docs/assets/user-journeys.svg`
- Runtime-Architektur: `docs/assets/runtime-overview.svg`
- Vergleich: `docs/assets/shinon-vs-alternatives.svg`
- Vision: `docs/assets/vision-roadmap.svg`
- Release-Ablauf: `docs/assets/release-flow.svg`

## 5. Sprecher-Notizen (kurz)

1. Erst Problem/Mehrwert erklaeren, erst dann Technik.
2. Bei Technik nur die invarianten Grenzen zeigen: Contracts, Determinismus, Memory-Pfade.
3. Fuer 0.2.1a explizit als MVP-Reifegrad kommunizieren: belastbar, aber nicht final ausgebaut.
