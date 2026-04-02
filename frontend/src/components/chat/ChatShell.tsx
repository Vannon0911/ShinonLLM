"use client";

import { useCallback, useMemo, useState } from "react";

type ChatRole = "user" | "assistant";
type ChatModel = "runtime-default" | "llamacpp-qwen-0_5b" | "ollama-default";

type ChatMessage = Readonly<{
  id: string;
  role: ChatRole;
  content: string;
}>;

type ChatUIErrorCode =
  | "EMPTY_MESSAGE"
  | "DUPLICATE_SEND"
  | "REQUEST_FAILED"
  | "INVALID_RESPONSE";

type ChatUIError = Readonly<{
  code: ChatUIErrorCode;
  message: string;
}>;

type ChatRequestPayload = Readonly<{
  message: string;
  sessionId?: string;
  conversationId?: string;
  requestId: string;
  messages: Array<{
    role: ChatRole;
    content: string;
    id: string;
  }>;
  metadata: Readonly<{
    source: "ChatShell";
    messageCount: number;
    model: ChatModel;
  }>;
}>;

type ChatResponsePayload = Readonly<{
  requestId: string;
  reply: string;
  source: string;
}>;

type ChatShellEvent =
  | Readonly<{
      type: "submit";
      payload: ChatRequestPayload;
    }>
  | Readonly<{
      type: "success";
      payload: ChatResponsePayload;
    }>
  | Readonly<{
      type: "error";
      error: ChatUIError;
    }>;

type ChatShellProps = Readonly<{
  sessionId?: string;
  conversationId?: string;
  initialMessages?: ReadonlyArray<ChatMessage>;
  apiBasePath?: string;
  onEvent?: (event: ChatShellEvent) => void;
}>;

