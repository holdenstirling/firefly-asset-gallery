# Notes alignment — Friday-morning reference

Standalone audit of the demo against your original notes. Read this Friday morning before the meeting to make sure none of the original intent got lost.

---

## Your original notes (verbatim)

> - Never show 'tab'
> - Security Stuff for Adobe
> - Play around w/ Cloud Agents
> - Fire off a Cursor Agent from Slack
> - Use the Agent Window (cursor.com/agents)
>   - Show this to a customer
>   - Starting in agents window (Slide to start where you can use / where users)
>   - Use IDE for the 'Demo'
> - Spin up a simple demo app
>   - [pivoted from stock market to Firefly Asset Gallery]
>   - Fire off a Cloud agent and have it build everything
>   - First do 'Ask Mode'
>   - Get a download of what's going on, you understand the codebase
>   - I want to add XYZ mode
>   - I want to use plan mode
>     - I want to use OPUS b/c it's really good at highly complex
>     - Edit the plan via Markdown file itself
>     - Now that I have everything I want to go ahead and create everything in build mode with composer
>       - **This is model agnostic**
>       - Use composer for the build since it's really fast and efficient
>     - This will take 10 minutes to do
>     - Video of agent reviewing and testing everything
>       - Kick it off and run the agent and then step away and come back
>     - Riding shotgun with the agent > do some of it in cursor and a cloud agent can just run with it
> - Setup
>   - Places to use cursor
>   - Here's where you can interact with cursor
>   - Here's the trend where we are seeing
>     - **Models are so good to run asynchronously**
>     - Here's what it would look like with a Cloud agent
>   - Add /Rules — Add new rules
>   - Add /Skills — User level Skills (Create PR w/ Summary)
>   - **Look back on what we did and create a /skill (encode that within a skill)**
>
> ### Notes
> - It's for adobe so create some sort of frontend related to some sort of Adobe experience
> - Build something with the Editor and run sync in a cloud agent
> - **Second half of the development life cycle is a bigger bottleneck, compliance, governance, security**
>   - How do I review this code, how do I merge this? I.e. Bug Bot, or other products
> - **Allows smaller teams that used to not be possible (Value Add)**
> - **Hard to put value onto a project that may or may not have ever gotten done**
> - Weave into the presentation, Team Kit, Cursor Team Kit, 17 skills www.
> - Switch between tabs (Setup Personal Slack Account)
>
> ### Things to Know
> - Cursor vs. Claude Code
>   - **Model Neutrality (Flexibility not being locked into a specific lab)**
>   - **Flexibility on all of the best models**
> - /Skills vs. /Rules
> - Create a new rule, start a new chat
>
> ### Feedback from Cursor Employee on Field Engineering
> > "do cursor learn, read the blogs and case studies, and show something kinda practical, **extra points if he uses a new feature**"

---

## Alignment status

| Note | Status | Where |
|---|---|---|
| Never show 'tab' | DONE | Excluded |
| Security stuff for Adobe | PENDING insert | Section 7.5 enterprise beat (in plan, not yet baked) |
| Cloud Agents | DONE | Section 4 / PR #3 |
| Fire from Slack | DONE | Tab 1 / Slack thread |
| cursor.com/agents window | DONE | Tab 2 / dashboard run |
| Show to customer | DONE | Section 1 opening |
| Use IDE for demo | DONE | Sections 3, 5, 6 |
| Firefly demo app (Adobe-relevant) | DONE | Repo |
| Ask Mode | DONE | Section 3a |
| Plan Mode w/ Opus | DONE | Section 3b |
| Edit plan via markdown | DONE | Section 3c hand-edit |
| Build mode w/ Composer | DONE | Section 5 |
| Model agnostic | **NOW IN NARRATION** | Section 3b at model switch |
| 10 minutes total | TIGHT | IDE block ~10 min nominal |
| Video of agent reviewing | RESHAPED + live demo | Tab 1–2 fire a live `@Cursor` Slack task and watch the run stream in real time on `cursor.com/agents`; Tab 4 has Bugbot review of PR #3 |
| Kick off and step away | DONE | Tab 1–2 live fire-off + watching the stream captures the "step away" feel — actually live, not recorded |
| Riding shotgun | DONE | Section 3 + Diagram 2 |
| Places to use Cursor | DONE | Diagram 1 |
| Models so good to run async | **NOW IN NARRATION** | Section 4 Tab 1 opening line |
| /Rules | DONE | Section 7 Beat 1 (test-files.mdc) |
| /Skills | DONE | Section 7 Beat 2 (pr-summary) |
| User-level skill: Create PR w/ Summary | DONE | Exact match — pr-summary |
| Encode THAT within a skill | **NOW IN NARRATION** | Section 7 Beat 2 reframing |
| Adobe-relevant frontend | DONE | Firefly Asset Gallery |
| Editor + sync cloud agent | DONE | Two-track flow |
| Second half of dev lifecycle (compliance/governance/security) | **NOW IN NARRATION** | Section 4 Tab 4 closing line |
| Bug Bot for review and merge | DONE | Section 4 Tabs 3-4 |
| Smaller teams now possible | **NOW IN NARRATION** | Diagram 2 closing recap |
| Projects that wouldn't have gotten done | **NOW IN NARRATION** | Diagram 2 closing recap |
| Team Kit, 17 skills | DONE | Section 7 closing line |
| Cursor vs Claude Code | DONE implicitly | Diagram 1 + Q&A card |
| Model Neutrality | **NOW IN NARRATION** | Section 3b at Plan-mode model switch |
| Flexibility on best models | **NOW IN NARRATION** | Section 3b (same line as Model Neutrality) |
| /Skills vs /Rules | DONE | Section 7 Beats 1 + 2 |
| Use a NEW feature | **NOW IN NARRATION** | Section 4 Tab 4 — Bugbot Fix-in-Web -> autofix Cloud Agent callout |
| Cursor employee tip: cursor.com/learn + blogs | YOUR ACTION | Watch the videos before Friday |

