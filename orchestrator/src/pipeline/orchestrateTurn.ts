export type ChatRole = "system" | "user" | "assistant";

export type ChatHistoryEntry = Readonly<{
  role: ChatRole;
  content: string;
}>;

export type OrchestrateTurnInput = Readonly<{
  request?: Readonly<{
    sessionId?: string;
    conversationId?: string;
    requestId?: string;
  }>;
  userText: string;
  history: ReadonlyArray<ChatHistoryEntry>;
  memoryContext: Readonly<Record<string, unknown>>;
}>;

export type OrchestrateTurnOutput = Readonly<{
  reply: string;
  message: Readonly<{
    role: "assistant";
    content: string;
  }>;
  source: "orchestrator";
  model: string;
  prompt: string;
  guardrailStatus: "validated";
}>;

type OrchestrateTurnErrorCode = "BAD_REQUEST" | "ORCHESTRATION_FAILED" | "INTERNAL_SERVER_ERROR";

type OrchestrateTurnError = Readonly<{
  code: OrchestrateTurnErrorCode;
  message: string;
}>;

type PromptBundle = Readonly<{
  prompt: string;
  memorySummary: string;
}>;

type RoutedModel = Readonly<{
  model: string;
  reply: string;
  message: Readonly<{
    role: "assistant";
    content: string;
  }>;
  prompt: string;
  memorySummary: string;
}>;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function failClosed(code: OrchestrateTurnErrorCode, message: string): never {
  throw { code, message } satisfies OrchestrateTurnError;
}

function normalizeInput(input: OrchestrateTurnInput): OrchestrateTurnInput {
  if (!isPlainObject(input)) {
    failClosed("BAD_REQUEST", "orchestrateTurn input must be an object");
  }

  if (!isNonEmptyString(input.userText)) {
    failClosed("BAD_REQUEST", "orchestrateTurn requires a non-empty userText");
  }

  if (!Array.isArray(input.history)) {
    failClosed("BAD_REQUEST", "orchestrateTurn requires a history array");
  }

  for (const entry of input.history) {
    if (!isPlainObject(entry)) {
      failClosed("BAD_REQUEST", "history entries must be plain objects");
    }
    if (entry.role !== "system" && entry.role !== "user" && entry.role !== "assistant") {
      failClosed("BAD_REQUEST", "history entry role is invalid");
    }
    if (!isNonEmptyString(entry.content)) {
      failClosed("BAD_REQUEST", "history entry content must be a non-empty string");
    }
  }

  if (!isPlainObject(input.memoryContext)) {
    failClosed("BAD_REQUEST", "memoryContext must be a plain object");
  }

  return {
    request: input.request,
    userText: input.userText.trim(),
    history: Object.freeze(
      input.history.map((entry) =>
        Object.freeze({
          role: entry.role,
          content: entry.content.trim(),
        }),
      ),
    ),
    memoryContext: Object.freeze({ ...input.memoryContext }),
  };
}

function sortKeys(value: Record<string, unknown>): string[] {
  return Object.keys(value).sort((left, right) => left.localeCompare(right));
}

