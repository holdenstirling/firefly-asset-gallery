# Q&A cards — 10 prepared answers for Adobe

Scannable reference for the Q&A block at the end of the demo. Each card is structured for fast reading:

- **Question** — verbatim, the way they'll most likely say it
- **30-sec answer** — your spoken response. Read once now, don't memorize verbatim — internalize the shape
- **If they push** — one backup line if they probe deeper
- **Source** — where the fact comes from, in case you need to recall on stage

Print this page or open it on your second monitor. Glance, don't read aloud.

---

## Card 1 — "Why Cursor over Claude Code specifically?"

**Highest probability question. Have this nailed.**

**30-sec answer:**

> *"Same model access — Cursor and Claude Code both let you reach Anthropic's models. The difference is the shape of the work. Claude Code is one surface — the terminal. Cursor is four: IDE, Slack, the web dashboard, and inside GitHub PRs via Bugbot. The two-track workflow you just saw — local engineer riding shotgun with the agent while a Cloud Agent runs in parallel from Slack — isn't possible with a terminal-only tool. That's the differentiator that scales."*

**If they push ("but the model is what matters"):**

> *"Model neutrality, actually, is the second one. Cursor isn't locked to any single lab. Today you saw Opus for planning and Composer for execution. Tomorrow you might want GPT-5.5 for spec writing or Gemini for review. Same agent, your choice — and your admin sets the allowlist."*

**Source:** Cursor enterprise page, your original notes ("Model Neutrality — flexibility not being locked into a specific lab").

---

## Card 2 — "What's your data retention / training policy?"

**Adobe will ask this. It's the gatekeeper question for any AI tool in a legal review.**

**30-sec answer:**

> *"Zero data retention with all model providers. SOC 2 Type 2 certified. Privacy Mode is on by default for enterprise — no customer code is ever used for training, by Cursor or any LLM provider. We maintain ZDR agreements with every model lab we ship. And it's auditable in the admin panel."*

**If they push ("what about prompts and context Cursor sends?"):**

> *"Same answer. Prompts, file contents, and context Cursor relays to model providers are subject to ZDR. They flow through, they don't get stored or trained on. Full details are at trust.cursor.com — they publish their SOC 2 report and pen-test summaries there."*

