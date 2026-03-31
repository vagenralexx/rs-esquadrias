# LLM Workflow Bundles

This file defines only the workflow bundles that still make sense for the curated programming-LLM skill set.

## Core Bundles

| Bundle | Description | Key Skills |
|--------|-------------|------------|
| `prompt-design` | Design, refine, and standardize prompts and system messages | prompt-engineering, prompt-engineering-patterns, prompt-library |
| `rag-build` | Build production RAG pipelines with retrieval, chunking, caching, and context control | rag-engineer, llm-app-patterns, prompt-caching, context-optimization |
| `agent-build` | Design autonomous or tool-using agents | ai-agents-architect, autonomous-agent-patterns, tool-design |
| `multi-agent-build` | Build orchestrated multi-agent systems with clear responsibilities | multi-agent-patterns, agent-orchestrator, agent-evaluation |
| `memory-and-context` | Add short-term, long-term, hierarchical, or MCP-backed memory | agent-memory-systems, memory-systems, agent-memory-mcp, hierarchical-agent-memory |
| `framework-langgraph` | Implement graph/state based agents in LangGraph | langgraph, ai-agents-architect, llm-structured-output |
| `framework-crewai` | Implement crew/task based agents in CrewAI | crewai, multi-agent-patterns, llm-structured-output |
| `framework-pydantic-ai` | Implement typed Python agents in PydanticAI | pydantic-ai, llm-app-patterns, tool-design |
| `evaluation` | Evaluate prompts, LLM outputs, and agent behavior | llm-evaluation, agent-evaluation, llm-ops |
| `mcp-tooling` | Design tools and expose them through MCP | mcp-builder, tool-design, tool-use-guardian |

## Fast Routing

| Need | First skill |
|------|-------------|
| Rewrite a prompt | `prompt-engineering` |
| Create a reusable prompt library | `prompt-library` |
| Build RAG | `rag-engineer` |
| Build one agent | `ai-agents-architect` |
| Build many agents | `multi-agent-patterns` |
| Add memory | `agent-memory-systems` |
| Optimize context window | `context-optimization` |
| Build MCP server | `mcp-builder` |
| Evaluate quality | `llm-evaluation` |

## Example Prompts

`Use rag-build to design a coding assistant with hybrid retrieval and prompt caching.`

`Use multi-agent-build to design planner, coder, and reviewer agents with handoff rules.`

`Use evaluation to define metrics for code quality, hallucination rate, and tool success.`
Use @wordpress-theme-development to create a custom WordPress theme
```

```
Use @rag-implementation to build a RAG system with vector search
```

```
Use @kubernetes-deployment to deploy application to Kubernetes
```

```
Use @web-security-testing to perform OWASP Top 10 assessment
```

```
Use @libreoffice-writer to convert DOCX documents to ODT format
```

## Structure

Each workflow bundle follows this structure:

```yaml
---
name: bundle-name
description: "Brief description"
source: personal
risk: safe
domain: domain-category
category: granular-workflow-bundle  # or consolidated-workflow-bundle
version: 1.0.0
---

# Bundle Name

## Overview
...

## When to Use This Workflow
...

## Workflow Phases
...

## Quality Gates
...

## Related Workflow Bundles
...
```

## Contributing

When creating new workflow bundles:

1. Identify common skill combinations
2. Document clear workflow phases
3. Provide copy-paste prompts
4. Define quality gates
5. Link related bundles

## License

Same as the parent project.
