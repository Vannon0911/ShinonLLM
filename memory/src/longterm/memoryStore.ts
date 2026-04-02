import { sha256Hex } from "../../../shared/src/utils/hash.js";
import { stableJson } from "../../../shared/src/utils/stableJson.js";
import { scoreContext, type ScoreContextCandidate } from "../retrieval/scoreContext.js";

export type LongTermMemoryEntry = {
  id?: string;
  type?: string;
  content?: unknown;
  tags?: readonly string[];
  updatedAt?: string;
  createdAt?: string;
  timestamp?: string;
};

export type LongTermMemoryRetrievalInput = {
  query: string;
  entries: readonly LongTermMemoryEntry[];
  maxResults?: number;
  maxTokens?: number;
};

export type LongTermMemoryRetrievedEntry = {
  id?: string;
  type?: string;
  content: string;
  tags?: readonly string[];
  score: number;
};

export type LongTermMemoryRetrievalOutput = {
  query: string;
  entries: ReadonlyArray<LongTermMemoryRetrievedEntry>;
  tokenBudget: number;
  usedTokens: number;
  truncated: boolean;
};

export type LongTermMemoryStoreInput = {
  entries?: readonly LongTermMemoryEntry[];
  seedEntries?: readonly LongTermMemoryEntry[];
};

export type LongTermMemoryStoreSnapshot = {
  entries: ReadonlyArray<LongTermMemoryEntry & { integrityHash: string }>;
};

export type LongTermMemoryStore = {
  snapshot: () => LongTermMemoryStoreSnapshot;
  upsert: (entry: LongTermMemoryEntry) => LongTermMemoryStoreSnapshot;
  ingest: (entries: readonly LongTermMemoryEntry[]) => LongTermMemoryStoreSnapshot;
  retrieve: (input: LongTermMemoryRetrievalInput) => LongTermMemoryRetrievalOutput;
};

type LongTermMemoryStoreState = {
  entries: Array<LongTermMemoryEntry & { integrityHash: string }>;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isRetrievalInput(value: unknown): value is LongTermMemoryRetrievalInput {
  return isPlainObject(value) && isNonEmptyString(value.query) && Array.isArray(value.entries);
}

function tokenize(value: string): string[] {
  return value.toLowerCase().match(/[a-z0-9]+/gu) ?? [];
}

function estimateTokens(value: string): number {
  const tokens = tokenize(value);
  return Math.max(1, Math.ceil(tokens.length * 1.25));
}

function toText(value: unknown): string {
  if (isNonEmptyString(value)) {
    return value.trim();
  }

  if (value === null || value === undefined) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.map(toText).filter(Boolean).join("\n");
  }

  if (isPlainObject(value)) {
    if (isNonEmptyString(value.content)) {
      return value.content.trim();
    }
    if (isNonEmptyString(value.text)) {
      return value.text.trim();
    }
    if (isNonEmptyString(value.message)) {
      return value.message.trim();
    }
  }

  return String(value);
}

function normalizeEntry(entry: LongTermMemoryEntry, index: number): LongTermMemoryEntry & { integrityHash: string } {
  const content = entry.content ?? "";
  const integrityHash = sha256Hex({
    id: isNonEmptyString(entry.id) ? entry.id.trim() : "",
    type: isNonEmptyString(entry.type) ? entry.type.trim() : "",
    content: stableJson(content),
    tags: Array.isArray(entry.tags) ? [...entry.tags] : [],
    updatedAt: isNonEmptyString(entry.updatedAt) ? entry.updatedAt.trim() : "",
    createdAt: isNonEmptyString(entry.createdAt) ? entry.createdAt.trim() : "",
    timestamp: isNonEmptyString(entry.timestamp) ? entry.timestamp.trim() : "",
    index,
  });

  return {
    ...(isNonEmptyString(entry.id) ? { id: entry.id.trim() } : {}),
    ...(isNonEmptyString(entry.type) ? { type: entry.type.trim() } : {}),
    content,
    ...(Array.isArray(entry.tags) ? { tags: entry.tags.filter(isNonEmptyString) } : {}),
    ...(isNonEmptyString(entry.updatedAt) ? { updatedAt: entry.updatedAt.trim() } : {}),
    ...(isNonEmptyString(entry.createdAt) ? { createdAt: entry.createdAt.trim() } : {}),
    ...(isNonEmptyString(entry.timestamp) ? { timestamp: entry.timestamp.trim() } : {}),
    integrityHash,
  };
}

