# Versioning Policy

ShinonLLM uses Semantic Versioning (`MAJOR.MINOR.PATCH`) for package metadata.

## SemVer Rules

- `MAJOR`: breaking runtime contract or API behavior.
- `MINOR`: backward-compatible feature additions.
- `PATCH`: backward-compatible fixes, docs corrections, or operational fixes.

## Tag Format

- Stable release tags must follow: `vMAJOR.MINOR.PATCH` (example: `v0.2.0`).
- Optional prerelease tags can follow SemVer prerelease syntax (example: `v0.3.0-rc.1`).

## Release Name Alias

- For communication/readme text, a compact alias may be used (example: `0.2.1a`).
- For npm/package metadata, the semver-compatible form is required (example: `0.2.1-a`).

## Compatibility Notes

- Public API and contract behavior are validated by gates under `tests/gates`.
- Any incompatible change to contract behavior requires a MAJOR version bump.
- If behavior changes but contracts remain compatible, use MINOR or PATCH based on scope.
