# Antigravity Skill Bundles

> **Curated collections of skills organized by role and expertise level.** Don't know where to start? Pick a bundle below to get a curated set of skills for your role.

> These packs are curated starter recommendations for humans. Generated bundle ids in `data/bundles.json` are broader catalog/workflow groupings and do not need to map 1:1 to the editorial packs below.

> **Important:** bundles are installable plugin subsets and activation presets, not invokable mega-skills such as `@web-wizard` or `/essentials-bundle`. Use the individual skills listed in the pack, install the bundle as a dedicated marketplace plugin, or use the activation scripts if you want only that bundle's skills active in your live Antigravity directory.

> **Plugin compatibility:** root plugins and bundle plugins only publish plugin-safe skills. If a bundle shows `pending hardening`, the skills still exist in the repository, but that bundle is not yet published for that target. `Requires manual setup` means the bundle is installable, but one or more included skills need an explicit setup step before first use.

## Quick Start

1. **Install the repository or bundle plugin:**

   ```bash
   npx antigravity-awesome-skills
   # or clone manually
   git clone https://github.com/sickn33/antigravity-awesome-skills.git .agent/skills
   ```

2. **Choose your bundle** from the list below based on your role or interests.

3. **Use bundle plugins or individual skills** in your AI assistant:
   - Claude Code: install the matching marketplace bundle plugin, or invoke `>> /skill-name help me...`
   - Codex CLI / Codex app: install the matching bundle plugin where plugin marketplaces are available, or invoke `Use skill-name...`
   - Cursor: `@skill-name` in chat
   - Gemini CLI: `Use skill-name...`

If you want a bundle to behave like a focused active subset instead of a full install, use:

- macOS/Linux: `./scripts/activate-skills.sh --clear Essentials`
- macOS/Linux: `./scripts/activate-skills.sh --clear "Web Wizard"`
- Windows: `.\scripts\activate-skills.bat --clear Essentials`

---

## AI & Agents

### 🤖 The "Agent Architect" Pack

_For designing agent systems, orchestration, and multi-agent execution._

**Plugin status:** Codex plugin-safe · Claude plugin-safe

- [`ai-agents-architect`](../../skills/ai-agents-architect/): Design production-ready autonomous agent systems.
- [`autonomous-agent-patterns`](../../skills/autonomous-agent-patterns/): Select safe autonomous execution patterns.
- [`agent-orchestrator`](../../skills/agent-orchestrator/): Structure agent routing and coordination flows.
- [`multi-agent-patterns`](../../skills/multi-agent-patterns/): Compose specialized agents without chaos.
- [`langgraph`](../../skills/langgraph/): Build stateful graph-based agent workflows.
- [`crewai`](../../skills/crewai/): Implement crew-style role delegation.

### 🧠 The "LLM Application Developer" Pack

_For building production LLM apps with retrieval, structure, and operational control._

**Plugin status:** Codex plugin-safe · Claude plugin-safe

- [`llm-app-patterns`](../../skills/llm-app-patterns/): Apply production-ready LLM application patterns.
- [`rag-engineer`](../../skills/rag-engineer/): Design retrieval pipelines and grounded answers.
- [`prompt-caching`](../../skills/prompt-caching/): Reduce latency and cost with prompt caching.
- [`context-optimization`](../../skills/context-optimization/): Use context budget where it matters most.
- [`llm-structured-output`](../../skills/llm-structured-output/): Enforce schemas and stable machine-readable outputs.
- [`pydantic-ai`](../../skills/pydantic-ai/): Implement typed LLM applications with Pydantic AI.


---

## Prompts & Outputs

### ✍️ The "Prompt Engineering" Pack

_For designing precise prompts, reusable prompt assets, and reliable outputs._

**Plugin status:** Codex plugin-safe · Claude plugin-safe

- [`prompt-engineering`](../../skills/prompt-engineering/): Write high-signal prompts for programming LLMs.
- [`prompt-engineering-patterns`](../../skills/prompt-engineering-patterns/): Choose prompt patterns by task shape and failure mode.
- [`prompt-library`](../../skills/prompt-library/): Organize reusable prompts and system instructions.
- [`llm-structured-output`](../../skills/llm-structured-output/): Combine prompts with schema-constrained outputs.
- [`tool-design`](../../skills/tool-design/): Design tool contracts that LLMs can call reliably.


---

## Context & Memory

### 🧷 The "Context & Memory" Pack

_For long-running sessions, memory hierarchy, and context quality control._

**Plugin status:** Codex plugin-safe · Claude plugin-safe

