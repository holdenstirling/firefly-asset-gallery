#!/usr/bin/env node
// Adobe Spectrum-style design-tokens MCP server (DEMO ONLY).
//
// Exposes two tools over stdio:
//   - list_tokens(category?)    -> the catalog (optionally filtered)
//   - get_token(id)             -> a single token's resolved value + metadata
//
// In production this would hit Adobe's internal token API or read from the
// firm's design-system git source-of-truth. The fixture below is a tiny
// approximation good enough to demo the wire path live.
//
// Live demo cue (see demo-prep/cursor-201-runbook.md section 4):
//   1. Ask the agent: "what design tokens do we have for brand color?"
//   2. Agent calls list_tokens({ category: "brand" }) then get_token({ id })
//   3. The beforeMCPExecution hook (.cursor/hooks/mcp-audit.sh) logs both
//      calls to /tmp/cursor-mcp-audit.log — that's the security beat.

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURE_PATH = resolve(__dirname, "design-tokens.fixture.json");

async function loadTokens() {
  const raw = await readFile(FIXTURE_PATH, "utf8");
  return JSON.parse(raw);
}

async function main() {
  const tokens = await loadTokens();

  const server = new McpServer(
    {
      name: "design-tokens",
      version: "0.1.0",
    },
    {
      capabilities: { tools: {} },
    },
  );

  server.registerTool(
    "list_tokens",
    {
      description:
        "List Adobe Spectrum-style design tokens. Optionally filter by " +
        "category (e.g. 'brand', 'semantic', 'typography', 'spacing').",
      inputSchema: {
        category: z
          .string()
          .optional()
          .describe(
            "Token category to filter on. Omit to return the full catalog.",
          ),
      },
    },
    async ({ category }) => {
      const filtered = category
        ? tokens.filter((t) => t.category === category)
        : tokens;

      const summary = filtered.map((t) => ({
        id: t.id,
        category: t.category,
        type: t.type,
        description: t.description,
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                count: summary.length,
                category: category ?? "(all)",
                tokens: summary,
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  server.registerTool(
    "get_token",
    {
      description:
        "Fetch a single design token by id (e.g. 'brand.red.500'). " +
        "Returns the resolved value, category, type, and any aliases.",
      inputSchema: {
        id: z
          .string()
          .describe(
            "Fully-qualified token id, dot-delimited (e.g. 'brand.red.500').",
          ),
      },
    },
    async ({ id }) => {
      const token = tokens.find((t) => t.id === id);

      if (!token) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Token '${id}' not found. Use list_tokens to see the catalog.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(token, null, 2),
          },
        ],
      };
    },
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("[design-tokens] fatal:", err);
  process.exit(1);
});
