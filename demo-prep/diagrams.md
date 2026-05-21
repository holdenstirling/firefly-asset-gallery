# Demo diagrams

Two Mermaid diagrams sized for slide capture. **Pre-rendered files live in this folder** — just drop them into Keynote:

| Diagram | PNG (1920×1080, transparent) | SVG (vector) | Source |
|---|---|---|---|
| 1 — Surface area | [`diagram-1.png`](./diagram-1.png) | [`diagram-1.svg`](./diagram-1.svg) | [`diagram-1.mmd`](./diagram-1.mmd) |
| 2 — Two-track workflow | [`diagram-2.png`](./diagram-2.png) | [`diagram-2.svg`](./diagram-2.svg) | [`diagram-2.mmd`](./diagram-2.mmd) |

Re-render after editing the `.mmd` source:

```bash
npx -y -p @mermaid-js/mermaid-cli mmdc -i diagram-1.mmd -o diagram-1.png -w 1920 -H 1080 -b transparent
npx -y -p @mermaid-js/mermaid-cli mmdc -i diagram-1.mmd -o diagram-1.svg -b transparent
```

The Mermaid source is also embedded below for reference — both render natively on GitHub.

---

## Diagram 1 — Where Cursor lives (opening slide)

The differentiator-in-one-image: **Cursor is not an editor; it is a surface area.** One engineer reaches the same agent infrastructure from IDE, Slack, the web dashboard, and inside a GitHub PR.

```mermaid
flowchart LR
    ENG(("Engineer"))

    subgraph SURFACES["Cursor surface area"]
        direction TB
        IDE["Cursor IDE<br/>Ask · Plan · Build"]
        SLACK["Slack<br/>@Cursor mention"]
        WEB["cursor.com/agents<br/>dashboard"]
        BB["GitHub PRs<br/>Bugbot review"]
    end

    REPO[("Your codebase")]

    ENG --> IDE
    ENG --> SLACK
    ENG --> WEB
    ENG --> BB

    IDE --> REPO
    SLACK --> REPO
    WEB --> REPO
    BB --> REPO

    classDef surface fill:#1f2937,stroke:#a8b3cf,color:#f5f7fb,stroke-width:1px;
    classDef repo fill:#fef3c7,stroke:#92400e,color:#1f2937,stroke-width:2px;
    classDef person fill:#dbeafe,stroke:#1e3a8a,color:#1e3a8a,stroke-width:2px;
    class IDE,SLACK,WEB,BB surface
    class REPO repo
    class ENG person
```

**Narration cue (~15 sec):**
> *"Before we touch any code — this is what makes Cursor different. Claude Code lives in one surface, the terminal. Cursor lives wherever your engineers already are: the IDE for synchronous work, Slack and the web dashboard for async work you fan out to Cloud Agents, GitHub PRs for review through Bugbot. Same agents, same context, four entry points."*

---

## Diagram 2 — Two-track workflow (closing recap slide)

The story you just demoed, compressed into one image. Local Ask → Plan → Build runs alongside async Cloud Agents, both converging on `main`. This is what "punching above your weight" looks like.

```mermaid
flowchart LR
    L["Linear ticket"]:::anchor

    subgraph LOCAL["Local — ride shotgun"]
        direction TB
        A["Ask<br/>scope the work"]:::local
        P["Plan + Opus<br/>edit plan.md by hand"]:::local
        B["Build + Composer<br/>execute the plan"]:::local
        A --> P --> B
    end

    subgraph ASYNC["Async — Cloud Agents"]
        direction TB
        S["Slack · @Cursor"]:::async
        C["Cloud Agent<br/>writes code → PR opened"]:::async
        BB["Bugbot review<br/>catches a11y bug"]:::async
        F["Autofix Cloud Agent<br/>PR with fix"]:::async
        S --> C --> BB --> F
    end

    M(["main shipped"]):::anchor

    L --> A
    L --> S
    B --> M
    F --> M

    classDef local fill:#dcfce7,stroke:#15803d,color:#14532d,stroke-width:1px;
    classDef async fill:#e0e7ff,stroke:#4338ca,color:#312e81,stroke-width:1px;
    classDef anchor fill:#fef3c7,stroke:#92400e,color:#78350f,stroke-width:2px;
```

**Narration cue (~25 sec):**
> *"That's the picture. One Linear ticket — two parallel tracks. Locally I rode shotgun with the agent: Ask scoped it, Plan with Opus reasoned about the codebase and wrote a plan I could edit by hand, Build with Composer executed it. In parallel, a Cloud Agent fired from Slack delivered Playwright tests, Bugbot caught an accessibility bug the agent introduced, and a second Cloud Agent produced the fix. Two PRs, one engineer, ten minutes. That's the lift a small team gets — without giving up code review or governance. The bigger story is what this unlocks: projects that wouldn't have gotten started before, getting shipped. That doesn't show up in any dashboard."*

---

## How to use these slides

1. Open this file on GitHub: `https://github.com/holdenstirling/firefly-asset-gallery/blob/main/demo-prep/diagrams.md`
2. GitHub renders Mermaid natively — screenshot at retina (Cmd+Shift+4 on macOS, or zoom the browser to 150% first for crisper export).
3. Drop into your deck. Two slides, no extra apps required.
4. If you want PNG/SVG export for higher quality, paste the source into [mermaid.live](https://mermaid.live) and use its export buttons.