- [`context-fundamentals`](../../skills/context-fundamentals/): Model context windows, relevance, and token budgets.
- [`context-agent`](../../skills/context-agent/): Assign agents explicit context responsibilities.
- [`context-compression`](../../skills/context-compression/): Compress state without losing decision-critical details.
- [`context-guardian`](../../skills/context-guardian/): Protect prompt boundaries and instruction integrity.
- [`agent-memory-systems`](../../skills/agent-memory-systems/): Design memory for persistent agent workflows.
- [`memory-systems`](../../skills/memory-systems/): Choose memory layers and retrieval strategies.
- [`agent-memory-mcp`](../../skills/agent-memory-mcp/): Expose memory over MCP-compatible interfaces.


---

## Evaluation & Reliability

### 📏 The "Evaluation & Ops" Pack

_For measuring quality, controlling failures, and operating LLM systems safely._

**Plugin status:** Codex plugin-safe · Claude plugin-safe

- [`agent-evaluation`](../../skills/agent-evaluation/): Test agent behavior against explicit goals.
- [`llm-evaluation`](../../skills/llm-evaluation/): Build repeatable evaluation loops for model quality.
- [`llm-ops`](../../skills/llm-ops/): Operate LLM systems with cost and reliability discipline.
- [`tool-use-guardian`](../../skills/tool-use-guardian/): Constrain risky tool execution paths.
- [`computer-use-agents`](../../skills/computer-use-agents/): Manage UI-driving agents and their failure modes.
- [`context7-auto-research`](../../skills/context7-auto-research/): Automate targeted context gathering before execution.


---

## Frameworks & Tooling

### 🛠️ The "MCP & Framework Tooling" Pack

_For tool interfaces, MCP servers, and framework-specific agent implementations._

**Plugin status:** Codex plugin-safe · Claude plugin-safe

- [`mcp-builder`](../../skills/mcp-builder/): Build MCP servers and tool surfaces cleanly.
- [`tool-design`](../../skills/tool-design/): Define tool schemas and invocation rules that agents follow.
- [`langchain-architecture`](../../skills/langchain-architecture/): Structure LangChain-based agent applications.
- [`pydantic-ai`](../../skills/pydantic-ai/): Use typed agents and validation-oriented flows.
- [`claude-api`](../../skills/claude-api/): Integrate Claude-oriented application patterns safely.

## 📚 How to Use Bundles

### 1) Pick by immediate goal

- Need to ship a feature now: `Essentials` + one domain pack (`Web Wizard`, `Python Pro`, `DevOps & Cloud`).
- Need reliability and hardening: add `QA & Testing` + `Security Developer`.
- Need product growth: add `Startup Founder` or `Marketing & Growth`.

### 2) Start with 3-5 skills, not 20

Pick the minimum set for your current milestone. Expand only when you hit a real gap.

### 3) Invoke skills consistently

- **Claude Code**: install a bundle plugin or use `>> /skill-name help me...`
- **Codex CLI**: install a bundle plugin where marketplaces are available, or use `Use skill-name...`
- **Cursor**: `@skill-name` in chat
- **Gemini CLI**: `Use skill-name...`

### 4) Build your personal shortlist

Keep a small list of high-frequency skills and reuse it across tasks to reduce context switching.

## 🧩 Recommended Bundle Combos

### Ship a SaaS MVP (2 weeks)

`Essentials` + `Full-Stack Developer` + `QA & Testing` + `Startup Founder`

### Harden an existing production app

`Essentials` + `Security Developer` + `DevOps & Cloud` + `Observability & Monitoring`

### Build an AI product

`Essentials` + `Agent Architect` + `LLM Application Developer` + `Data Engineering`

### Grow traffic and conversions

`Web Wizard` + `Marketing & Growth` + `Data & Analytics`

### Launch and maintain open source

`Essentials` + `OSS Maintainer` + `Architecture & Design`

---

## Learning Paths

### Beginner → Intermediate → Advanced

**Web Development:**

1. Start: `Essentials` → `Web Wizard`
2. Grow: `Full-Stack Developer` → `Architecture & Design`
3. Master: `Observability & Monitoring` → `Security Developer`

**AI/ML:**

1. Start: `Essentials` → `Agent Architect`
2. Grow: `LLM Application Developer` → `Data Engineering`
3. Master: Advanced RAG and agent orchestration

**Security:**

1. Start: `Essentials` → `Security Developer`
2. Grow: `Security Engineer` → Advanced pentesting
3. Master: Red team tactics and threat modeling

**Open Source Maintenance:**

1. Start: `Essentials` → `OSS Maintainer`
2. Grow: `Architecture & Design` → `QA & Testing`
3. Master: `Skill Author` + release automation workflows

---

## Contributing

Found a skill that should be in a bundle? Or want to create a new bundle? [Open an issue](https://github.com/sickn33/antigravity-awesome-skills/issues) or submit a PR!

---

## Related Documentation

- [Getting Started Guide](getting-started.md)
- [Full Skill Catalog](../../CATALOG.md)
- [Contributing Guide](../../CONTRIBUTING.md)

---

_Last updated: March 2026 | Total Skills: 35+ | Total Bundles: 6_
