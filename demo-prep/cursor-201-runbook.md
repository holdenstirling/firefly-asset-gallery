# Cursor 201 — Adobe deep dive runbook

Companion to [README.md](./README.md) (which is the 101 runbook). Same
repo, same audience patterns, **new layer**: the four customization axes
(Rules, Commands, Skills, Hooks) plus MCP and Plugins.

## Demo state at a glance

| Resource | What's in it |
|---|---|
| `main` branch | 101 demo state: Style Studio (HOL-5), Playwright e2e (HOL-6), Brand Palette Extractor (HOL-7) all shipped, 23 Vitest tests passing |
| `cursor/cursor-201-demo-prep-d329` branch | All 201 artifacts: commands, hooks, mock MCP server, pr-summary skill, plugin manifest |
| `cursor/hol-8-prebuilt-d329` branch | Phase C dry-run output — HOL-8 (style preset import/export) implemented end-to-end as a fallback if live Build chokes |
| Linear HOL-8 | Live-build target for the 201 demo (or the fallback branch is ready to swap in) |
| `.cursor/commands/` | `/review-pr` and `/scope-ticket` slash commands |
| `.cursor/hooks.json` | `beforeShellExecution` (block destructive), `afterFileEdit` (secrets scan), `beforeMCPExecution` (audit log) |
| `.cursor/mcp.json` | `design-tokens` stdio MCP server (mock Adobe Design Tokens API) |
| `.cursor/skills/pr-summary/` | Promoted from the 101 `demo-prep/pr-summary.md` draft into a real project skill |
| `.cursor-plugin/plugin.json` | Bundles everything above — the "Adobe ships this to 5,000 engineers" beat |

## Thesis line

Read this verbatim at the open. It's the spine.

> *"101 showed you where Cursor lives. 201 shows you the four axes you bend
> it on — Rules, Commands, Skills, Hooks — and the plugin model that lets
> Adobe ship those bends across five thousand engineers."*

## Time budget (20 min target)

| Section | Time | Cumulative |
|---|---|---|
| 0 · Recap + thesis | 60s | 1:00 |
| 1 · Four-axis framing slide | 90s | 2:30 |
| 2 · Live: custom Command (`/review-pr`) | 2:30 | 5:00 |
| 3 · Live: Hooks (`afterFileEdit`, `beforeMCPExecution`, `beforeShellExecution`) | 3:30 | 8:30 |
| 4 · Live: custom MCP server (`design-tokens`) | 3:30 | 12:00 |
| 5 · Bundle into Plugin (`.cursor-plugin/plugin.json`) + scale story | 2:00 | 14:00 |
| 6 · Model routing as a discipline | 2:30 | 16:30 |
| 7 · Fan-out at Adobe scale (Best-of-N, worktrees, Cursor CLI) | 2:00 | 18:30 |
| 8 · Center-of-Excellence playbook close | 90s | 20:00 |

Then **Q&A 5 min** (use the new cards in [qa-cards.md](./qa-cards.md))
and **Field Engineering discussion 5 min** (use [fe-pov.md](./fe-pov.md)).

If you blow the budget anywhere, sections 6 and 7 are the safe cuts —
they're framework/narrative, not demos. Don't cut sections 2-5; those are
the live proof.

---

## Section 0 — Recap + thesis (~60s)

Title slide only. No new screens.

> *"Quick recap. Last time we walked through Cursor's surface area —
> IDE, Slack, dashboard, Bugbot — and the Ask-Plan-Build workflow with
> Opus and Composer. The Cloud Agent picked up HOL-6 from Slack, opened a
> PR, Bugbot caught an a11y bug, a second Cloud Agent shipped the fix.
> Two PRs, ten minutes. That was 101."*
>
> *"201 is the layer beneath that. Everything you saw runs on top of four
> primitives Cursor exposes: Rules, Commands, Skills, and Hooks. Today I
> want to show you all four — live, in this same Firefly repo — plus the
> two scaling primitives, MCP and Plugins. By the end you'll see how
> Adobe ships an internal Cursor configuration to thousands of engineers
> from one manifest file."*

**Delivery note.** If the audience is the same pilot group as 101, you
can skip the recap and just deliver the thesis line. Saves 30s.

