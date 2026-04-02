import { callLlamaCpp } from "../adapters/llamacppAdapter.js";
import { callOllama } from "../adapters/ollamaAdapter.js";

type PlainObject = Record<string, unknown>;

export type BackendName = "ollama" | "llamacpp";

export type BackendRouteDecision = Readonly<{
  backend: BackendName;
  fallbackBackend?: BackendName;
  allowFallback?: boolean;
  model: string;
  requestId?: string;
  sessionId?: string;
  conversationId?: string;
  baseUrl?: string;
  endpoint?: string;
  timeoutMs?: number;
  stream?: boolean;
  headers?: Readonly<Record<string, string>>;
  policyId?: string;
  options?: Readonly<Record<string, unknown>>;
}>;

export type PromptPayload = Readonly<{
  prompt?: string;
  userText?: string;
  systemPrompt?: string;
  messages?: ReadonlyArray<
    Readonly<{
      role: "system" | "user" | "assistant";
      content: string;
    }>
  >;
  requestId?: string;
  sessionId?: string;
  conversationId?: string;
  format?: string;
  options?: Readonly<Record<string, unknown>>;
}>;

export type NormalizedModelResponse = Readonly<{
  backend: BackendName;
  model: string;
  content: string;
  message: Readonly<{
    role: "assistant";
    content: string;
  }>;
  streamed: boolean;
  requestId?: string;
  sessionId?: string;
  conversationId?: string;
  raw: unknown;
}>;

export type BackendRouteErrorCode =
  | "BACKEND_ROUTE_INVALID"
  | "BACKEND_PROMPT_INVALID"
  | "BACKEND_UNSUPPORTED_BACKEND"
  | "BACKEND_FALLBACK_FAILED"
  | "BACKEND_INTERNAL_ERROR";

export type ClassifiedBackendError = Readonly<{
  ok: false;
  code: BackendRouteErrorCode;
  message: string;
  details?: Readonly<Record<string, unknown>>;
}>;

type BackendRouteInput =
  | Readonly<{
      routeDecision: BackendRouteDecision;
      promptPayload: PromptPayload;
    }>
  | Readonly<[BackendRouteDecision, PromptPayload]>;

function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isMessageArray(value: unknown): value is PromptPayload["messages"] {
  return Array.isArray(value) && value.every((entry) => {
    return (
      isPlainObject(entry) &&
      (entry.role === "system" || entry.role === "user" || entry.role === "assistant") &&
      isNonEmptyString(entry.content)
    );
  });
}

function classifyBackendError(
  code: BackendRouteErrorCode,
  message: string,
  details?: Readonly<Record<string, unknown>>,
): ClassifiedBackendError {
  return Object.freeze({
    ok: false,
    code,
    message,
    ...(details ? { details: Object.freeze({ ...details }) } : {}),
  });
}

function failClosed(
  code: BackendRouteErrorCode,
  message: string,
  details?: Readonly<Record<string, unknown>>,
): never {
  throw classifyBackendError(code, message, details);
}

function toInteger(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : fallback;
}

function normalizeBackendName(value: unknown): BackendName | null {
  if (value === "ollama" || value === "llamacpp") {
    return value;
  }
  return null;
}

function normalizeRouteDecision(candidate: unknown): BackendRouteDecision {
  if (!isPlainObject(candidate)) {
    failClosed("BACKEND_ROUTE_INVALID", "route decision must be a plain object");
  }

  const backend = normalizeBackendName(candidate.backend);
  if (backend === null) {
    failClosed("BACKEND_ROUTE_INVALID", "route decision.backend must be ollama or llamacpp", {
      backend: candidate.backend,
    });
  }

  if (!isNonEmptyString(candidate.model)) {
    failClosed("BACKEND_ROUTE_INVALID", "route decision.model must be a non-empty string");
  }

  const fallbackBackend = candidate.fallbackBackend === undefined
    ? undefined
    : normalizeBackendName(candidate.fallbackBackend);
  if (candidate.fallbackBackend !== undefined && fallbackBackend === null) {
    failClosed("BACKEND_ROUTE_INVALID", "route decision.fallbackBackend must be ollama or llamacpp", {
      fallbackBackend: candidate.fallbackBackend,
    });
  }

  if (candidate.headers !== undefined && !isPlainObject(candidate.headers)) {
    failClosed("BACKEND_ROUTE_INVALID", "route decision.headers must be a plain object when provided");
  }
  if (candidate.options !== undefined && !isPlainObject(candidate.options)) {
    failClosed("BACKEND_ROUTE_INVALID", "route decision.options must be a plain object when provided");
  }

  return Object.freeze({
    backend,
    fallbackBackend,
    allowFallback: candidate.allowFallback !== false,
    model: candidate.model.trim(),
    requestId: isNonEmptyString(candidate.requestId) ? candidate.requestId.trim() : undefined,
    sessionId: isNonEmptyString(candidate.sessionId) ? candidate.sessionId.trim() : undefined,
    conversationId: isNonEmptyString(candidate.conversationId) ? candidate.conversationId.trim() : undefined,
    baseUrl: isNonEmptyString(candidate.baseUrl) ? candidate.baseUrl.trim() : undefined,
    endpoint: isNonEmptyString(candidate.endpoint) ? candidate.endpoint.trim() : undefined,
    timeoutMs: toInteger(candidate.timeoutMs, 0) || undefined,
    stream: candidate.stream !== false,
    headers: candidate.headers !== undefined ? Object.freeze({ ...candidate.headers }) : undefined,
    policyId: isNonEmptyString(candidate.policyId) ? candidate.policyId.trim() : undefined,
    options: candidate.options !== undefined ? Object.freeze({ ...candidate.options }) : undefined,
  });
}