---

## The five baked-in narration tweaks (read these before Friday)

These are now live in the runbook. If you want the verbatim source-of-truth in one place, here they are:

### 1. Section 3b — at the Plan-mode + Opus model switch

> *"Now I'm switching to Plan mode and to Opus. Plan mode is read-only — it reasons about my codebase, it doesn't touch it. Opus is what I reach for when the planning surface is wide. **And this — this is one of the biggest differences from Claude Code. Cursor isn't locked to one lab. Opus for planning, Composer for execution, GPT-5.5 for spec writing. Same agent, your choice of model.**"*

### 2. Section 4 Tab 1 — opening line

> *"**Models are good enough now that they can run asynchronously.** While I plan locally, work with clear scope fans out to Cloud Agents in Cursor's infrastructure. I sent this yesterday from Slack — `@Cursor`, here's the Linear ticket."*

### 3. Section 4 Tab 4 — closing line + new-feature callout

> *"And here's the closer. Bugbot ships a one-click 'Fix in Cursor' or 'Fix in Web' button. I clicked Fix in Web — that fired a second Cloud Agent that produced this 2-line fix and opened PR #4. Author: `cursoragent@cursor.com`. **This is one of Cursor's newer capabilities — Bugbot doesn't just review, it can dispatch the fix to a Cloud Agent in one click. PR #4 didn't exist 20 minutes after PR #3.** The entire loop ran without me opening the IDE: Linear → Slack → Cloud Agent → PR → Bugbot → autofix Cloud Agent → PR. **That's the second half of the development lifecycle — compliance, governance, security — the part that used to bottleneck even great engineering teams.**"*

### 4. Section 7 Beat 2 — when creating the pr-summary skill

> *"**I just walked you through Ask → Plan → Build with hand-editing `plan.md`. I'm going to capture that entire flow as a personal Skill. The next engineer on my team doesn't have to learn this from scratch — they just type the slash command. This is how Cursor turns institutional knowledge into infrastructure.**"*

### 5. Diagram 2 (closing recap) narration

> *"That's the picture. One Linear ticket — two parallel tracks. Locally I rode shotgun with the agent: Ask scoped it, Plan with Opus reasoned about the codebase and wrote a plan I could edit by hand, Build with Composer executed it. In parallel, a Cloud Agent fired from Slack delivered Playwright tests, Bugbot caught an accessibility bug the agent introduced, and a second Cloud Agent produced the fix. Two PRs, one engineer, ten minutes. That's the lift a small team gets — without giving up code review or governance. **The bigger story is what this unlocks: projects that wouldn't have gotten started before, getting shipped. That doesn't show up in any dashboard.**"*

---

## What still has to happen between now and Friday

From your notes that aren't yet covered by structural artifacts:

1. **Security beat (Section 7.5)** — still pending in the plan. Covers SOC 2, zero data retention, SSO/SCIM, model controls. ~20 seconds.
2. **Adobe problem framing (Section 0a)** — still pending in the plan. Names Adobe's constraints (Creative Cloud scale, a11y, IP) before the surface-area diagram. ~30 seconds.
3. **Cursor employee homework** — watch [cursor.com/learn](https://cursor.com/learn) videos, skim a recent customer story ([PayPal](https://cursor.com/blog/paypal), [NAB](https://cursor.com/blog/nab), [Amplitude](https://cursor.com/blog/amplitude)). 30 minutes total. Look for: language they use, what they emphasize, any new feature you can name-drop.
4. **IDE dry-run on HOL-7** — single highest-priority remaining task.

**Removed from this list:** screencast capture. Section 4 Tab 2 now runs a live `@Cursor` Slack fire-off instead of playing a pre-recorded clip. See the README Section 4 stage directions for the live fire-off and the dashboard-fallback procedure.

---

## One sentence to read out loud Friday morning

> *"Adobe is evaluating Cursor against Claude Code. The thing that separates them is not the model — it's the surface area, the model neutrality, and the second half of the development lifecycle. Show all three."*