**Source:** Cursor enterprise page, [trust.cursor.com](https://trust.cursor.com/).

---

## Card 3 — "How does Cursor handle a 20M-line monorepo?"

**Adobe's Creative Cloud codebases are massive. They WILL ask this.**

**30-sec answer:**

> *"Codebase indexing is built for that. Cursor handles codebases with millions of lines across hundreds of thousands of files. Indexing is incremental — it doesn't re-scan from zero on every commit. And agents pull context through semantic search, so they're not reading the full tree, they're reading the relevant slice. NVIDIA, Stripe, and Coinbase all run on monorepos at that scale."*

**If they push ("what about indexing speed on first connection?"):**

> *"First-time indexing of a large monorepo takes some time — that's table stakes for any code intelligence tool. After that, it's incremental and fast. Stripe's CTO has talked publicly about Cursor adoption from hundreds to thousands of engineers on a monorepo that size — so the answer is yes, it scales."*

**Source:** Cursor enterprise page (NVIDIA, Stripe, Coinbase quotes), [cursor.com/blog/stripe](https://cursor.com/blog) if needed.

---

## Card 4 — "Can we restrict which models our developers use?"

**Adobe will want to lock down to specific model providers, especially for sensitive repos.**

**30-sec answer:**

> *"Yes. Admin controls let you whitelist or blocklist models, MCP servers, and agent rules globally or by team. You could pin one team to Opus only, another to Composer for cost reasons, and block a third from using external MCP entirely. That's all from one admin panel. SSO via SAML, user provisioning via SCIM, role-based permissions."*

**If they push ("can we point to our own internal model endpoint?"):**

> *"For air-gapped or custom-endpoint deployments, that's a Cursor Enterprise conversation — the architecture supports custom model endpoints in some configurations but it's not the default. I'd loop in our enterprise team during the trial to scope your specific architecture."*

**Source:** Cursor enterprise page ("Centralized security controls. Configure model access, MCPs, and agent rules.").

---

## Card 5 — "Do you support on-premises or VPC deployment?"

**The honest-answer question. Don't oversell.**

**30-sec answer:**

> *"Cursor currently operates on SOC 2 Type 2 compliant AWS infrastructure — that's the standard deployment. We don't offer on-premises today. The cloud architecture delivers enterprise-grade controls, data isolation, and ZDR with every model provider. If air-gapped is a hard requirement for some Adobe repos, that's a conversation our enterprise team can scope during the trial — but I'd want to set the expectation up front."*

**If they push ("our security org will block cloud-only"):**

> *"Worth a direct conversation between your security org and our enterprise team. The 64% of Fortune 500 number on the enterprise page includes plenty of regulated companies in financial services and healthcare — there's likely a precedent that maps to Adobe's threat model."*

**Source:** Cursor enterprise FAQ ("Does Cursor support on-premises or VPC deployment? Cursor currently operates on SOC 2 Type II compliant AWS infrastructure. While we don't offer on-premises deployment today...").

---

## Card 6 — "What's the realistic productivity lift?"

**Watch for the skeptic in the room. They've seen these numbers from every AI vendor.**

**30-sec answer:**

> *"Real customer numbers, not marketing claims. Upwork reported 25%+ PR volume increase and 100%+ PR size — combined, about 50% more code shipped. Amplitude shipped 3x more production code. Coinbase had every engineer refactoring legacy codebases in days instead of months. Those are PR-level and project-level metrics — not vanity numbers like 'lines of code.'"*

**If they push ("what's a number Adobe would actually see?"):**

> *"Honestly the more telling metric isn't volume — it's the projects that get started because the activation energy dropped. Refactors you'd deprioritized. Test coverage for that one service nobody owns. That doesn't show up in any dashboard, but it's the biggest swing. I'd recommend tracking PR cycle time and time-to-first-PR for new hires as the trial KPIs — those are clean and comparable."*

**Source:** Cursor enterprise page (Upwork, Amplitude, Coinbase customer stories); your original notes ("Hard to put value onto a project that may or may not have ever gotten done").

---

## Card 7 — "How is this different from GitHub Copilot Workspace?"

**Cousins, not competitors — but the answer matters.**

**30-sec answer:**

> *"Copilot Workspace is GitHub-native — tied to the GitHub UI for issue-to-PR flows. Cursor is editor-native — the IDE is the surface, with the GitHub PR as just one output. The Cloud Agent + Bugbot loop you saw is closer to Copilot Workspace in spirit, but it runs from any surface — Slack, the web dashboard, the IDE. And the model neutrality story matters here too — Workspace is OpenAI-only by default."*

**If they push ("we already pay for Copilot, why add Cursor?"):**

> *"Workspace and Cursor aren't mutually exclusive for some teams, but the engineer-day experience is fundamentally different. Cursor replaces the editor; Copilot augments GitHub. If you're evaluating against Claude Code, the apples-to-apples comparison is Cursor — same surface area."*

**Source:** General knowledge; Copilot Workspace is GitHub-native, tied to issue/PR flows on github.com.

---

## Card 8 — "What if the agent introduces a security vulnerability? How would we even know?"

**Adobe will absolutely ask. Don't deflect.**

**30-sec answer:**

> *"Three layers. First — Bugbot. You saw it find the keyboard-nav bug on PR #3 — that same engine catches injection, hardcoded secrets, unsafe deserialization. Second — your existing CI security scanners (Snyk, Dependabot, whatever you run today) still run on the PR. Cursor doesn't bypass them. Third — every change is in a PR with a human reviewer. There's no auto-merge from agent to main without a human approval gate. The agent accelerates the work, it doesn't replace the review."*

**If they push ("but Bugbot might miss something"):**

> *"Bugbot is an additional layer, not a replacement for your existing security review. Customers like PlanetScale specifically run Bugbot alongside their existing tools for production reliability — there's a case study on the Cursor blog. The model is defense in depth."*

**Source:** Cursor enterprise page (Bugbot section); PlanetScale customer story ("PlanetScale protects production reliability with Bugbot," March 2026).

---

## Card 9 — "What about Tab? Don't most engineers say that's the killer feature?"

**Your demo deliberately skipped Tab. Have a clean answer if asked.**

**30-sec answer:**

> *"Tab is the moment-to-moment lift — most engineers do say it's what they miss first if they switch. I led with Agent today because that's where the workflow differentiation lives, and your team is specifically evaluating Cursor against Claude Code. Tab versus Tab is a different conversation — Claude Code doesn't have Tab at all. Once Adobe's pilots install Cursor on day one of the trial, Tab is automatic — it's not something you have to configure or learn. They'll feel it in the first hour."*

**If they push ("can we see it?"):**

> *"Happy to spend two minutes on Tab right now if it'd help, or save it for the deeper dive after the trial kicks off. Your call."*

**Source:** Strategic framing — you deliberately excluded Tab per the original notes. The honest answer is "I chose to lead with what differentiates against Claude Code."

---

## Card 10 — "How does licensing/pricing work for our org size?"

**Procurement question. Don't quote numbers you can't verify.**

**30-sec answer:**

> *"Enterprise is priced per seat with an included usage allotment. You can pre-commit additional usage for high-volume teams. Administrators have full cost control — usage limits at both team and individual user level, plus analytics dashboards showing adoption rates and AI-assisted code metrics. For Adobe's specific scale and contract structure, that's a direct conversation with our enterprise team — they'll model it against your headcount and expected usage."*

**If they push ("what's a ballpark per-seat number?"):**

> *"I'd rather have our enterprise team give you an accurate number tied to your usage profile than guess. That conversation can happen this week if you want — I'll connect you."*

**Source:** Cursor enterprise FAQ ("Enterprise plans are priced per seat with an included usage allotment. Organizations can pre-commit additional usage for high-volume teams.").

---

## Curveball prep

If a question lands outside these cards, the universal recovery moves:

1. **Buy time:** *"Great question. Two parts to that..."* — gives you 2 seconds to think.
2. **Reframe to a card you have:** Most Adobe-flavored questions reduce to one of these 10. Identify which.
3. **Honest "I don't know":** *"I don't have that detail in front of me. I can confirm with our team and follow up within 24 hours."* — never bullshit a Field Engineer. They'll spot it.
4. **Bridge to a customer story:** *"PayPal/NAB/Amplitude saw something similar — let me describe how they handled it."*

---

## The 10 facts you should be able to recite cold

These appear across multiple cards. Burn them in.

1. **SOC 2 Type 2 certified**
2. **Zero data retention with all model providers**
3. **SAML SSO + SCIM provisioning**
4. **Model + MCP + agent rule allowlists**
5. **64% of Fortune 500** on Cursor
6. **Upwork: 25%+ PR volume, 100%+ PR size, 50% more code shipped**
7. **Amplitude: 3x more production code**
8. **NVIDIA, Stripe, Coinbase** as monorepo-scale customers
9. **trust.cursor.com** for the SOC 2 report
10. **No on-premises today; AWS-only cloud architecture, full ZDR**

---

# 201-level cards

These cards layer on top of the 10 above and are scoped to the 201 audience
(smaller, more technical, already saw the 101 demo). Pull these out when
the question is about advanced primitives — Rules / Commands / Skills /
Hooks / MCP / Plugins / model routing — rather than enterprise procurement.

## Card 11 — "What's the security model for hooks? Can a hook exfiltrate data?"

**This is the highest-probability 201 question. Adobe will ask it within five minutes of seeing a hook fire on stage. Have it nailed.**

**30-sec answer:**

> *"Three layers. First — code review. Hook scripts live in `.cursor/hooks/*.sh` next to the manifest, in version control, like any other code in the repo. Nothing is hidden; your existing PR review process applies. Second — admin allowlist. Adobe's Cursor admin panel can pin which hooks, plugins, and MCP servers are allowed across the org. You can require all hooks be sourced from an internal registry you control. Third — execution scope. Hooks run as the local user in the local environment — they don't escalate, and they don't carry secrets the agent doesn't have. The security model is 'bring your own trust' — Cursor doesn't pretend hooks are zero-trust by default. For Adobe specifically: maintain an internal plugin registry, require security review on hook scripts, lock to that registry via admin."*

**If they push ("but a malicious plugin could ship a hook that exfiltrates"):**

> *"True for any system that lets you run code. The mitigation is the same as any other code-running system you operate today: registry-based distribution, code review, admin-controlled installation. The difference is hooks make the surface explicit — `.cursor/hooks.json` plus `.cursor/hooks/*.sh` is a small, reviewable set of files. Easier to audit than an opaque IDE plugin binary."*

**Source:** Cursor [Hooks docs](https://cursor.com/docs/hooks.md); Plugins manifest review process documented at [cursor.com/docs/plugins](https://cursor.com/docs/plugins).

---

## Card 12 — "Context window mechanics — what actually gets sent each turn? What gets compacted?"

**The technical-credibility question. Engineers in the room have used 2-3 of these tools and are comparing harness behavior.**

**30-sec answer:**

> *"Cursor's harness tiers context. Pinned and always-included: Rules in Always mode, AGENTS.md, the active Plan if you're in Plan mode, tool definitions for active MCP servers. Summoned on demand: Skills the agent decides to load based on their description, `@`-mentions, file reads mid-turn. Compacted under pressure: older conversation turns and large tool outputs get summarized into shorter forms once the window gets tight. Skills NOT currently relevant don't load at all — that's the whole point of description-routed loading. Net effect: you get more useful context per token than systems that either dump everything or aggressively prune."*

**If they push ("can I control what gets compacted?"):**

> *"Partly. You control what's pinned via Rules application mode. You can `@`-pin specific files for a turn. There's a `preCompact` hook event that fires before compaction runs — you can use that to take a snapshot or run custom logic. But the compaction algorithm itself is part of the harness; you don't tune it directly. The practical lever is upstream: be ruthless about what's in Always mode."*

**Source:** [agent best practices blog](https://cursor.com/blog/agent-best-practices); Hooks reference for `preCompact` event.

---

## Card 13 — "How does the agent decide *when* to fire a Skill vs ignore it?"

**The "Skill confusion" question. Adobe engineers will misunderstand this; you correcting them politely is the leadership beat.**

**30-sec answer:**

> *"Two independent triggers. Path one: the user types `/skill-name`. That's deterministic — the slash invocation forces the skill load. Path two: the agent reads every available SKILL.md's *description* on each turn — just the description, not the body — and decides whether the current task matches. If the description says 'Use when the user asks to ship a hotfix' and the conversation looks like a hotfix request, the agent loads the body. Otherwise it doesn't. Description quality is everything. Write descriptions that explicitly name the trigger condition — 'Use when X' — not generic ones like 'a helpful workflow.'"*

**If they push ("so the model sees all skill descriptions every turn? Doesn't that pollute context?"):**

> *"Yes, descriptions are presented every turn. Bodies are not. A description is one or two sentences, so the per-turn cost of N skills is roughly N short sentences — negligible until you ship hundreds. At very large scale you use plugin scoping so different teams' skill catalogs don't all merge into one pile, and the admin allowlist can disable skills org-wide. Description discipline is the load-bearing piece. Teams that ship Cursor at scale invest in skill-description style guides."*

**Source:** [agent best practices blog](https://cursor.com/blog/agent-best-practices); Plugins reference for marketplace scoping.

---

## Card 14 — "Can MCP servers run inside our VPC? What does the deployment look like?"

**Adobe's IP team will ask. Don't oversell remote-MCP; lead with stdio.**

**30-sec answer:**

> *"Two deployment shapes. Stdio MCP servers run locally — the agent spawns a process, talks JSON-RPC over stdin/stdout. Those are the easiest to keep inside your perimeter because they never leave the engineer's machine. Remote MCP servers run as HTTP endpoints — you'd stand those up inside your VPC, on internal DNS, and declare them in `.cursor/mcp.json` with the internal URL. The agent calls them like any HTTPS service. Authentication is your call — bearer tokens, mTLS, whatever your internal services already use. The key point is Cursor doesn't proxy MCP calls through its cloud; the agent calls the server directly from the developer's environment."*

**If they push ("can we restrict which MCP servers are reachable?"):**

> *"Yes — admin allowlist at the org level. You can ship an internal `mcp.json` configuration that pins exactly which servers engineers can call, and block everything else. Combine with the `beforeMCPExecution` hook for per-call audit and you have both a structural and a behavioral layer of control."*

**Source:** [agent best practices blog](https://cursor.com/blog/agent-best-practices); [Cursor plugins reference](https://cursor.com/docs/reference/plugins).

---

## Card 15 — "We have an Adobe-internal plugin registry. Can we lock Cursor to only that registry?"

**Plugin governance is a procurement-blocking question. Don't be vague.**

**30-sec answer:**

> *"Yes. Adobe's Cursor admin panel can restrict plugin installation to URLs from an allowlist of registries. Engineers can browse the public Marketplace and cursor.directory but installation is gated by admin policy. You'd typically stand up an internal git-based plugin registry — plugins are just git repos with a `.cursor-plugin/plugin.json` manifest, so the registry is whatever git host you already trust. Pin the allowlist to your internal host, audit the manifests on the way in, and you've got a fully governed extension surface."*

**If they push ("can we run our own marketplace UI?"):**

> *"The official Marketplace is Cursor-hosted. Internally Adobe wouldn't replicate the marketplace UI — you'd publish plugin URLs in Confluence or whatever your internal docs surface is, and engineers install by URL. The marketplace UI itself is a discovery convenience; the install path doesn't depend on it."*

**Source:** [Cursor plugins overview](https://cursor.com/docs/plugins); enterprise admin documentation.

---

## Card 16 — "How does Best-of-N actually pick the winning attempt? Is it just diffing?"

**A "future of dev" question. Saying 'vibes' loses the room.**

**30-sec answer:**

> *"Structured human-in-the-loop by default, with optional automated eval. Fire N Cloud Agents on the same task — each runs in an isolated git worktree on its own branch. Default selection is the engineer reviewing the N attempts side-by-side and picking the winner, or merging across them. Where it gets interesting: you can write an eval script — runs on each candidate, scores it on whatever matters to you (tests pass? type-check clean? diff size? perf benchmark? axe-core a11y score?). The eval scores surface the most likely winner first. So the answer is 'human-in-the-loop, with optional automated eval gates.' For Adobe's a11y bar specifically, the eval could be axe-core."*

**If they push ("does Cursor pick automatically with no human if I want?"):**

> *"You can configure a fully-automated eval gate — top-scored candidate auto-merges. Most teams don't want that day one. Start with eval-surfaces-the-winner, human-confirms. Move to eval-gates-auto-merge only on workflows where the eval is genuinely sufficient — codemods, dependency bumps, small refactors."*

**Source:** Subagents v2.4 release; [agent best practices blog](https://cursor.com/blog/agent-best-practices); inferred from `best-of-n-runner` subagent type.

---

## Card 17 — "Cursor CLI in CI — is it production-supported, or beta?"

**Adobe wants to run agents on CI runners. Be honest about maturity.**

**30-sec answer:**

> *"Cursor ships a `cursor agent` CLI that runs the same harness from a terminal — Cursor Cloud Agents already run on the same primitive in Cursor's infrastructure. It's used for nightly codemods, dependency bumps, batch refactors. For Adobe CI, the pattern is: spin up an ephemeral runner with your repo, run `cursor agent` with a scoped prompt, capture the diff, open a PR through your normal PR-bot. It's production-suitable today for batch automation. Real-time interactive use in CI — less of a fit; the CLI is for unattended runs."*

**If they push ("what's the cost model in CI?"):**

> *"Same usage model as the IDE — token consumption against your enterprise allotment. Admin panel shows usage per-team. You'd want to set per-job usage caps so a runaway agent doesn't burn the budget. Same hygiene you'd apply to any LLM-in-CI integration."*

**Source:** Inferred from Cloud Agent infrastructure; verify exact CLI command name in current docs.

---

## Card 18 — "How do you prevent two teams from shipping conflicting custom commands or skills?"

**The plugin-at-scale governance question. Answer = the org pattern, not a technical lock.**

**30-sec answer:**

> *"Three layers. First — naming conventions. Plugins should namespace their commands and skills — `adobe-firefly/review-pr`, not just `review-pr`. Second — admin allowlist. The org pins which plugins are installable; if two collide, only one ships. Third — the Center of Excellence pattern. One small team owns the internal plugin catalog, reviews submissions, runs office hours. That team is the human governance layer that mechanical allowlists can't replace. At the technical layer, slash-command precedence is deterministic — Commands win over Skills on `/`-invocation, and within Commands the project-scope wins over user-scope. So the conflict resolution rules exist, but the org pattern is the right answer."*

**If they push ("what if two plugins both declare a `/review-pr` command?"):**

> *"Last-loaded wins, deterministically — but admin allowlist should prevent that situation from arising. If two installed plugins both declare the same command name, Cursor surfaces a warning. The Center of Excellence catches it in plugin review. The point is the conflict shouldn't reach a developer's machine."*

**Source:** [Cursor plugins reference](https://cursor.com/docs/reference/plugins) (precedence rules); [agent best practices blog](https://cursor.com/blog/agent-best-practices) for the CoE pattern.