function normalizeMessages(messages: unknown): PromptPayload["messages"] | undefined {
  if (messages === undefined) {
    return undefined;
  }

  if (!isMessageArray(messages)) {
    failClosed("BACKEND_PROMPT_INVALID", "prompt payload.messages must be an array of chat messages");
  }

  return Object.freeze(
    messages.map((entry) =>
      Object.freeze({
        role: entry.role,
        content: entry.content.trim(),
      }),
    ),
  );
}

function normalizePromptPayload(candidate: unknown): PromptPayload {
  if (!isPlainObject(candidate)) {
    failClosed("BACKEND_PROMPT_INVALID", "prompt payload must be a plain object");
  }

  const messages = normalizeMessages(candidate.messages);
  const prompt = isNonEmptyString(candidate.prompt) ? candidate.prompt.trim() : undefined;
  const userText = isNonEmptyString(candidate.userText) ? candidate.userText.trim() : undefined;
  const systemPrompt = isNonEmptyString(candidate.systemPrompt) ? candidate.systemPrompt.trim() : undefined;

  if (!prompt && !userText && !messages) {
    failClosed("BACKEND_PROMPT_INVALID", "prompt payload requires prompt text or messages");
  }

  if (candidate.options !== undefined && !isPlainObject(candidate.options)) {
    failClosed("BACKEND_PROMPT_INVALID", "prompt payload.options must be a plain object when provided");
  }

  return Object.freeze({
    prompt,
    userText,
    systemPrompt,
    messages,
    requestId: isNonEmptyString(candidate.requestId) ? candidate.requestId.trim() : undefined,
    sessionId: isNonEmptyString(candidate.sessionId) ? candidate.sessionId.trim() : undefined,
    conversationId: isNonEmptyString(candidate.conversationId) ? candidate.conversationId.trim() : undefined,
    format: isNonEmptyString(candidate.format) ? candidate.format.trim() : undefined,
    options: candidate.options !== undefined ? Object.freeze({ ...candidate.options }) : undefined,
  });
}

function resolveInvocation(
  routeDecisionOrInput: unknown,
  promptPayload: unknown,
): Readonly<{
  routeDecision: BackendRouteDecision;
  promptPayload: PromptPayload;
}> {
  if (
    promptPayload === undefined &&
    isPlainObject(routeDecisionOrInput) &&
    "routeDecision" in routeDecisionOrInput &&
    "promptPayload" in routeDecisionOrInput
  ) {
    return Object.freeze({
      routeDecision: normalizeRouteDecision(routeDecisionOrInput.routeDecision),
      promptPayload: normalizePromptPayload(routeDecisionOrInput.promptPayload),
    });
  }

  if (Array.isArray(routeDecisionOrInput) && routeDecisionOrInput.length === 2 && promptPayload === undefined) {
    return Object.freeze({
      routeDecision: normalizeRouteDecision(routeDecisionOrInput[0]),
      promptPayload: normalizePromptPayload(routeDecisionOrInput[1]),
    });
  }

  return Object.freeze({
    routeDecision: normalizeRouteDecision(routeDecisionOrInput),
    promptPayload: normalizePromptPayload(promptPayload),
  });
}

