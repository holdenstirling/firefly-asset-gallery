# Field Engineering POV — Cursor 201 closing discussion

For the 5-minute "discussion" block at the end of the Adobe 201 session.
The brief says: *"Share your perspective on the role of Field Engineering
in AI tooling. How do you believe AI will reshape software development
teams?"*

This is the **leadership** beat. Not a demo, not a Q&A, not a sell.
Three frames, ~90 seconds each. Leave the back third open for the
customer to talk — your job is to bait the conversation, not deliver a
monologue.

---

## Frame 1 — AI as infrastructure, not a tool (~90 sec)

**The point:** the FE job is changing from "teach people to type good
prompts" to "teach teams to ship primitives." Quality-of-output is
increasingly downstream of quality-of-context, and context is something
you *build* — rules, skills, hooks, commands, plugins, MCP servers — not
something you reach for on demand.

**How to say it:**

> *"My take on Field Engineering, at least the way I want to do it — six
> months ago the conversation with customers was 'what's the best prompt
> for this task?' Today the conversation is 'what's the right primitive
> for this team?' The unit of leverage is no longer the single
> interaction; it's the configuration you ship to a thousand engineers."*
>
> *"What you saw today is the proof. The four axes — rules, commands,
> skills, hooks — are infrastructure. They live in version control, they
> get code-reviewed, they ship as plugins. The plugin manifest is closer
> to a Terraform module than to a chat prompt. That changes what
> Field Engineering coaches teams on."*
>
> *"My pitch internally at Cursor: FE for AI tooling looks more like
> Developer Relations for Platform Engineering than like a sales
> engineer for an IDE. Build the team's infrastructure muscle. Help
> them ship the first three plugins. Then get out of the way."*

**Bait line for the customer:**

> *"I'm curious — at Adobe specifically, who do you think owns 'AI
> infrastructure' on the org chart in eighteen months? Platform team?
> Developer experience? A new function?"*

---

## Frame 2 — The Center of Excellence pattern (~90 sec)

**The point:** at scale, every successful AI tooling rollout looks the
same — a small team (3-5 engineers) owns the internal catalog, runs
office hours, curates what ships. Same shape as design systems teams,
internal-platform teams, or DevX teams. The pattern is borrowable.

**How to say it:**

> *"Companies that get this right tend to converge on the same
> structural answer. Three to five engineers, one team, owns the
> internal plugin catalog. They review submissions, run weekly office
> hours, curate which rules become the company defaults. They're not
> gatekeepers — they're enablers. Same shape as the design systems team
> at Adobe today; same shape as the DevX teams at Stripe, Coinbase, the
> handful of companies I can name."*
>
> *"What that team does specifically: stand up the internal registry,
> write the first plugin yourselves so the pattern is clear, write the
> style guide for skill descriptions, set the admin allowlist policy,
> run a Slack channel for plugin authors. The first quarter is mostly
> writing and reviewing. By month four, the team is mostly running
> office hours and unblocking, because the pattern is established and
> the next plugins are written by their consumers."*
>
> *"The mistake I'd flag: don't make this team the bottleneck. Their
> job is to make the next plugin easier to ship, not to gate-keep
> every one."*

**Bait line for the customer:**

> *"If Adobe stood this up — what team is closest? Is there a design
> systems crew with the right DNA, or does it spin out fresh?"*

---

## Frame 3 — The bottleneck has moved (~90 sec)

**The point:** coding throughput is no longer the constraint. Review,
governance, security — the *second half* of the development lifecycle —
is where the time goes now. Field Engineering work increasingly bridges
*that* half. This is also the frame that justifies tools like Bugbot,
hooks, eval pipelines, and Best-of-N.

**How to say it:**

