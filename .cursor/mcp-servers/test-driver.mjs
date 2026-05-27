// One-shot test driver for the design-tokens MCP server.
// Run from the repo root:
//
//   node .cursor/mcp-servers/test-driver.mjs
//
// Exercises initialize -> tools/list -> two tools/call requests and prints
// each request + response. Useful for verifying the server boots cleanly
// during demo dry-runs. NOT loaded by Cursor — just a developer utility.

import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SERVER = resolve(__dirname, "design-tokens.js");

const proc = spawn("node", [SERVER], {
  stdio: ["pipe", "pipe", "inherit"],
});

const rl = createInterface({ input: proc.stdout });
let nextId = 1;
const pending = new Map();

rl.on("line", (line) => {
  if (!line.trim()) return;
  let msg;
  try {
    msg = JSON.parse(line);
  } catch {
    console.error("[driver] not JSON:", line);
    return;
  }
  if (msg.id != null && pending.has(msg.id)) {
    const { label, resolve: ack } = pending.get(msg.id);
    pending.delete(msg.id);
    console.log(`<-- ${label}:`);
    console.log(JSON.stringify(msg, null, 2));
    ack(msg);
  } else {
    console.log("<-- (notification):", JSON.stringify(msg));
  }
});

function send(method, params, label) {
  return new Promise((ack) => {
    const id = nextId++;
    pending.set(id, { label, resolve: ack });
    const req = { jsonrpc: "2.0", id, method, params };
    console.log(`\n--> ${label}:`);
    console.log(JSON.stringify(req, null, 2));
    proc.stdin.write(JSON.stringify(req) + "\n");
  });
}

function notify(method, params) {
  const msg = { jsonrpc: "2.0", method, params };
  console.log(`\n--> notify ${method}:`, JSON.stringify(msg));
  proc.stdin.write(JSON.stringify(msg) + "\n");
}

(async () => {
  await send(
    "initialize",
    {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "test-driver", version: "0.0.1" },
    },
    "initialize",
  );

  notify("notifications/initialized", {});

  await send("tools/list", {}, "tools/list");

  await send(
    "tools/call",
    { name: "list_tokens", arguments: { category: "brand" } },
    "tools/call list_tokens(brand)",
  );

  await send(
    "tools/call",
    { name: "get_token", arguments: { id: "brand.red.500" } },
    "tools/call get_token(brand.red.500)",
  );

  setTimeout(() => {
    proc.kill();
    process.exit(0);
  }, 200);
})();
