# Programming LLM Skills

This directory is intentionally curated for programming LLMs and agentic coding workflows.
The goal is simple: fewer skills, clearer names, less routing ambiguity, and more predictable behavior across Claude, GPT/Copilot, Gemini, Cursor, Codex, and similar assistants.

## Scope

This folder now contains only the skills needed for:

- prompt design and prompt optimization
- RAG systems and retrieval design
- context management and memory
- agent design and multi-agent orchestration
- LLM and agent evaluation
- tool design and MCP integration
- frontend UI/UX development with React and Tailwind CSS

Everything not directly useful to those flows was removed from the canonical `skills/` tree.

## Canonical Invocation Rules

Use the folder name as the canonical skill id.
Do not invent aliases in prompts when a real skill id exists.

Preferred invocation patterns by host:

- Claude-style: `Use prompt-engineering to improve this system prompt`
- `@` style: `@prompt-engineering improve this system prompt`
- slash style when supported: `/prompt-engineering improve this system prompt`
- plain fallback for generic LLMs: `Load skill prompt-engineering and optimize this prompt`

If a host does not support direct skill loading, copy the relevant `SKILL.md` into context and keep using the canonical skill id in the instruction.

## Skill Groups

### Prompting

- `prompt-engineering`
- `prompt-engineering-patterns`
- `prompt-library`
- `prompt-caching`

### RAG

- `rag-engineer`
- `llm-app-patterns`

### Context And Memory

- `context-agent`
- `context-compression`
- `context-fundamentals`
- `context-guardian`
- `context-optimization`
- `context7-auto-research`
- `memory-systems`
- `agent-memory-systems`
- `agent-memory-mcp`
- `hierarchical-agent-memory`

### Agents And Orchestration

- `ai-agents-architect`
- `autonomous-agent-patterns`
- `agent-orchestrator`
- `multi-agent-patterns`
- `computer-use-agents`
- `crewai`
- `langgraph`
- `langchain-architecture`
- `pydantic-ai`
- `claude-api`

### Evaluation

- `llm-evaluation`
- `llm-ops`
- `llm-structured-output`
- `agent-evaluation`

### Tooling

- `tool-design`
- `tool-use-guardian`
- `mcp-builder`
- `claude-code-expert`
- `ai-engineering-toolkit`

### Frontend Development

- `react-tailwind-ui-ux`

## Recommended Routing

Use this routing table when deciding which skill to load first.

| Task | Start with |
|------|------------|
| Improve a prompt or system message | `prompt-engineering` |
| Build a reusable prompt system | `prompt-engineering-patterns` |
| Build RAG | `rag-engineer` |
| Design end-to-end LLM app architecture | `llm-app-patterns` |
| Design an autonomous or tool-using agent | `ai-agents-architect` |
| Build multi-agent systems | `multi-agent-patterns` |
| Implement agents in LangGraph | `langgraph` |
| Implement agents in CrewAI | `crewai` |
| Implement agents in PydanticAI | `pydantic-ai` |
| Add memory or context retention | `agent-memory-systems` |
| Optimize context window usage | `context-optimization` |
| Evaluate quality of LLM outputs | `llm-evaluation` |
| Evaluate agent performance | `agent-evaluation` |
| Design tools/functions for agents | `tool-design` |
| Build MCP servers | `mcp-builder` |
| Build responsive React UI with Tailwind | `react-tailwind-ui-ux` |

## Compatibility Layer

Some older skill names were removed during cleanup. Use the compatibility map in `LLM_COMPATIBILITY.md` to translate old names to the current canonical set.

Rule:

- old name in prompt -> map to canonical name
- canonical name wins over historical naming
- prefer one skill id per concept

## Operational Guidance

- Prefer loading one primary skill and at most one or two supporting skills.
- Do not stack many overlapping skills for the same task.
- Use canonical names in plans, prompts, and agent instructions.
- When documenting workflows, reference only skills that still exist in this directory.

## Minimal Starter Set

If you want the smallest useful subset for daily programming LLM work, start with:

- `prompt-engineering`
- `rag-engineer`
- `context-optimization`
- `agent-memory-systems`
- `ai-agents-architect`
- `multi-agent-patterns`
- `llm-evaluation`
- `tool-design`
- `mcp-builder`

## See Also

- `LLM_COMPATIBILITY.md` - alias map and cross-LLM invocation guidance
- `workflow_bundles_readme.md` - LLM-only workflow bundles
