# Release Process

This document defines the release checklist for ShinonLLM.

## Release Checklist

1. Confirm scope and version bump according to [VERSIONING.md](./VERSIONING.md).
2. Run runtime validation:
   - `npm run verify:backend`
   - `cd frontend && npm run build`
3. Update `CHANGELOG.md` under `[Unreleased]` and move entries to the new version section.
4. Ensure `README.md` and `docs/README.md` reflect current product status.
5. Create and push tag `vMAJOR.MINOR.PATCH`.
6. Verify GitHub Actions `CI` and `Release` workflows are green.
7. Publish GitHub Release notes and link to key docs.

## Release Notes Template

- Summary: one paragraph with user-facing outcome.
- Added: new features and runtime capabilities.
- Changed: behavior updates and non-breaking changes.
- Fixed: bug fixes and gate/reliability corrections.
- Breaking: contract or behavior changes that require migration.

## Rollback Rule

If CI gates fail after tagging, publish a corrective patch release and document root cause in `CHANGELOG.md`.
