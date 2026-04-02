# Praesentationserweiterung 0.2.3

Stand: 2026-04-02
Audience: Consumer zuerst, danach Dev/Technik

## 1. Executive Storyline

1. Problem: Lokale LLM-Setups scheitern im Betrieb an fehlenden Systemgrenzen.
2. Antwort: ShinonLLM erzwingt Runtime-Planung, Contract-Gates und Evaluator-Evidenz.
3. Ergebnis: reproduzierbares Verhalten, kontrollierte Memory-Pfade, release-faehige Betriebsqualitaet.

## 2. Consumer-Teil (Deck-Abschnitte)

### Abschnitt A: Warum Nutzer das brauchen
- Konsistente Antworten statt wechselnder Modell-Laune.
- Klarer lokaler Betriebspfad fuer Datenschutz und Kontrolle.
- Nachvollziehbare Fehlerbilder statt Blackbox-Verhalten.

### Abschnitt B: Nutzszenarien
- Quick-QA lokal mit Runtime-Planung und Replay-Evidenz.
- Support- und Antwortautomation mit strikten Contract-Pfaden.
- Wissensnahe Chat-Flows mit Session-Memory und verpflichtendem Decay.

### Abschnitt C: Was besser ist
- Kein prompt-zentriertes Gluecksspiel als Primärlogik.
- Live-Execution bleibt unter Evaluator-Kontrolle.
- Contract-Gates sichern Integritaet statt Best-Effort.

## 3. Dev-Teil (Deck-Abschnitte)

### Abschnitt D: Zielarchitektur
- API Entry -> Orchestrator (Plan) -> Inference (Live + Evaluator)
- Session-Memory Persistenzvertrag + verpflichtendes Decay
- Contract-/Replay-/Baseline-Gates als Freigabegrenze

### Abschnitt E: Betriebsprofil
- `options.live=false` ist unzulaessig.
- Offline-Evaluator + Replay-Hash ist Pflicht je Aufruf.
- Fail-closed bleibt Standard bei Contract-Verletzung.

### Abschnitt F: Vergleich zu typischen Loesungen
- Prompt-first Stacks: schnell, aber schwer reproduzierbar.
- Agent-first Stacks: flexibel, aber oft diffus.
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
2. Bei Technik nur invarianten Grenzen zeigen: Planung, Contracts, Replay, Decay.
3. Fuer 0.2.3 explizit als MVP-Reifegrad kommunizieren: belastbar, aber bewusst fokussiert.