async function routeThroughBackend(
  decision: BackendRouteDecision,
  promptPayload: PromptPayload,
): Promise<NormalizedModelResponse> {
  const promptText = promptPayload.prompt?.trim()
    || promptPayload.userText?.trim()
    || (promptPayload.messages && promptPayload.messages.length > 0
      ? promptPayload.messages.map((message) => `${message.role.toUpperCase()}: ${message.content}`).join("\n")
      : "");

  const requestId = promptPayload.requestId ?? decision.requestId;
  const sessionId = promptPayload.sessionId ?? decision.sessionId;
  const conversationId = promptPayload.conversationId ?? decision.conversationId;
  const model = decision.model.trim();
  const streamed = decision.stream !== false;
  const useLiveBackend = decision.options?.live === true;

  if (!useLiveBackend) {
    return Object.freeze({
      backend: decision.backend,
      model,
      content: promptText,
      message: Object.freeze({
        role: "assistant",
        content: promptText,
      }),
      streamed,
      ...(requestId ? { requestId } : {}),
      ...(sessionId ? { sessionId } : {}),
      ...(conversationId ? { conversationId } : {}),
      raw: Object.freeze({
        routeDecision: decision,
        promptPayload,
        mode: "deterministic-offline",
      }),
    });
  }

  if (decision.backend === "ollama") {
    const result = await callOllama(decision, promptPayload);
    return Object.freeze({
      backend: "ollama",
      model: result.model,
      content: result.content,
      message: Object.freeze({
        role: "assistant",
        content: result.content,
      }),
      streamed: result.streamed,
      ...(result.requestId ? { requestId: result.requestId } : {}),
      ...(result.sessionId ? { sessionId: result.sessionId } : {}),
      ...(result.conversationId ? { conversationId: result.conversationId } : {}),
      raw: result.raw,
    });
  }

  if (decision.backend === "llamacpp") {
    const result = await callLlamaCpp({
      routeDecision: decision as unknown as {
        endpoint: string;
      },
      promptPayload: promptPayload as unknown as {
        prompt?: string;
      },
    });
    return Object.freeze({
      backend: "llamacpp",
      model: result.model,
      content: result.reply,
      message: Object.freeze({
        role: "assistant",
        content: result.reply,
      }),
      streamed,
      ...(requestId ? { requestId } : {}),
      ...(sessionId ? { sessionId } : {}),
      ...(conversationId ? { conversationId } : {}),
      raw: Object.freeze({
        routeDecision: decision,
        promptPayload,
        adapter: result.raw,
      }),
    });
  }

  failClosed("BACKEND_UNSUPPORTED_BACKEND", "unsupported backend requested", {
    backend: decision.backend,
  });
}

export async function routeBackendCall(
  routeDecisionOrInput: unknown,
  promptPayload?: unknown,
): Promise<NormalizedModelResponse> {
  try {
    const normalized = resolveInvocation(routeDecisionOrInput, promptPayload);
    return await routeThroughBackend(normalized.routeDecision, normalized.promptPayload);
  } catch (error) {
    if (isPlainObject(error) && error.ok === false && typeof error.code === "string" && typeof error.message === "string") {
      const routeError = error as ClassifiedBackendError;
      const decision = isPlainObject(routeDecisionOrInput) && "routeDecision" in routeDecisionOrInput
        ? normalizeRouteDecision(routeDecisionOrInput.routeDecision)
        : Array.isArray(routeDecisionOrInput) && routeDecisionOrInput.length === 2
          ? normalizeRouteDecision(routeDecisionOrInput[0])
          : isPlainObject(routeDecisionOrInput)
            ? normalizeRouteDecision(routeDecisionOrInput)
            : undefined;

      if (
        decision &&
        decision.allowFallback === true &&
        decision.fallbackBackend &&
        decision.fallbackBackend !== decision.backend &&
        routeError.code !== "BACKEND_ROUTE_INVALID" &&
        routeError.code !== "BACKEND_PROMPT_INVALID"
      ) {
        try {
          const normalized = resolveInvocation(routeDecisionOrInput, promptPayload);
          const fallbackDecision = Object.freeze({
            ...normalized.routeDecision,
            backend: decision.fallbackBackend,
          }) as BackendRouteDecision;
          return await routeThroughBackend(fallbackDecision, normalized.promptPayload);
        } catch (fallbackError) {
          if (isPlainObject(fallbackError) && fallbackError.ok === false && typeof fallbackError.code === "string" && typeof fallbackError.message === "string") {
            throw fallbackError;
          }
          throw classifyBackendError(
            "BACKEND_FALLBACK_FAILED",
            "backend fallback failed",
            { primaryBackend: decision.backend, fallbackBackend: decision.fallbackBackend },
          );
        }
      }

      throw routeError;
    }

    throw classifyBackendError("BACKEND_INTERNAL_ERROR", "backend routing failed");
  }
}
