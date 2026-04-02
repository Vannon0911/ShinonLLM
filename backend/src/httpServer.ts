import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { pathToFileURL } from "node:url";

import { createChatRoute } from "./routes/chat.js";
import { createHealthRoute } from "./routes/health.js";
import {
  createInMemorySessionMemoryPersistence,
  createSqliteSessionMemoryPersistence,
  type SessionMemoryPersistence,
  type SessionMemorySqliteAdapter,
} from "../../memory/src/session/sessionPersistence.js";

const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 3001;

type ParsedRequest = Readonly<{
  method: string;
  url: string;
  headers: Readonly<Record<string, string | undefined>>;
  body?: unknown;
}>;

function toMethod(value: string | undefined): string {
  return (value ?? "GET").trim().toUpperCase();
}

function toPath(value: string | undefined): string {
  const raw = value?.trim() ?? "/";
  try {
    const parsed = new URL(raw, "http://localhost");
    return parsed.pathname.replace(/\/+$/u, "") || "/";
  } catch {
    return raw.replace(/\/+$/u, "") || "/";
  }
}

function toHeaders(headers: IncomingMessage["headers"]): Readonly<Record<string, string | undefined>> {
  const normalized: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (Array.isArray(value)) {
      normalized[key.toLowerCase()] = value.join(", ");
      continue;
    }
    normalized[key.toLowerCase()] = value;
  }
  return normalized;
}

async function readBody(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
  }

  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (raw.length === 0) {
    return undefined;
  }

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("Invalid JSON body");
  }
}

async function toParsedRequest(request: IncomingMessage): Promise<ParsedRequest> {
  const method = toMethod(request.method);
  const url = request.url ?? "/";
  const headers = toHeaders(request.headers);
  const needsBody = method === "POST" || method === "PUT" || method === "PATCH";
  const body = needsBody ? await readBody(request) : undefined;

  return Object.freeze({
    method,
    url,
    headers,
    body,
  });
}

function writeJson(response: ServerResponse, status: number, body: unknown): void {
  response.statusCode = status;
  response.setHeader("content-type", "application/json; charset=utf-8");
  response.setHeader("cache-control", "no-store");
  response.end(JSON.stringify(body));
}

function toPositiveInteger(value: unknown): number | undefined {
  if (typeof value !== "string" || value.trim().length === 0) {
    return undefined;
  }
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return undefined;
  }
  return parsed;
}

async function createSessionMemoryPersistence(): Promise<SessionMemoryPersistence> {
  const sqlitePath = process.env.SHINON_MEMORY_SQLITE_PATH?.trim();
  if (!sqlitePath) {
    return createInMemorySessionMemoryPersistence();
  }

  try {
    const sqliteModule = await import("node:sqlite");
    const DatabaseSyncCtor = (sqliteModule as { DatabaseSync?: unknown }).DatabaseSync;
    if (typeof DatabaseSyncCtor !== "function") {
      return createInMemorySessionMemoryPersistence();
    }

    const database = new (DatabaseSyncCtor as new (filename: string) => {
      prepare: (sql: string) => {
        run: (...params: unknown[]) => { changes?: number };
        all: (...params: unknown[]) => unknown[];
      };
    })(sqlitePath);

    const adapter: SessionMemorySqliteAdapter = Object.freeze({
      run(sql: string, params: ReadonlyArray<unknown> = []) {
        const statement = database.prepare(sql);
        return statement.run(...params);
      },
      all(sql: string, params: ReadonlyArray<unknown> = []) {
        const statement = database.prepare(sql);
        const rows = statement.all(...params);
        return Array.isArray(rows) ? (rows as ReadonlyArray<Record<string, unknown>>) : [];
      },
    });

    return createSqliteSessionMemoryPersistence(adapter);
  } catch {
    return createInMemorySessionMemoryPersistence();
  }
}

async function main(): Promise<void> {
  const host = process.env.BACKEND_HOST?.trim() || DEFAULT_HOST;
  const portCandidate = Number.parseInt(process.env.BACKEND_PORT ?? `${DEFAULT_PORT}`, 10);
  const port = Number.isInteger(portCandidate) && portCandidate > 0 ? portCandidate : DEFAULT_PORT;
  const runtimeBackend =
    process.env.SHINON_RUNTIME_BACKEND?.trim() === "llamacpp" ? "llamacpp" : "ollama";
  const runtimeFallbackBackend =
    runtimeBackend === "llamacpp" ? "ollama" : "llamacpp";
  const runtimeModel = process.env.SHINON_RUNTIME_MODEL?.trim() || "qwen2.5:0.5b";

  const memoryTtlSeconds = toPositiveInteger(process.env.SHINON_MEMORY_TTL_SECONDS);
  const sessionMemoryPersistence = await createSessionMemoryPersistence();
  const chatRoute = createChatRoute({
    memoryContext: Object.freeze({
      backend: runtimeBackend,
      fallbackBackend: runtimeFallbackBackend,
      modelHint: runtimeModel,
      allowFallback: true,
    }),
    sessionMemoryPersistence,
    memoryTtlSeconds,
    memoryDecayKeepLatest: toPositiveInteger(process.env.SHINON_MEMORY_KEEP_LATEST_PER_CONVERSATION),
  });
  const healthRoute = createHealthRoute({
    backendHealth: () =>
      Object.freeze({
        ok: true,
        code: "BACKEND_OK",
        message: "runtime backend is ready",
      }),
  });

  const server = createServer(async (request, response) => {
    try {
      const parsed = await toParsedRequest(request);
      const path = toPath(parsed.url);

      if (path === "/health" || path === "/api/health") {
        const health = await healthRoute({
          method: parsed.method === "HEAD" ? "HEAD" : "GET",
          headers: parsed.headers,
          requestId: parsed.headers["x-request-id"],
        });
        writeJson(response, health.status, health.body);
        return;
      }

      if (path === "/chat" || path === "/api/chat") {
        if (parsed.method !== "POST") {
          writeJson(response, 405, {
            ok: false,
            status: "error",
            error: {
              code: "METHOD_NOT_ALLOWED",
              message: "chat route only accepts POST",
            },
          });
          return;
        }

        const chatResponse = await chatRoute.handle({
          method: parsed.method,
          url: parsed.url,
          headers: parsed.headers,
          body: parsed.body,
        });

        const status = chatResponse.ok
          ? 200
          : chatResponse.error.code === "BAD_REQUEST"
            ? 400
            : chatResponse.error.code === "ORCHESTRATION_FAILED"
              ? 502
              : 500;

        writeJson(response, status, chatResponse);
        return;
      }

      writeJson(response, 404, {
        ok: false,
        status: "error",
        error: {
          code: "NOT_FOUND",
          message: "route not found",
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown backend error";
      writeJson(response, 400, {
        ok: false,
        status: "error",
        error: {
          code: "BAD_REQUEST",
          message,
        },
      });
    }
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => {
      resolve();
    });
  });

  const address = server.address();
  const printableAddress =
    typeof address === "string"
      ? address
      : address == null
        ? `${host}:${port}`
        : `${address.address}:${address.port}`;

  console.log(`backend-runtime listening on http://${printableAddress}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