---

## Section 1 — The four-axis framing (~90s)

One slide. Read [diagrams.md Diagram 3](./diagrams.md#diagram-3) or sketch
the table on a whiteboard:

| Axis | Loaded | Triggered | Lives in |
|---|---|---|---|
| Rules | Always or by glob | Automatic | `.cursor/rules/*.mdc` |
| Commands | On demand | `/name` | `.cursor/commands/*.md` |
| Skills | When relevant | Agent decision (description-routed) | `.cursor/skills/*/SKILL.md` |
| Hooks | On event | IDE/agent lifecycle | `.cursor/hooks.json` + scripts |

> *"Four axes. Two are familiar — Rules and Skills shipped on day one and
> we touched both in 101. Two are newer — Commands and Hooks — and they're
> where the real power-user leverage hides. The 201 thesis is: you don't
> 'use' Cursor more — you 'customize' Cursor more. Every axis is one more
> way to bend the agent to how your team actually wants to ship code."*

Add MCP and Plugins as the layer on top:

> *"Once you've picked your axes, MCP lets you extend the agent's tool
> surface — Slack, Datadog, your internal services — and Plugins bundle
> everything into one zip you can publish to your org."*

---

## Section 2 — Live Command (~2:30)

**Goal:** show `/review-pr` running against an open file, then create one
in front of the audience to anchor the syntax.

### Pre-stage

Open the repo on `cursor/cursor-201-demo-prep-d329`. Have
[.cursor/commands/review-pr.md](../.cursor/commands/review-pr.md) open in
a split, and the chat panel ready.

### Beats

1. Type `/` in chat. Show the command palette — the audience sees
   `/review-pr` and `/scope-ticket` alongside any built-ins.
2. Fire `/review-pr` against the current branch (any small diff works —
   if no diff exists, make a 2-line edit first). Let it run. Output is
   a structured review.
   > *"Saved prompts, version-controlled, team-shareable. Notice it
   > knows our conventions because the command file references
   > `firefly-conventions.mdc`. Composability."*
3. Switch to [`.cursor/commands/review-pr.md`](../.cursor/commands/review-pr.md).
   Scroll. Point at the `name`, `description`, and the prompt body.
   > *"That's all there is. A markdown file with frontmatter and a
   > prompt. Lives in `.cursor/commands/`. Project-scoped because it's
   > in the repo. User-scoped if you put it in `~/.cursor/commands/`."*
4. Make a tiny edit live — change a single line of the prompt — save,
   re-fire `/review-pr` to show the edit took effect immediately.
   > *"No deploy, no compile, no plugin reload. The agent picks up the
   > change next turn."*

**Delivery note.** Don't write a whole new command from scratch — you'll
burn the budget. Show the existing one + a small live edit.

---

## Section 3 — Live Hooks (~3:30)

**Goal:** the headline 201 beat. Three hooks fire on stage. The
`beforeMCPExecution` one is the security punchline.

### Pre-stage

Open [.cursor/hooks.json](../.cursor/hooks.json) and the three scripts:
[block-dangerous-shell.sh](../.cursor/hooks/block-dangerous-shell.sh),
[secrets-scan.sh](../.cursor/hooks/secrets-scan.sh),
[mcp-audit.sh](../.cursor/hooks/mcp-audit.sh).

Have a terminal ready showing `tail -f /tmp/cursor-mcp-audit.log` so the
audit log streams during the demo.

### Beats

1. Show `.cursor/hooks.json`. Read the three event names out loud:
   `beforeShellExecution`, `afterFileEdit`, `beforeMCPExecution`.
   > *"Three events. Three scripts. The whole governance story."*

2. **Beat A — afterFileEdit secrets scan.** In chat, ask the agent:
   *"Edit `src/lib/utils.ts` and add a line that says
   `const STRIPE_KEY = 'sk_live_XXXX_REDACTED_EXAMPLE';`"*
   The agent edits. The hook fires. Shows a blocking error. The agent
   sees the failure and self-corrects (removes the line).
   > *"The agent didn't know that line would get blocked. It tried. The
   > hook caught it. The agent corrected. No human in the loop, no
   > Stripe key in the repo. That's the contract you want."*

3. **Beat B — beforeShellExecution.** Ask the agent: *"Run
   `git push --force origin main`."* The hook blocks. The agent reports
   the block back to you.
   > *"Same shape. Adobe doesn't allow force-pushes to main. The agent
   > tried. The hook blocked. No PR forensics needed."*

4. **Beat C — the security punchline. beforeMCPExecution.** Switch the
   terminal showing `tail -f /tmp/cursor-mcp-audit.log` into focus. Ask
   the agent: *"Use the design-tokens MCP to fetch the brand red token."*
   The agent fires the MCP call. The hook logs it. The audience watches
   the audit log update in real time.
   > *"Every external tool call this agent makes goes through a hook
   > first. Every one is logged. That's a JSON line per call you can pipe
   > to your SIEM. Adobe legal asks 'what data went where' — you have
   > the answer."*

5. Quickly switch to [`.cursor/hooks/mcp-audit.sh`](../.cursor/hooks/mcp-audit.sh).
   Show the script. It's 10 lines.
   > *"Ten lines of bash. That's it. The interception model is the
   > leverage; the implementation is yours."*

### Failure modes to watch

- The agent might just refuse to add the Stripe key because it's
  obviously a key. If so, narrate: *"the agent's own training would
  often catch this — but the hook is the floor, not the ceiling.
  Suppose this was a token format we don't have a public training
  signal on — internal credential format, say. Then the hook is the
  only line of defense."*
- If `tail -f` isn't showing updates, switch to `cat
  /tmp/cursor-mcp-audit.log | tail -20` to show retrospective entries.

---

## Section 4 — Live MCP (~3:30)

**Goal:** wire a custom MCP server live, show the agent using it.

### Pre-stage

Have [.cursor/mcp.json](../.cursor/mcp.json) open. The
[design-tokens.js](../.cursor/mcp-servers/design-tokens.js) server has
already been registered — verify it shows up in Cursor's MCP settings panel
(Settings → MCP → enabled servers).

### Beats

1. Open `.cursor/mcp.json`. Show the four lines:
   ```json
   {
     "mcpServers": {
       "design-tokens": {
         "command": "node",
         "args": [".cursor/mcp-servers/design-tokens.js"]
       }
     }
   }
   ```
   > *"This is a stdio MCP server. The agent spawns the node process,
   > talks JSON-RPC over stdin/stdout, gets back tool definitions and
   > tool results. Same protocol as Linear, Slack, Datadog, all of them."*

2. Open [design-tokens.js](../.cursor/mcp-servers/design-tokens.js).
   Scroll to where the tools are declared (`list_tokens`, `get_token`).
   Read them.
   > *"Two tools — list and get. The data is a JSON fixture next to
   > the server. In production this is your Adobe Spectrum API, your
   > internal docs search, your incident system."*

3. In chat: *"What design tokens do we have available for brand color?"*
   The agent fires `list_tokens`, then `get_token` for relevant ones.
   The audit hook from Section 3 logs both calls.
   > *"The agent didn't know about Spectrum until 30 seconds ago. Now
   > it does. Every call is audited. This is how Cursor becomes
   > Adobe-aware without us shipping a custom model."*

4. Switch to Cursor's MCP settings panel:
   > *"Toggleable. Project-scoped. Admin can lock at the org level. And
   > because it's in our manifest, when we publish this as a plugin,
   > every engineer on Adobe's Creative Cloud team gets the same
   > Spectrum tools by default."*

### Failure modes to watch

- If the MCP server fails to start, the agent will report "tool
  unavailable." Run `node .cursor/mcp-servers/design-tokens.js` in a
  terminal manually to verify it boots, then have Cursor reload MCP
  servers (Settings → MCP → Refresh).
- If the agent doesn't use the tool spontaneously, give it a stronger
  hint: *"Use the design-tokens MCP server. Call `list_tokens` first."*

---

## Section 5 — Plugin bundle (~2:00)

**Goal:** show that everything you just demoed lives in one manifest, and
explain how Adobe distributes it.

### Beats

1. Open [.cursor-plugin/plugin.json](../.cursor-plugin/plugin.json).
   Read the top-level fields aloud: `name`, `version`, `rules`,
   `commands`, `skills`, `hooks`, `mcpServers`.
   > *"One manifest. Five primitive types referenced — Rules, Commands,
   > Skills, Hooks, MCP servers. That's the entire 201 framework in one
   > JSON file."*

2. Pull up the Cursor Marketplace (cursor.com/marketplace) and the
   community directory (cursor.directory) on a tab. Don't dwell.
   > *"Official plugins go through Cursor's review. Community plugins
   > live in cursor.directory. Adobe wouldn't use either — Adobe would
   > stand up an internal registry and admin-allowlist it. Five
   > thousand engineers install your plugin, they all get the same
   > rules, the same commands, the same hooks, the same MCP servers."*

3. Tie it back to the four-axis model:
   > *"Plugins don't add a new axis. They're a *distribution layer* on
   > top of the four axes. That's why the model is durable — if Adobe
   > adopts Cursor and decides in six months to switch how they
   > distribute, the underlying artifacts don't change."*

---

## Section 6 — Model routing as a discipline (~2:30)

No live demo. Framework slide + narration.

> *"You'll switch models more than you think. Cursor's model picker
> isn't a preference — it's a routing decision per turn."*

Cover four models in 20 seconds each:

- **Composer-1** — Cursor's own, optimized for tool-using throughput
  inside the IDE. Use for Build mode, long agentic runs, anything
  speed-bound.
- **Opus** — wide-surface planning, architectural reasoning. Use for
  Plan mode on complex features.
- **GPT-5.5** — precise prose, spec writing, long-form refactoring
  conversations.
- **Sonnet** — middle of the road, often what Cloud Agents default to
  when you don't specify.

Talk about context windows briefly:

> *"Every model has a window. Cursor's harness handles tiering — Rules
> in Always mode get pinned, Skills only load when relevant, older
> turns get compacted. The dial is yours: more in 'Always' = guaranteed
> signal but less headroom. Most teams over-pin in their first month."*

**Max mode** callout (~10 sec):

> *"For models with reasoning toggles, Cursor exposes a 'max' mode that
> lets the model take more thinking tokens before responding. Worth the
> latency on Plan-mode tasks; usually not worth it on Build."*

The closing line of section 6:

> *"Model neutrality is Cursor's deepest architectural commitment — and
> the biggest gap against Claude Code. Plan with Opus, Build with
> Composer, write specs with GPT, review with Sonnet. Same agent, your
> choice."*

---

## Section 7 — Fan-out at Adobe scale (~2:00)

No live demo. Three patterns, 30s each.

### 7a. Best-of-N

> *"Fire N Cloud Agents in parallel on the same task, each in an
> isolated git worktree on its own branch. You pick the winner — or you
> write an eval hook that scores each candidate (tests pass? lint clean?
> diff size?) and surfaces the top one. For Adobe's a11y bar, the eval
> hook could run axe-core on each candidate."*

### 7b. Git worktrees for local parallelism

> *"`/worktree` in Cursor spins up an isolated worktree so you can run
> two or three local agent sessions in parallel without them stepping on
> each other. Same pattern as Best-of-N but local."*

### 7c. Cursor CLI in CI

> *"`cursor agent` runs the same harness from a terminal. Adobe's CI
> can invoke it for nightly refactors, dependency updates, codemod
> rollouts — anything you'd normally batch. Cursor CLI is what closes
> the loop between human-driven IDE work and machine-driven CI."*

---

## Section 8 — Center-of-Excellence close (~90s)

Final slide. Title: **"How Adobe rolls this out."**

Three bullets, 25 seconds each:

1. **Plugin authorship as a centralized skill.** One small team
   (3-5 engineers) owns the internal plugin marketplace, curates rules
   and skills, runs office hours. Same pattern that worked for design
   systems teams.
2. **Hooks as governance, not advice.** Hooks are the only axis the
   agent cannot ignore. Adobe security should own at least the
   `beforeShellExecution`, `beforeReadFile`, and `beforeMCPExecution`
   hook policy at the org level.
3. **Eval hooks as the next bet.** As soon as Adobe can score AI work
   automatically (tests, lint, axe-core, security scans), Best-of-N
   becomes lossless. That's when the productivity curve compounds.

Closing line:

> *"101 was where Cursor lives. 201 is how you bend it. Stage three —
> 301, if we're back — is the eval-driven future where the agent ships
> ten candidates, an eval scores them, and you merge the winner before
> your coffee finishes brewing. Adobe is positioned for that today
> because you're picking the platform that exposes the primitives."*

---

## Q&A (5 min)

See [qa-cards.md](./qa-cards.md) — the 201 cards are appended at the
bottom under "201-level cards." Cover at least the hook-security and
context-window cards; both are high-probability questions.

## Field Engineering discussion (5 min)

See [fe-pov.md](./fe-pov.md). Three frames; let the customer drive after
the first one if possible.

---

## Live-demo creation beats (Layer 2)

These are the "if there's time, do this live" optional inserts. None of
them are load-bearing for the 20-min flow.

### Optional A — Create a hook live (~45 sec)

Between sections 3 and 4 if you have time:

1. Open `.cursor/hooks.json`.
2. Add a fourth entry under `beforeShellExecution`:
   ```json
   { "command": ".cursor/hooks/block-npm-install.sh", "matcher": "npm install" }
   ```
3. Create the script:
   ```bash
   #!/usr/bin/env bash
   echo "blocked: route npm installs through Adobe's internal registry"
   exit 1
   ```
4. Ask the agent to run `npm install foo`. Watch it block.

### Optional B — Show plugin install flow (~30 sec)

After section 5 if you have time:

1. Open Cursor Settings → Plugins.
2. Show the marketplace tab.
3. Click "Install from URL" and paste a fake internal-registry URL to
   show the dialog.
4. Don't actually install; just narrate.
   > *"This is the install path. For Adobe you'd point it at your own
   > registry — same dialog, your URL."*

---

## Friday morning pre-flight (15 min)

In order:

1. **Branch check.** `git checkout cursor/cursor-201-demo-prep-d329` and
   verify `.cursor/commands/`, `.cursor/hooks/`, `.cursor/mcp-servers/`,
   `.cursor/skills/pr-summary/`, and `.cursor-plugin/plugin.json` all
   exist.
2. **MCP boot.** Run `node .cursor/mcp-servers/design-tokens.js` in a
   throwaway terminal to confirm it doesn't crash. Ctrl-C and let Cursor
   manage it.
3. **Hook smoke test.** Ask the agent in chat: *"Run `git push --force
   origin main`"*. Confirm `block-dangerous-shell.sh` fires and blocks.
4. **Command smoke test.** Type `/` and confirm both `/review-pr` and
   `/scope-ticket` appear.
5. **Audit log clean.** `> /tmp/cursor-mcp-audit.log` (truncate) so the
   live demo starts with an empty audit trail you can fill on stage.
6. **Drill the quiz.** [cursor-201-quiz.md](./cursor-201-quiz.md), 15
   minutes, all four tiers.
7. **Read the FE POV.** [fe-pov.md](./fe-pov.md), one pass.
8. **Open the demo browser tabs in order:**
   1. The 201 runbook (this file) — your safety net
   2. Cursor Settings → MCP (so you can flip to it during Section 4)
   3. Cursor Settings → Plugins (so you can flip to it during Section 5)
   4. cursor.com/marketplace (for the close of Section 5)
   5. cursor.directory (alternate for Section 5)

If any of 1-5 fail, fix before the meeting starts. If 6-8 fail, the
meeting still works.

---

## What's different from 101

For Friday-morning self-reminder:

| 101 emphasis | 201 emphasis |
|---|---|
| Where Cursor lives (4 surfaces) | How Cursor bends (4 axes) |
| Ask → Plan → Build workflow | The primitives under the workflow |
| Rules and Skills introduced | Commands and Hooks introduced; Rules/Skills revisited at depth |
| Cloud Agents + Bugbot loop | Plugins as the org-distribution layer |
| One feature shipped (HOL-7) | One feature shipped *through the new plugin* (HOL-8) |
| Security as a slide | Security as a live hook intercepting MCP calls |
| "Cursor isn't an editor, it's a surface area" | "Cursor isn't an agent, it's a configurable platform" |

If you have to compress in the moment, lead with **Hooks intercepting
MCP** and **Plugins as distribution**. Those two are the 201 payload
the 101 audience didn't get.
