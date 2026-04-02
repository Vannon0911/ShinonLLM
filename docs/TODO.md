# TODO - Runtime-First Alignment

- Date: 2026-04-02
- Goal: "Die Runtime denkt, das LLM formuliert Text."

## P0 (critical)
- [ ] Make gate scripts fully repo-self-contained (no external required paths).
- [ ] Align memory policy docs with current code-level behavior in one place only.
- [ ] Finalize local artifact cleanup automation for locked `.next` folders.

## P1 (important)
- [ ] Integrate E2E explicitly into the default verify flow or document it as intentionally optional.
- [ ] Harden SQLite target runtime path and migration story.
- [ ] Add CI status badges to README after first green runs on GitHub.

## P2 (quality)
- [ ] Add LICENSE.
- [ ] Extend operator docs with concrete failure-mode playbooks.
- [ ] Add release smoke-check script output snapshots to release notes template.
