#!/usr/bin/env bash
# afterFileEdit hook for Firefly Asset Gallery.
#
# Scans the file the agent just edited for credential-shaped strings.
# If anything matches, exits non-zero so the agent sees the failure and
# can self-correct (typically by removing or env-var-ing the secret).
#
# The path of the edited file is passed via $CURSOR_HOOK_FILE_PATH.
# The patterns below are conservative and well-known shapes — false
# positives are easier to fix than false negatives in this context.

set -u

file="${CURSOR_HOOK_FILE_PATH:-}"

if [[ -z "$file" || ! -f "$file" ]]; then
  exit 0
fi

# Skip binary files and large files (perf safety).
if ! grep -Iq '' "$file" 2>/dev/null; then
  exit 0
fi
size=$(wc -c < "$file" 2>/dev/null || echo 0)
if (( size > 500000 )); then
  exit 0
fi

# Skip the demo-prep folder — it's literally documentation about secrets
# and the demo intentionally includes secret-shaped placeholders.
case "$file" in
  demo-prep/*|*/demo-prep/*) exit 0 ;;
esac

# Credential-shaped patterns. Order matters: cheap regex first.
# Each entry is "label|regex".
patterns=(
  'AWS access key|AKIA[0-9A-Z]{16}'
  'Stripe-shaped secret key|sk_live_[0-9a-zA-Z]{20,}'
  'GitHub personal access token|ghp_[0-9A-Za-z]{30,}'
  'GitHub OAuth token|gho_[0-9A-Za-z]{30,}'
  'OpenAI API key|sk-[A-Za-z0-9]{30,}'
  'Google API key|AIza[0-9A-Za-z_-]{30,}'
  'Slack bot token|xox[abprs]-[0-9]+-[0-9]+-[A-Za-z0-9]+'
  'Private key block|-----BEGIN (RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----'
)

violations=""
for entry in "${patterns[@]}"; do
  label="${entry%%|*}"
  regex="${entry#*|}"
  matches=$(grep -nE "$regex" "$file" 2>/dev/null || true)
  if [[ -n "$matches" ]]; then
    violations+=$'\n'"  ${label}:"$'\n'
    while IFS= read -r line; do
      violations+="    ${line%%:*}: <redacted>"$'\n'
    done <<< "$matches"
  fi
done

if [[ -n "$violations" ]]; then
  {
    echo "[secrets-scan] BLOCKED: credential-shaped content in '$file'"
    echo "[secrets-scan] findings:${violations}"
    echo "[secrets-scan] Remove the secret or move it to an env var. If this is a false positive (e.g. test fixture), update .cursor/hooks/secrets-scan.sh to allowlist the path."
  } >&2
  exit 1
fi

exit 0
