import { routeBackendCall } from "../../../inference/src/router/backendRouter.js";

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

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function failClosed(code: OrchestrateTurnErrorCode, message: string): never {
  throw { code, message } satisfies OrchestrateTurnError;
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

function resolveBackend(memoryContext: Readonly<Record<string, unknown>>): "ollama" | "llamacpp" {
  const backend = typeof memoryContext.backend === "string" ? memoryContext.backend.trim() : "";
  if (backend === "ollama" || backend === "llamacpp") {
    return backend;
  }
  return "llamacpp";
}

function resolveFallbackBackend(
  backend: "ollama" | "llamacpp",
  memoryContext: Readonly<Record<string, unknown>>,
): "ollama" | "llamacpp" {
  const fallback = typeof memoryContext.fallbackBackend === "string" ? memoryContext.fallbackBackend.trim() : "";
  if (fallback === "ollama" || fallback === "llamacpp") {
    return fallback;
  }
  return backend === "llamacpp" ? "ollama" : "llamacpp";
}

function resolveModel(memoryContext: Readonly<Record<string, unknown>>, prompt: string): string {
  const modelHint = typeof memoryContext.modelHint === "string" ? memoryContext.modelHint.trim() : "";
  if (modelHint.length > 0) {
    return modelHint;
  }
  return prompt.length > 1800 ? "orchestrator-long" : "orchestrator-default";
}

function applyGuardrails(input: OrchestrateTurnInput, output: {
  reply: string;
  model: string;
  prompt: string;
}): OrchestrateTurnOutput {
  const normalized = normalizeInput(input);

  if (!isNonEmptyString(output.model)) {
    failClosed("ORCHESTRATION_FAILED", "model output requires a model identifier");
  }
  if (!isNonEmptyString(output.prompt)) {
    failClosed("ORCHESTRATION_FAILED", "model output requires a prompt");
  }
  if (!isNonEmptyString(output.reply)) {
    failClosed("ORCHESTRATION_FAILED", "model output requires a non-empty reply");
  }

  const reply = output.reply.trim();
  if (reply.length === 0 || normalized.userText.length === 0) {
    failClosed("ORCHESTRATION_FAILED", "assistant payload is not valid");
  }

  return Object.freeze({
    reply,
    message: Object.freeze({
      role: "assistant",
      content: reply,
    }),
    source: "orchestrator",
    model: output.model.trim(),
    prompt: output.prompt,
    guardrailStatus: "validated",
  });
}

export async function orchestrateTurn(input: OrchestrateTurnInput): Promise<OrchestrateTurnOutput> {
  try {
    const normalized = normalizeInput(input);
    const promptBundle = buildPrompt(normalized);

    const backend = resolveBackend(normalized.memoryContext);
    const fallbackBackend = resolveFallbackBackend(backend, normalized.memoryContext);
    const model = resolveModel(normalized.memoryContext, promptBundle.prompt);
    const live = normalized.memoryContext.inferenceLive === true;
    const allowFallback = normalized.memoryContext.allowFallback !== false;

    const routed = await routeBackendCall(
      Object.freeze({
        backend,
        fallbackBackend,
        allowFallback,
        model,
        requestId: normalized.request?.requestId,
        sessionId: normalized.request?.sessionId,
        conversationId: normalized.request?.conversationId,
        options: Object.freeze({
          live,
        }),
      }),
      Object.freeze({
        userText: normalized.userText,
        messages: normalized.history,
        requestId: normalized.request?.requestId,
        sessionId: normalized.request?.sessionId,
        conversationId: normalized.request?.conversationId,
      }),
    );

    return applyGuardrails(normalized, {
      reply: routed.content,
      model: routed.model,
      prompt: promptBundle.prompt,
    });
  } catch (error) {
    if (isPlainObject(error) && typeof error.code === "string" && typeof error.message === "string") {
      if (
        error.code === "BAD_REQUEST" ||
        error.code === "ORCHESTRATION_FAILED" ||
        error.code === "INTERNAL_SERVER_ERROR"
      ) {
        throw error;
      }
      throw {
        code: "ORCHESTRATION_FAILED",
        message: "inference routing failed",
      } satisfies OrchestrateTurnError;
    }
    failClosed("INTERNAL_SERVER_ERROR", "orchestrateTurn failed");
  }
}
