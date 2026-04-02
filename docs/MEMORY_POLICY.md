# Memory Policy (Canonical)

This document is the single source of truth for runtime memory policy.

## Runtime knobs

- `SHINON_MEMORY_TTL_SECONDS`: Optional positive integer. If set, appended entries get `expiresAt = createdAt + ttl`.
- `SHINON_MEMORY_KEEP_LATEST_PER_CONVERSATION`: Optional positive integer. Controls decay retention count per `(sessionId, conversationId)`; invalid values fall back to internal default.
- `SHINON_MEMORY_SQLITE_PATH`: Optional explicit SQLite file path override.
- `SHINON_MEMORY_SQLITE=1`: Explicit SQLite enable flag. If set and no explicit path is provided, runtime uses OS app-data defaults.

## SQLite enable and path behavior

SQLite is active when either of these is true:

- `SHINON_MEMORY_SQLITE=1`
- `SHINON_MEMORY_SQLITE_PATH` is non-empty

Default path when `SHINON_MEMORY_SQLITE=1` and no explicit path is provided:

- Windows: `%LOCALAPPDATA%/ShinonLLM/session-memory.sqlite`
- macOS: `~/Library/Application Support/ShinonLLM/session-memory.sqlite`
- Linux: `$XDG_DATA_HOME/ShinonLLM/session-memory.sqlite` or `~/.local/share/ShinonLLM/session-memory.sqlite`

Parent directories are created before opening the database.

## Fail-closed vs best-effort

- Contract parsing / memory input validation: fail-closed (invalid payloads throw `BAD_REQUEST`).
- SQLite schema compatibility: fail-closed (unknown newer schema version aborts initialization).
- `SHINON_MEMORY_SQLITE=1` with init or migration failure: fail-fast startup error (no silent fallback).
- SQLite path-only mode (`SHINON_MEMORY_SQLITE_PATH` without explicit flag): best-effort fallback to in-memory if SQLite runtime init fails.

## SQLite schema and migrations

- Migration mechanism: `PRAGMA user_version`.
- `user_version=0`: create v1 schema and indexes, then set `user_version=1`.
- `user_version=1`: current supported schema.
- `user_version>1`: blocked fail-closed until explicit migration support is added.