function cloneSnapshot(state: LongTermMemoryStoreState): LongTermMemoryStoreSnapshot {
  return {
    entries: state.entries.map((entry) => ({ ...entry, tags: entry.tags ? [...entry.tags] : undefined })),
  };
}

function collectCandidates(entries: readonly LongTermMemoryEntry[]): ScoreContextCandidate[] {
  return entries.map((entry) => ({
    id: entry.id,
    type: entry.type,
    content: entry.content,
    tags: entry.tags,
    updatedAt: entry.updatedAt,
    createdAt: entry.createdAt,
    timestamp: entry.timestamp,
  }));
}

function retrieveFromEntries(
  entries: readonly LongTermMemoryEntry[],
  input: Omit<LongTermMemoryRetrievalInput, "entries">
): LongTermMemoryRetrievalOutput {
  if (!isNonEmptyString(input.query)) {
    throw {
      code: "BAD_REQUEST",
      message: "createLongTermMemoryStore requires a non-empty query for retrieval",
    };
  }

  const tokenBudget = Number.isFinite(input.maxTokens) && input.maxTokens && input.maxTokens > 0
    ? Math.floor(input.maxTokens)
    : 800;
  const maxResults = Number.isFinite(input.maxResults) && input.maxResults && input.maxResults > 0
    ? Math.floor(input.maxResults)
    : 12;

  const ranked = scoreContext({
    userText: input.query,
    candidates: collectCandidates(entries),
    maxResults,
  });

  const selected: LongTermMemoryRetrievedEntry[] = [];
  let usedTokens = 0;

  for (const item of ranked) {
    const content = toText(item.candidate.content);
    if (!content) {
      continue;
    }

    const chunkTokens = estimateTokens(content);
    if (usedTokens + chunkTokens > tokenBudget) {
      break;
    }

    selected.push({
      id: item.candidate.id,
      type: item.candidate.type,
      content,
      tags: item.candidate.tags,
      score: item.score,
    });
    usedTokens += chunkTokens;
  }

  return {
    query: input.query.trim(),
    entries: selected,
    tokenBudget,
    usedTokens,
    truncated: selected.length < ranked.length,
  };
}

function initializeState(input: LongTermMemoryStoreInput = {}): LongTermMemoryStoreState {
  const source = input.entries ?? input.seedEntries ?? [];
  return {
    entries: source.map((entry, index) => normalizeEntry(entry, index)),
  };
}

function upsertIntoState(state: LongTermMemoryStoreState, entry: LongTermMemoryEntry): LongTermMemoryStoreState {
  const nextEntry = normalizeEntry(entry, state.entries.length);
  const nextEntries = state.entries.filter((item) => {
    if (isNonEmptyString(nextEntry.id) && isNonEmptyString(item.id)) {
      return item.id !== nextEntry.id;
    }

    return item.integrityHash !== nextEntry.integrityHash;
  });

  return {
    entries: [...nextEntries, nextEntry],
  };
}

export function createLongTermMemoryStore(
  input: LongTermMemoryStoreInput | LongTermMemoryRetrievalInput = {}
): LongTermMemoryStore | LongTermMemoryRetrievalOutput {
  if (isRetrievalInput(input)) {
    return retrieveFromEntries(input.entries, {
      query: input.query,
      maxResults: input.maxResults,
      maxTokens: input.maxTokens,
    });
  }

  let state = initializeState(input as LongTermMemoryStoreInput);

  return {
    snapshot: () => cloneSnapshot(state),
    upsert: (entry: LongTermMemoryEntry) => {
      state = upsertIntoState(state, entry);
      return cloneSnapshot(state);
    },
    ingest: (entries: readonly LongTermMemoryEntry[]) => {
      for (const entry of entries) {
        state = upsertIntoState(state, entry);
      }
      return cloneSnapshot(state);
    },
    retrieve: (retrievalInput: LongTermMemoryRetrievalInput) =>
      retrieveFromEntries(state.entries, {
        query: retrievalInput.query,
        maxResults: retrievalInput.maxResults,
        maxTokens: retrievalInput.maxTokens,
      }),
  };
}
