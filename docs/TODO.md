# TODO - ShinonLLM Roadmap

- Date: 2026-04-03
- Vision: "Die Runtime denkt, das LLM formuliert Text."

## MVP Scope (Current Focus)

- [X] Local-first runtime with llama.cpp inference
- [X] Session memory with SQLite persistence support
- [X] Scoring engine (relevance + intent + recency)
- [X] Contract-first orchestration pipeline
- [X] Frontend chat UI (Next.js)
- [X] Test gates (contract, replay, baseline integrity)
- [ ] Activate session memory in frontend (pass sessionId/conversationId)
- [ ] Frequency-based pattern tracking (count concept recurrence across sessions)
- [ ] Impact/time-weighted scoring (no raw data dump)
- [ ] Drift protection mode (detect persona divergence across conversations)
- [ ] Internal model evaluation (benchmark Qwen 0.5B vs 1.5B vs 3B vs 7B)
- [ ] System prompt for stable model identity

## Product Scope (Near-term)

- [ ] Real Persona: persistent personality that learns from the user
- [ ] Context token storage on runtime (pattern analysis, not chat-log hoarding)
- [ ] Multi-session learning (cross-conversation knowledge transfer)
- [ ] Muster-Erkennung: automated pattern detection by frequency and impact

## Long-term Vision

- [ ] Developer IDE integration
- [ ] Multi-model routing based on internal benchmarks
- [ ] Federated memory (sync across devices, still local-first)

## Infrastructure

- [X] CI workflow + release workflow
- [X] GitHub issue/PR templates + Dependabot
- [ ] CI status badges in README
- [ ] Final licensing decision
