"use client";

import { useCallback, useMemo, useState } from "react";

type ChatRole = "user" | "assistant";

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
  sessionId?: string,
  conversationId?: string
): ChatRequestPayload {
  const normalizedText = normalizeText(userText);
  const requestId = createStableId(
    [
      sessionId ?? "",
      conversationId ?? "",
      normalizedText,
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
    },
  };
}

async function sendChatRequest(
  payload: ChatRequestPayload,
  apiBasePath: string
): Promise<ChatResponsePayload> {
  const response = await fetch(apiBasePath, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

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
  value: string;
  disabled: boolean;
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
      <textarea
        aria-label="Message"
        disabled={props.disabled}
        value={props.value}
        onChange={(event) => props.onChange(event.currentTarget.value)}
        placeholder="Type a message"
        rows={4}
      />
      <button disabled={props.disabled} type="submit">
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

    const payload = buildRequestPayload(messages, normalizedText, sessionId, conversationId);

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
    setDraft("");

    try {
      const response = await sendChatRequest(payload, apiBasePath);
      const assistantMessage: ChatMessage = {
        id: response.requestId,
        role: "assistant",
        content: response.reply,
      };

      setMessages((current) => [...current, assistantMessage]);
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
  }, [apiBasePath, conversationId, draft, emit, isSending, messages, sessionId]);

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
        disabled={!canSend}
        onChange={setDraft}
        onSubmit={() => {
          void submitMessage();
        }}
        value={draft}
      />
    </section>
  );
}
