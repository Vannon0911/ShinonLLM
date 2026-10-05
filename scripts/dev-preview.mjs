#!/usr/bin/env node
/**
 * Starts the local runtime for the managed preview:
 * - the Next.js frontend on 0.0.0.0:$PORT (the injected preview port)
 * - the Node backend on 127.0.0.1:$BACKEND_PORT (health, chat, models)
 *
 * The frontend starts first and the backend only after the frontend answers,
 * so the platform's port probe always resolves to the UI instead of the API.
 */
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const backendEntry = join(repoRoot, "backend", "src", "httpServer.ts");
const nextBin = join(repoRoot, "frontend", "node_modules", "next", "dist", "bin", "next");

// The backend stays off the injected preview port so the platform's port probe
// only ever finds the Next.js frontend.
const BACKEND_PORT = process.env.BACKEND_PORT?.trim() || "3100";
const FRONTEND_PORT = process.env.PORT?.trim() || "3000";

console.log(
  `[dev] PORT=${process.env.PORT ?? "unset"} -> frontend 0.0.0.0:${FRONTEND_PORT}, backend 127.0.0.1:${BACKEND_PORT}`,
);

const children = [];

function shutdown(code) {
  for (const child of children) {
    if (child.exitCode === null && child.signalCode === null) {
      child.kill("SIGTERM");
    }
  }
  process.exit(code);
}

function start(name, command, args, options) {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: false,
    ...options,
    env: { ...process.env, ...options.env },
  });
  child.on("exit", (code, signal) => {
    console.log(`[dev] ${name} exited (code=${code ?? "null"} signal=${signal ?? "null"})`);
    shutdown(code ?? 0);
  });
  children.push(child);
  return child;
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

start("frontend", process.execPath, [nextBin, "dev", "-H", "0.0.0.0", "-p", FRONTEND_PORT], {
  cwd: join(repoRoot, "frontend"),
  env: {
    PORT: FRONTEND_PORT,
    HOSTNAME: "0.0.0.0",
    BACKEND_ORIGIN: `http://127.0.0.1:${BACKEND_PORT}`,
    NEXT_PUBLIC_BACKEND_ORIGIN: `http://127.0.0.1:${BACKEND_PORT}`,
  },
});

async function waitForFrontend(timeoutMs = 90_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${FRONTEND_PORT}/`, {
        redirect: "manual",
      });
      if (response.status > 0) {
        console.log(`[dev] frontend ready on ${FRONTEND_PORT} (HTTP ${response.status}), starting backend`);
        return;
      }
    } catch {
      await delay(500);
    }
  }
  console.log("[dev] frontend readiness probe timed out, starting backend anyway");
}

await waitForFrontend();

start("backend", process.execPath, ["--import", "tsx", backendEntry], {
  cwd: repoRoot,
  env: {
    BACKEND_PORT,
    BACKEND_HOST: "127.0.0.1",
  },
});