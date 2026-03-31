# LLM Compatibility Guide

This file exists to make the skill set easier to use across different programming LLMs and agent hosts.

## Canonical Rule

Always use the real folder name as the skill id.

Examples:

- `prompt-engineering`
- `rag-engineer`
- `multi-agent-patterns`
- `agent-memory-systems`

## Cross-LLM Invocation Patterns

Use whichever syntax the host understands, but keep the same canonical skill id.

### Pattern 1: Plain language

`Use skill prompt-engineering to rewrite this system prompt.`

### Pattern 2: At-sign hosts

`@prompt-engineering rewrite this system prompt`

### Pattern 3: Slash hosts

`/prompt-engineering rewrite this system prompt`

### Pattern 4: Embedded agent instructions

`Load prompt-engineering and tool-design, then produce a tool-safe prompt plus JSON schema.`

## Compatibility Aliases

Map old names to the current canonical skill ids.

| Old name | Canonical replacement |
|----------|------------------------|
| `prompt-engineer` | `prompt-engineering` |
| `llm-prompt-optimizer` | `prompt-engineering` |
| `llm-application-dev-prompt-optimize` | `prompt-engineering` |
| `autonomous-agents` | `autonomous-agent-patterns` |
| `dispatching-parallel-agents` | `multi-agent-patterns` |
| `parallel-agents` | `multi-agent-patterns` |
| `subagent-driven-development` | `multi-agent-patterns` |
| `agent-orchestration-multi-agent-optimize` | `agent-orchestrator` |
| `llm-application-dev-ai-assistant` | `llm-app-patterns` |
| `context-window-management` | `context-optimization` |
| `conversation-memory` | `context-agent` or `agent-memory-systems` |
| `context-manager` | `context-agent` |
| `ai-agent-development` | `ai-agents-architect` |
| `ai-ml` | `llm-app-patterns` |

## Recommended Skill Combinations

### Prompt + Tooling

- `prompt-engineering`
- `tool-design`
- `tool-use-guardian`

### RAG Build

- `rag-engineer`
- `context-optimization`
- `prompt-caching`

### Agent Build

- `ai-agents-architect`
- `autonomous-agent-patterns`
- `agent-memory-systems`

### Multi-Agent System

- `multi-agent-patterns`
- `agent-orchestrator`
- `agent-evaluation`

### Framework-Specific Agent Build

- `langgraph` for graph/state workflows
- `crewai` for crew/task orchestration
- `pydantic-ai` for typed Python agents
- `langchain-architecture` for LangChain-based systems

## Low-Error Usage Rules

- Prefer one canonical skill id per concept.
- Do not reference deleted skill names in plans or prompts.
- If a host is weak at routing, specify the target skill explicitly.
- If a task is broad, route to `llm-app-patterns` first, then add one supporting skill.