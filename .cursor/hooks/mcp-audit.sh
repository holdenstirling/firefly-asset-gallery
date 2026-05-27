#!/usr/bin/env bash
# beforeMCPExecution hook for Firefly Asset Gallery.
#
# The "headline 201 beat" hook. Every MCP tool call the agent makes
# routes through here first. We log a structured JSON line per call so
# the audit trail can be tailed by humans (live demo) or piped to a SIEM
# (production).
#
# This hook never blocks. It's a pure observer — the audit trail is the
# product. If you want to block specific MCP calls, add a second
# beforeMCPExecution hook entry with policy logic.
#
# Cursor exposes the server + tool + args being invoked via env vars.
# Across versions the exact names have shifted; we read the most common
# spellings and fall back to "unknown" rather than failing.

set -u

LOG_FILE="${CURSOR_MCP_AUDIT_LOG:-/tmp/cursor-mcp-audit.log}"

server="${CURSOR_HOOK_MCP_SERVER:-${CURSOR_MCP_SERVER:-unknown}}"
tool="${CURSOR_HOOK_MCP_TOOL:-${CURSOR_MCP_TOOL:-unknown}}"
args="${CURSOR_HOOK_MCP_ARGS:-${CURSOR_MCP_ARGS:-}}"

# Truncate args so a giant payload doesn't bloat the log line.
if (( ${#args} > 500 )); then
  args="${args:0:500}...<truncated>"
fi

ts=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Best-effort JSON escaping for the args field (handles quotes + backslashes
# + newlines). For richer payloads you'd want jq; this script keeps zero
# runtime dependencies on purpose.
esc_args=${args//\\/\\\\}
esc_args=${esc_args//\"/\\\"}
esc_args=${esc_args//$'\n'/\\n}
esc_args=${esc_args//$'\r'/}
esc_args=${esc_args//$'\t'/\\t}

printf '{"ts":"%s","server":"%s","tool":"%s","args":"%s"}\n' \
  "$ts" "$server" "$tool" "$esc_args" >> "$LOG_FILE"

exit 0
