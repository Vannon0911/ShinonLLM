module.exports = [
"[project]/frontend/src/components/chat/ChatShell.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatShell",
    ()=>ChatShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function createStableId(seed) {
    let hash = 2166136261;
    for(let index = 0; index < seed.length; index += 1){
        hash ^= seed.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }
    return `chat_${(hash >>> 0).toString(16).padStart(8, "0")}`;
}
function createRequestId(seed) {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return `chat_${crypto.randomUUID().replace(/-/g, "")}`;
    }
    return createStableId(`${seed}|${Date.now()}|${Math.random().toString(16).slice(2)}`);
}
function normalizeText(value) {
    return value.trim().replace(/\s+/g, " ");
}
function buildRequestPayload(messages, userText, model, sessionId, conversationId) {
    const normalizedText = normalizeText(userText);
    const requestId = createRequestId([
        sessionId ?? "",
        conversationId ?? "",
        normalizedText,
        model,
        String(messages.length)
    ].join("|"));
    return {
        message: normalizedText,
        sessionId,
        conversationId,
        requestId,
        messages: [
            ...messages.map((message)=>({
                    id: message.id,
                    role: message.role,
                    content: message.content
                })),
            {
                id: requestId,
                role: "user",
                content: normalizedText
            }
        ],
        metadata: {
            source: "ChatShell",
            messageCount: messages.length + 1,
            model
        }
    };
}
async function sendChatRequest(payload, apiBasePath, timeoutMs = 15_000) {
    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(), timeoutMs);
    let response;
    try {
        response = await fetch(apiBasePath, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(payload),
            signal: controller.signal
        });
    } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
            throw new Error(`Chat request timed out after ${timeoutMs}ms`);
        }
        throw error;
    } finally{
        clearTimeout(timeout);
    }
    const data = await response.json().catch(()=>null);
    if (!response.ok || typeof data !== "object" || data === null) {
        throw new Error("Chat request failed");
    }
    const candidate = data;
    if (candidate.ok !== true || typeof candidate.data !== "object" || candidate.data === null) {
        throw new Error(typeof candidate.error?.message === "string" && candidate.error.message.trim().length > 0 ? candidate.error.message.trim() : "Chat response was invalid");
    }
    if (typeof candidate.data.requestId !== "string" || typeof candidate.data.reply !== "string" || candidate.data.reply.trim().length === 0) {
        throw new Error("Chat response was invalid");
    }
    return {
        requestId: candidate.data.requestId,
        reply: candidate.data.reply.trim(),
        source: typeof candidate.data.source === "string" ? candidate.data.source : "unknown"
    };
}
function MessageList({ messages }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
        "aria-label": "Chat history",
        className: "chat-shell__messages",
        children: messages.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
            className: "chat-shell__empty",
            children: "No messages yet."
        }, void 0, false, {
            fileName: "[project]/frontend/src/components/chat/ChatShell.tsx",
            lineNumber: 207,
            columnNumber: 9
        }, this) : messages.map((message)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                className: `chat-shell__message chat-shell__message--${message.role}`,
                "data-role": message.role,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "chat-shell__message-role",
                        children: message.role
                    }, void 0, false, {
                        fileName: "[project]/frontend/src/components/chat/ChatShell.tsx",
                        lineNumber: 215,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "chat-shell__message-content",
                        children: message.content
                    }, void 0, false, {
                        fileName: "[project]/frontend/src/components/chat/ChatShell.tsx",
                        lineNumber: 216,
                        columnNumber: 13
                    }, this)
                ]
            }, message.id, true, {
                fileName: "[project]/frontend/src/components/chat/ChatShell.tsx",
                lineNumber: 210,
                columnNumber: 11
            }, this))
    }, void 0, false, {
        fileName: "[project]/frontend/src/components/chat/ChatShell.tsx",
        lineNumber: 205,
        columnNumber: 5
    }, this);
}
function Composer(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        className: "chat-shell__composer",
        onSubmit: (event)=>{
            event.preventDefault();
            props.onSubmit();
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "chat-shell__model",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Model"
                    }, void 0, false, {
                        fileName: "[project]/frontend/src/components/chat/ChatShell.tsx",
                        lineNumber: 242,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        "aria-label": "Model",
                        disabled: props.disableInput,
                        onChange: (event)=>props.onModelChange(event.currentTarget.value),
                        value: props.model,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "runtime-default",
                                children: "Runtime Default"
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/components/chat/ChatShell.tsx",
                                lineNumber: 249,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "llamacpp-qwen-0_5b",
                                children: "llama.cpp Qwen 0.5B (Local)"
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/components/chat/ChatShell.tsx",
                                lineNumber: 250,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "ollama-default",
                                children: "Ollama Default"
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/components/chat/ChatShell.tsx",
                                lineNumber: 251,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/components/chat/ChatShell.tsx",
                        lineNumber: 243,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/src/components/chat/ChatShell.tsx",
                lineNumber: 241,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                "aria-label": "Message",
                disabled: props.disableInput,
                value: props.value,
                onChange: (event)=>props.onChange(event.currentTarget.value),
                placeholder: "Type a message",
                rows: 4
            }, void 0, false, {
                fileName: "[project]/frontend/src/components/chat/ChatShell.tsx",
                lineNumber: 254,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                disabled: props.disableSubmit,
                type: "submit",
                children: "Send"
            }, void 0, false, {
                fileName: "[project]/frontend/src/components/chat/ChatShell.tsx",
                lineNumber: 262,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/src/components/chat/ChatShell.tsx",
        lineNumber: 234,
        columnNumber: 5
    }, this);
}
function ChatShell({ sessionId, conversationId, initialMessages = [], apiBasePath = "/api/chat", onEvent }) {
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialMessages);
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [model, setModel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("runtime-default");
    const [isSending, setIsSending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const messageIdCounterRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const nextMessageId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((prefix, requestId)=>{
        messageIdCounterRef.current += 1;
        return `${prefix}:${requestId}:${messageIdCounterRef.current}`;
    }, []);
    const canSend = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>normalizeText(draft).length > 0 && !isSending, [
        draft,
        isSending
    ]);
    const emit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event)=>{
        onEvent?.(event);
    }, [
        onEvent
    ]);
    const submitMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        const normalizedText = normalizeText(draft);
        if (normalizedText.length === 0) {
            const nextError = {
                code: "EMPTY_MESSAGE",
                message: "Message must not be empty."
            };
            setError(nextError);
            emit({
                type: "error",
                error: nextError
            });
            return;
        }
        if (isSending) {
            const nextError = {
                code: "DUPLICATE_SEND",
                message: "A chat request is already in flight."
            };
            setError(nextError);
            emit({
                type: "error",
                error: nextError
            });
            return;
        }
        const payload = buildRequestPayload(messages, normalizedText, model, sessionId, conversationId);
        setIsSending(true);
        setError(null);
        emit({
            type: "submit",
            payload
        });
        setMessages((current)=>[
                ...current,
                {
                    id: nextMessageId("user", payload.requestId),
                    role: "user",
                    content: normalizedText
                }
            ]);
        try {
            const response = await sendChatRequest(payload, apiBasePath);
            const assistantMessage = {
                id: nextMessageId("assistant", response.requestId),
                role: "assistant",
                content: response.reply
            };
            setMessages((current)=>[
                    ...current,
                    assistantMessage
                ]);
            setDraft("");
            emit({
                type: "success",
                payload: {
                    requestId: response.requestId,
                    reply: response.reply,
                    source: response.source
                }
            });
        } catch (caughtError) {
            const message = caughtError instanceof Error && caughtError.message.trim().length > 0 ? caughtError.message.trim() : "Chat request failed.";
            const nextError = {
                code: message === "Chat response was invalid" ? "INVALID_RESPONSE" : "REQUEST_FAILED",
                message
            };
            setError(nextError);
            emit({
                type: "error",
                error: nextError
            });
        } finally{
            setIsSending(false);
        }
    }, [
        apiBasePath,
        conversationId,
        draft,
        emit,
        isSending,
        messages,
        model,
        nextMessageId,
        sessionId
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "chat-shell",
        "aria-busy": isSending,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "chat-shell__header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: "Chat"
                    }, void 0, false, {
                        fileName: "[project]/frontend/src/components/chat/ChatShell.tsx",
                        lineNumber: 374,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: isSending ? "Sending..." : "Ready."
                    }, void 0, false, {
                        fileName: "[project]/frontend/src/components/chat/ChatShell.tsx",
                        lineNumber: 375,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/src/components/chat/ChatShell.tsx",
                lineNumber: 373,
                columnNumber: 7
            }, this),
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "aria-live": "polite",
                className: "chat-shell__error",
                role: "alert",
                children: error.message
            }, void 0, false, {
                fileName: "[project]/frontend/src/components/chat/ChatShell.tsx",
                lineNumber: 379,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MessageList, {
                messages: messages
            }, void 0, false, {
                fileName: "[project]/frontend/src/components/chat/ChatShell.tsx",
                lineNumber: 384,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Composer, {
                model: model,
                onModelChange: setModel,
                disableInput: false,
                disableSubmit: !canSend,
                onChange: setDraft,
                onSubmit: ()=>{
                    void submitMessage();
                },
                value: draft
            }, void 0, false, {
                fileName: "[project]/frontend/src/components/chat/ChatShell.tsx",
                lineNumber: 386,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/src/components/chat/ChatShell.tsx",
        lineNumber: 372,
        columnNumber: 5
    }, this);
}
}),
"[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime;
}),
];

//# sourceMappingURL=frontend_0mcf4s8._.js.map