function createStableId(seed: string): string {
  let hash = 2166136261;

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `chat_${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function buildRequestPayload(
  messages: ReadonlyArray<ChatMessage>,
  userText: string,
  model: ChatModel,
  sessionId?: string,
  conversationId?: string
): ChatRequestPayload {
  const normalizedText = normalizeText(userText);
  const requestId = createStableId(
    [
      sessionId ?? "",
      conversationId ?? "",
      normalizedText,
      model,
      String(messages.length),
    ].join("|")
  );

  return {
    message: normalizedText,
    sessionId,
    conversationId,
    requestId,
    messages: [
      ...messages.map((message) => ({
        id: message.id,
        role: message.role,
        content: message.content,
      })),
      {
        id: requestId,
        role: "user",
        content: normalizedText,
      },
    ],
    metadata: {
      source: "ChatShell",
      messageCount: messages.length + 1,
      model,
    },
  };
}

async function sendChatRequest(
  payload: ChatRequestPayload,
  apiBasePath: string,
  timeoutMs = 15_000
): Promise<ChatResponsePayload> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let response: Response;
  try {
    response = await fetch(apiBasePath, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Chat request timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok || typeof data !== "object" || data === null) {
    throw new Error("Chat request failed");
  }

  const candidate = data as {
    ok?: boolean;
    data?: {
      requestId?: unknown;
      reply?: unknown;
      source?: unknown;
    };
    error?: {
      message?: unknown;
    };
  };

  if (candidate.ok !== true || typeof candidate.data !== "object" || candidate.data === null) {
    throw new Error(
      typeof candidate.error?.message === "string" && candidate.error.message.trim().length > 0
        ? candidate.error.message.trim()
        : "Chat response was invalid"
    );
  }

  if (
    typeof candidate.data.requestId !== "string" ||
    typeof candidate.data.reply !== "string" ||
    candidate.data.reply.trim().length === 0
  ) {
    throw new Error("Chat response was invalid");
  }

  return {
    requestId: candidate.data.requestId,
    reply: candidate.data.reply.trim(),
    source: typeof candidate.data.source === "string" ? candidate.data.source : "unknown",
  };
}

function MessageList({ messages }: { messages: ReadonlyArray<ChatMessage> }) {
  return (
    <ul aria-label="Chat history" className="chat-shell__messages">
      {messages.length === 0 ? (
        <li className="chat-shell__empty">No messages yet.</li>
      ) : (
        messages.map((message) => (
          <li
            key={message.id}
            className={`chat-shell__message chat-shell__message--${message.role}`}
            data-role={message.role}
          >
            <span className="chat-shell__message-role">{message.role}</span>
            <span className="chat-shell__message-content">{message.content}</span>
          </li>
        ))
      )}
    </ul>
  );
}

function Composer(props: {
  model: ChatModel;
  onModelChange: (value: ChatModel) => void;
  value: string;
  disableInput: boolean;
  disableSubmit: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <form
      className="chat-shell__composer"
      onSubmit={(event) => {
        event.preventDefault();
        props.onSubmit();
      }}
    >
      <label className="chat-shell__model">
        <span>Model</span>
        <select
          aria-label="Model"
          disabled={props.disableInput}
          onChange={(event) => props.onModelChange(event.currentTarget.value as ChatModel)}
          value={props.model}
        >
          <option value="runtime-default">Runtime Default</option>
          <option value="llamacpp-qwen-0_5b">llama.cpp Qwen 0.5B (Local)</option>
          <option value="ollama-default">Ollama Default</option>
        </select>
      </label>
      <textarea
        aria-label="Message"
        disabled={props.disableInput}
        value={props.value}
        onChange={(event) => props.onChange(event.currentTarget.value)}
        placeholder="Type a message"
        rows={4}
      />
      <button disabled={props.disableSubmit} type="submit">
        Send
      </button>
    </form>
  );
}

export function ChatShell({
  sessionId,
  conversationId,
  initialMessages = [],
  apiBasePath = "/api/chat",
  onEvent,
}: ChatShellProps) {
  const [messages, setMessages] = useState<ReadonlyArray<ChatMessage>>(initialMessages);
  const [draft, setDraft] = useState("");
  const [model, setModel] = useState<ChatModel>("runtime-default");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<ChatUIError | null>(null);

  const canSend = useMemo(() => normalizeText(draft).length > 0 && !isSending, [draft, isSending]);

  const emit = useCallback(
    (event: ChatShellEvent) => {
      onEvent?.(event);
    },
    [onEvent]
  );

  const submitMessage = useCallback(async () => {
    const normalizedText = normalizeText(draft);

    if (normalizedText.length === 0) {
      const nextError: ChatUIError = {
        code: "EMPTY_MESSAGE",
        message: "Message must not be empty.",
      };
      setError(nextError);
      emit({ type: "error", error: nextError });
      return;
    }

    if (isSending) {
      const nextError: ChatUIError = {
        code: "DUPLICATE_SEND",
        message: "A chat request is already in flight.",
      };
      setError(nextError);
      emit({ type: "error", error: nextError });
      return;
    }

    const payload = buildRequestPayload(messages, normalizedText, model, sessionId, conversationId);

    setIsSending(true);
    setError(null);
    emit({ type: "submit", payload });

    setMessages((current) => [
      ...current,
      {
        id: payload.requestId,
        role: "user",
        content: normalizedText,
      },
    ]);

    try {
      const response = await sendChatRequest(payload, apiBasePath);
      const assistantMessage: ChatMessage = {
        id: response.requestId,
        role: "assistant",
        content: response.reply,
      };

      setMessages((current) => [...current, assistantMessage]);
      setDraft("");
      emit({
        type: "success",
        payload: {
          requestId: response.requestId,
          reply: response.reply,
          source: response.source,
        },
      });
    } catch (caughtError) {
      const message =
        caughtError instanceof Error && caughtError.message.trim().length > 0
          ? caughtError.message.trim()
          : "Chat request failed.";

      const nextError: ChatUIError = {
        code: message === "Chat response was invalid" ? "INVALID_RESPONSE" : "REQUEST_FAILED",
        message,
      };

      setError(nextError);
      emit({ type: "error", error: nextError });
    } finally {
      setIsSending(false);
    }
  }, [apiBasePath, conversationId, draft, emit, isSending, messages, model, sessionId]);

  return (
    <section className="chat-shell" aria-busy={isSending}>
      <header className="chat-shell__header">
        <h2>Chat</h2>
        <p>{isSending ? "Sending..." : "Ready."}</p>
      </header>

      {error ? (
        <div aria-live="polite" className="chat-shell__error" role="alert">
          {error.message}
        </div>
      ) : null}

      <MessageList messages={messages} />

      <Composer
        model={model}
        onModelChange={setModel}
        disableInput={false}
        disableSubmit={!canSend}
        onChange={setDraft}
        onSubmit={() => {
          void submitMessage();
        }}
        value={draft}
      />
    </section>
  );
}