function stableSerialize(value: unknown, seen: WeakSet<object>): string {
  if (value === null) {
    return "null";
  }

  const type = typeof value;
  if (type === "string") {
    return JSON.stringify(value);
  }
  if (type === "number" || type === "boolean") {
    return String(value);
  }
  if (type === "bigint") {
    return JSON.stringify(value.toString());
  }
  if (type === "undefined" || type === "function" || type === "symbol") {
    return JSON.stringify(String(value));
  }

  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableSerialize(entry, seen)).join(",")}]`;
  }

  if (!isPlainObject(value)) {
    return JSON.stringify(String(value));
  }

  if (seen.has(value)) {
    failClosed("BAD_REQUEST", "memoryContext contains a circular reference");
  }

  seen.add(value);
  const parts = sortKeys(value).map((key) => `${JSON.stringify(key)}:${stableSerialize(value[key], seen)}`);
  seen.delete(value);
  return `{${parts.join(",")}}`;
}

function summarizeMemory(memoryContext: Readonly<Record<string, unknown>>): string {
  const entries = sortKeys(memoryContext).map((key) => `${key}=${stableSerialize(memoryContext[key], new WeakSet<object>())}`);
  return entries.join(" | ");
}

function buildPrompt(input: OrchestrateTurnInput): PromptBundle {
  const normalized = normalizeInput(input);
  const historyBlock = normalized.history.length
    ? normalized.history
        .map((entry) => `${entry.role.toUpperCase()}: ${entry.content}`)
        .join("\n")
    : "HISTORY: <empty>";
  const memorySummary = summarizeMemory(normalized.memoryContext);
  const prompt = [
    "SYSTEM: Produce a concise, valid assistant response.",
    `USER: ${normalized.userText}`,
    historyBlock,
    memorySummary.length > 0 ? `MEMORY: ${memorySummary}` : "MEMORY: <empty>",
  ].join("\n");

  return Object.freeze({
    prompt,
    memorySummary,
  });
}

function routeModel(input: OrchestrateTurnInput, promptBundle: PromptBundle): RoutedModel {
  const normalized = normalizeInput(input);
  const memoryHint = typeof normalized.memoryContext.modelHint === "string" ? normalized.memoryContext.modelHint.trim() : "";
  const model =
    memoryHint ||
    (promptBundle.prompt.length > 1800 ? "orchestrator-long" : "orchestrator-default");
  const replySeed = normalized.userText;
  const memorySuffix = promptBundle.memorySummary.length > 0 ? ` | memory=${promptBundle.memorySummary}` : "";
  const reply = `${replySeed}${memorySuffix}`;

  return Object.freeze({
    model,
    reply,
    message: Object.freeze({
      role: "assistant",
      content: reply,
    }),
    prompt: promptBundle.prompt,
    memorySummary: promptBundle.memorySummary,
  });
}

function applyGuardrails(input: OrchestrateTurnInput, candidate: RoutedModel): OrchestrateTurnOutput {
  const normalized = normalizeInput(input);

  if (!isPlainObject(candidate)) {
    failClosed("ORCHESTRATION_FAILED", "model output must be an object");
  }

  if (!isNonEmptyString(candidate.model)) {
    failClosed("ORCHESTRATION_FAILED", "model output requires a model identifier");
  }

  if (!isNonEmptyString(candidate.prompt)) {
    failClosed("ORCHESTRATION_FAILED", "model output requires a prompt");
  }

  if (!isNonEmptyString(candidate.reply)) {
    failClosed("ORCHESTRATION_FAILED", "model output requires a non-empty reply");
  }

  if (!isPlainObject(candidate.message)) {
    failClosed("ORCHESTRATION_FAILED", "model output requires an assistant message");
  }

  if (candidate.message.role !== "assistant") {
    failClosed("ORCHESTRATION_FAILED", "assistant message role must be assistant");
  }

  if (!isNonEmptyString(candidate.message.content)) {
    failClosed("ORCHESTRATION_FAILED", "assistant message content must be a non-empty string");
  }

  const reply = candidate.reply.trim();
  const content = candidate.message.content.trim();
  if (reply !== content) {
    failClosed("ORCHESTRATION_FAILED", "assistant reply and message content must match");
  }

  if (reply.length === 0 || normalized.userText.length === 0) {
    failClosed("ORCHESTRATION_FAILED", "assistant payload is not valid");
  }

  return Object.freeze({
    reply,
    message: Object.freeze({
      role: "assistant",
      content,
    }),
    source: "orchestrator",
    model: candidate.model.trim(),
    prompt: candidate.prompt,
    guardrailStatus: "validated",
  });
}

export async function orchestrateTurn(input: OrchestrateTurnInput): Promise<OrchestrateTurnOutput> {
  try {
    const promptBundle = buildPrompt(input);
    const routedModel = routeModel(input, promptBundle);
    return applyGuardrails(input, routedModel);
  } catch (error) {
    if (isPlainObject(error) && typeof error.code === "string" && typeof error.message === "string") {
      throw error;
    }
    failClosed("INTERNAL_SERVER_ERROR", "orchestrateTurn failed");
  }
}
