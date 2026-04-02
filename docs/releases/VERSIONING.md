# Versioning Policy

ShinonLLM uses Semantic Versioning (`MAJOR.MINOR.PATCH`).

## SemVer Rules

- `MAJOR`: breaking runtime contract or API behavior.
- `MINOR`: backward-compatible feature additions.
- `PATCH`: backward-compatible fixes, docs corrections, or operational fixes.

## Tag Format

- Stable release tags must follow: `vMAJOR.MINOR.PATCH` (example: `v0.2.0`).
- Optional prerelease tags can follow SemVer prerelease syntax (example: `v0.3.0-rc.1`).

## Compatibility Notes

- Public API and contract behavior are validated by gates under `tests/gates`.
- Any incompatible change to contract behavior requires a MAJOR version bump.
- If behavior changes but contracts remain compatible, use MINOR or PATCH based on scope.
