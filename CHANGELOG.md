# Changelog

All notable changes to this project will be documented in this file.

The format follows Keep a Changelog principles and Semantic Versioning.

## [Unreleased]

### Added

- TBD

## [0.2.1a] - 2026-04-02

### Added

- MVP target architecture documentation based on `FELIX_SYSTEM_ARCHITECTURE-1.docx`:
  - `docs/ZIELARCHITEKTUR_MVP.md`
  - `docs/MVP_SCOPE_SCAN_0.2.1a.md`
  - `docs/PRAESENTATION_0.2.1a.md`
- Session memory persistence contract test coverage (`tests/unit/session-persistence.spec.ts`) integrated into backend verification scripts.

### Changed

- Project/package versions moved to semver-compatible prerelease `0.2.1-a` for root/backend/frontend packages.
- README and docs index expanded with significantly more consumer/dev architecture content.
- Target system overview rewritten for runtime-first MVP scope alignment.
- Legacy `docs/ARCHITECTURE` file converted from placeholder code to architecture pointer text.

## [0.2.0] - 2026-04-02

### Added

- Canonical API path support for `/api/chat` and `/api/health` while keeping compatibility aliases.
- GitHub release playbook with visual assets and UI/UX release concept graphics.
- Local llama.cpp setup guide and Quick-QA script.
- Consumer-first README structure with product positioning, founder intro, and clear vision section.

### Changed

- Chat route now uses orchestrator execution by default instead of implicit echo fallback.
- Integration tests updated for orchestrator-default behavior and canonical API path usage.
- Local ops runtime scripts now validate presence of llama.cpp model files before startup.
- `.gitignore` updated to exclude local GGUF model binaries under `ops/models`.

## [0.1.0] - 2026-04-02

### Added

- Initial runtime contracts, gate checks, and architecture baseline.
