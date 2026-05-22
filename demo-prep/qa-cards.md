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
