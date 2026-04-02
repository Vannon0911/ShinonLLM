# Contributing

Thank you for contributing to ShinonLLM.

## Contribution Principles

- Preserve runtime-first architecture boundaries.
- Keep changes deterministic and contract-aware.
- Prefer small, reviewable pull requests.

## Development Steps

1. Install dependencies:
   - `npm install`
   - `cd frontend && npm install`
2. Run required checks:
   - `npm run verify:backend`
   - `cd frontend && npm run build`
3. Update documentation and `CHANGELOG.md` when behavior changes.

## Pull Request Requirements

- Clear problem statement and scope.
- Tests or gate coverage for behavior changes.
- Notes on runtime contract impact.
- Changelog entry under `[Unreleased]`.

## Source of Truth Reminder

`README.md` is presentation-focused.
Authoritative operational rules live in `LLM_ENTRY.md` and related conformity docs.
