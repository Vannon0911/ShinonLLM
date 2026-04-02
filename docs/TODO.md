# TODO - Runtime-First Alignment

- Date: 2026-04-02
- Goal: "Die Runtime denkt, das LLM formuliert Text."

## P0 (critical)
- [X] Make gate scripts fully repo-self-contained (no external required paths).
- [X] Align memory policy docs with current code-level behavior in one place only.
- [X] Finalize local artifact cleanup automation for locked `.next` folders.

## P1 (important)
- [X] Integrate E2E explicitly into the default verify flow or document it as intentionally optional.
- [X] Harden SQLite target runtime path and migration story.
- [ ] Add CI status badges to README (ready, needs `<OWNER>/<REPO>` slug replacement).

## P2 (quality)
- [ ] Decide final licensing (current `LICENSE` is a conservative "all rights reserved" placeholder).
- [X] Extend operator docs with concrete failure-mode playbooks.
- [X] Add release smoke-check script output snapshots to release notes template.