> *"Here's the shift I think is undersold. Five years ago the constraint
> was 'engineers can't type code fast enough to ship the roadmap.' AI
> coding tools fixed that. The constraint has moved. The bottleneck now
> is everything between 'code exists' and 'code is in production' —
> code review, compliance review, security scanning, accessibility
> audits, integration testing, deploy approvals. The second half of
> the dev lifecycle."*
>
> *"Cursor's bet — and I think it's the right bet — is that the same
> agent infrastructure that writes the code should help collapse that
> second half. Bugbot reviews PRs. Hooks enforce compliance at the I/O
> boundary, not via slide decks. Best-of-N plus eval pipelines means
> the team can ship ten candidates, score them automatically, and merge
> the winner. That's not 'engineers code faster' — that's 'the
> lifecycle between coding and deploying gets compressed.'"*
>
> *"For Adobe in particular: you have hard accessibility requirements,
> hard IP requirements, hard security requirements. Those are exactly
> the constraints that benefit most from this second-half compression.
> An eval pipeline that runs axe-core on every Best-of-N candidate, a
> hook that audits every external tool call, a Bugbot policy tuned to
> Adobe's specific risk profile — that's where the ROI lands. Not on
> 'engineers wrote 25% more code.' On 'the projects that used to take
> a quarter to get through compliance ship in a sprint.'"*

**Closing line (read verbatim if you can):**

> *"That's the bet I'd make on the next twenty-four months. The AI
> tools that win at Adobe aren't the ones that maximize lines of code
> per engineer. They're the ones that compress the second half of the
> dev lifecycle without giving up the review, governance, and security
> Adobe needs to ship safely. That's why we built Cursor the way we did,
> and it's the reason I think this trial is worth your time."*

**Bait line for the open discussion:**

> *"What's your gut on where the constraint will be at Adobe in
> eighteen months? Still review and compliance? Or something we
> haven't named yet?"*

---

## How to run the block

- Set a soft timer at 4 minutes. You want at least 60 seconds of pure
  customer talk at the end. If you're still mid-Frame-2 at 4:00, skip
  Frame 3 entirely and go to the bait line.
- Don't read these verbatim — internalize the shape, then say it in
  your voice. Listen to yourself on the dry-run: if it sounds like a
  pitch, you've over-rehearsed; if it sounds like a conversation, you're
  there.
- If the customer interrupts mid-frame to engage, let them. The frames
  are scaffolding for *their* talking, not yours.
- If the customer is silent at the end of each frame, use the bait
  line. Don't fill silence with more material.

---

## What NOT to say in this block

- **No product claims** — this is the discussion, not the demo. Don't
  re-pitch features you already covered. The audience will tune out.
- **No competitor names** — leave Claude Code, Copilot, Cline out of
  this section unless the customer brings them up. Forward-looking
  framing only.
- **No metrics** — Upwork's 25%+ number, Amplitude's 3x — those are
  Q&A material. The discussion is for vision, not numbers.
- **No "Adobe will obviously..."** — never tell Adobe what they will
  do. Bait their thinking, let them say it.

---

## If they pivot to a different topic

The brief says "the role of Field Engineering" and "how will AI reshape
teams." If they pivot off either, follow them. Adobe's questions are
more valuable than your prepared frames. The three frames are a safety
net, not a script.

Common pivots and quick anchors:

- **"How do you measure ROI of AI tools?"** — PR cycle time, time-to-
  first-PR for new hires, *projects-shipped-that-wouldn't-have-shipped*
  (the one from the 101 prep). Don't quote vanity metrics.
- **"What's the skills team profile we should hire for?"** — Closer to
  developer experience than to ML engineering. Pattern recognition for
  developer workflows, taste in tooling, ability to write technical
  prose (because skills and rules are mostly writing).
- **"What does this mean for our junior engineers?"** — The
  bear-case-they-evaporate is real but not the modal outcome. Better
  modal: juniors ship complete features earlier, because the rules
  and skills encode the senior judgement they'd otherwise need months
  of mentorship to internalize. The shift is in what mentorship
  *means*, not in whether juniors are needed.

---

## One sentence to read out loud Friday morning

> *"The Field Engineering job is changing — from teaching prompt craft
> to coaching teams on infrastructure. Bait Adobe's thinking, don't
> deliver a monologue."*
