# HANDSHAKE CURRENT STATE

Date: 2026-04-02
Release baseline: 0.2.3

## One-line truth

The runtime thinks, the LLM formulates text.

## Current architecture state

- Runtime entry and request validation are active in `backend`.
- Contract-first orchestration is active in `orchestrator`.
- Inference routing is active in `inference` with mandatory offline evaluator evidence in live path.
- Session memory handling and decay path exist in `memory`.
- SQLite session memory migration path is active via `PRAGMA user_version` (v0 -> v1).
- Determinism and baseline gates exist in `tests/gates`.

## Determinism and verification policy

Mandatory checks:

1. `npm run test:determinism`
2. `npm run verify:backend`
3. `npm --prefix frontend run build`

Fail-closed principle:

- If contract, replay, or baseline checks fail, release handshake is blocked.

## Latest verification run

Executed on 2026-04-02:

- `npm run test:determinism` -> PASS
- `npm run verify:backend` -> PASS
- baseline output line present:
  `testline | seed_pair=replay-gate-run|rev=1|seq=7 | replay_hash_equal=1 | sequence_variant_diff=1 | action_set_declared=send_message,log_event | action_send_message=accepted | action_blocked_action=rejected`

## Documentation consolidation statement

This document is the single current-state handshake.
Older split notes and per-directory `report.md` artifacts were removed to avoid conflicting narratives.

## Scope boundaries

- Frontend is a delivery surface, not the runtime decision source.
- Runtime decisions, scoring, memory writes, and policy gates remain backend/orchestrator-owned.
- Model role remains constrained to text generation and style rendering.

## Open risks

- Some local `.next` files may remain locked by running processes during cleanup.
- External-path assumptions in legacy scripts were removed; gate checks now resolve repo-local matrix paths.

## Next checkpoint

After next deterministic verification run and CI confirmation, bump to next release target.
