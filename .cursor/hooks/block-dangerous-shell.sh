#!/usr/bin/env bash
# beforeShellExecution hook for Firefly Asset Gallery.
#
# Refuses to run shell commands that destructively rewrite history, blow
# away the working tree, or perform unrecoverable filesystem operations.
# Communicates to the agent via stderr + non-zero exit, so the agent can
# self-correct on the next turn.
#
# The command Cursor is about to run is passed via $CURSOR_HOOK_COMMAND.
# (If that env var is unset for any reason, this script no-ops to avoid
# blocking legitimate work.)

set -u

cmd="${CURSOR_HOOK_COMMAND:-}"

if [[ -z "$cmd" ]]; then
  exit 0
fi

# Block patterns. Add to this list as your team's threat model evolves.
blocked_patterns=(
  '^[[:space:]]*rm[[:space:]]+(-[a-zA-Z]*[rf][a-zA-Z]*[[:space:]]+)+/'   # rm -rf / or rm -rf /home/...
  'rm[[:space:]]+-rf[[:space:]]+\$HOME'                                   # rm -rf $HOME
  '^[[:space:]]*rm[[:space:]]+-rf[[:space:]]+\*'                          # rm -rf *
  'git[[:space:]]+push[[:space:]]+(--force|-f)([[:space:]]|$)'            # git push --force / -f
  'git[[:space:]]+reset[[:space:]]+--hard[[:space:]]+origin'              # git reset --hard origin/...
  'git[[:space:]]+clean[[:space:]]+-(f|x)d'                               # git clean -fd / -fxd
  '>[[:space:]]*/dev/(sda|nvme|hda)'                                      # writes to raw block devices
  ':\(\)[[:space:]]*\{[[:space:]]*:\|:&'                                  # classic fork bomb
)

for pattern in "${blocked_patterns[@]}"; do
  if [[ "$cmd" =~ $pattern ]]; then
    {
      echo "[block-dangerous-shell] BLOCKED: '$cmd'"
      echo "[block-dangerous-shell] reason: matches pattern '$pattern'"
      echo "[block-dangerous-shell] If this was intended, run it from a real terminal — Cursor hooks are guardrails, not policy enforcement for the human operator."
    } >&2
    exit 1
  fi
done

exit 0
