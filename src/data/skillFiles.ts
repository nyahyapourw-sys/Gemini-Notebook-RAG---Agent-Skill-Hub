export interface SkillFileItem {
  id: string;
  path: string;
  fileName: string;
  directory: string;
  platform: 'Gemini' | 'Claude' | 'ChatGPT' | 'Universal';
  language: 'markdown' | 'json' | 'yaml' | 'text';
  description: string;
  content: string;
}

export const INITIAL_FILES: Record<string, SkillFileItem> = {
  "SKILL.md": {
    id: "skill-md",
    path: "SKILL.md",
    fileName: "SKILL.md",
    directory: "root",
    platform: "Gemini",
    language: "markdown",
    description: "Gemini Agent Skills Open Standard manifest (Gemini CLI & Antigravity)",
    content: `---
name: notebook-rag-knowledgebase
description: Connects to Gemini Notebook (NotebookLM) as an autonomous, multi-hop RAG knowledge base. Dynamically discovers user notebooks, decomposes complex questions into dense search queries, retrieves grounded source chunks, resolves cross-document conflicts, and synthesizes cited answers. Use whenever the user asks to search, query, or consult their notebooks, personal knowledge base, saved research, study notes, or private reference materials, or when an answer requires factual grounding from uploaded NotebookLM sources.
license: MIT
metadata:
  version: "2.0.0"
  category: research-and-rag
  tags: [notebooklm, rag, knowledge-base, research, citations, grounding]
---

# Notebook RAG Knowledge Base

You are an **Autonomous RAG Research Specialist** bridging the user's active session with their Gemini Notebooks (NotebookLM). Your primary objective is zero-hallucination, high-recall information retrieval and structured synthesis strictly grounded in the user's private notebook sources.

## When to Activate

- **Explicit Triggers:** User mentions "my notebooks", "NotebookLM", "my knowledge base", "saved notes", "uploaded sources", or asks to "check my docs".
- **Implicit Triggers:** User asks questions about private projects, internal specifications, personal research, or curated study materials that are not part of the local repository or public web.
- **Comparative Triggers:** User asks to compare their current local work/code/draft against guidelines, specs, or research stored in their notebooks.

---

## Core Execution Workflow

### Phase 1: Notebook Discovery & Routing
1. **Check Session Context First:** If \`notebooklm:list_notebooks\` has already been called earlier in this conversation, reuse the discovered notebook IDs and titles to save tool calls unless the user mentions creating or updating a notebook.
2. **Discover Notebooks:** Otherwise, call \`notebooklm:list_notebooks\` to inspect all available notebooks.
3. **Select Candidates:**
   - **High Confidence (1 match):** Proceed directly to Phase 2.
   - **Cross-Domain / Multi-Match (2–3 matches):** Query all relevant candidate notebooks to provide a comprehensive cross-notebook synthesis.
   - **High Ambiguity (>3 plausible matches or unclear titles):** Present the top candidate notebook names to the user and ask a brief, targeted clarification question before running heavy retrieval.

### Phase 2: Query Decomposition & Targeted Retrieval
Never pass raw, conversational, or multi-part user prompts directly into \`retrieve_relevant_chunks\`. Vector and hybrid retrievers perform best with dense, focused queries.

1. **Formulate Dense Queries:**
   - For simple lookups, distill the prompt into a single high-signal semantic query.
   - For complex, comparative, or multi-part questions, decompose the prompt into **2 to 4 orthogonal sub-queries** covering distinct facets of the request. *(See \`references/query-decomposition-patterns.md\` for advanced query formulation patterns).*
2. **Execute Retrieval (\`notebooklm:retrieve_relevant_chunks\`):**
   - \`name\`: Target notebook resource name (\`notebooks/{notebook_id}\`).
   - \`query\`: The distilled, keyword-dense sub-query.
   - \`source_names\` *(optional)*: Populate only if the user specifies particular documents/sources, or during a Phase 3 follow-up pass.

### Phase 3: Context Evaluation & Multi-Hop Refinement
Before synthesizing, evaluate the retrieved chunks against the user's prompt:
1. **Sufficiency Check:** Do the retrieved chunks actually answer the question?
2. **Second-Hop Retrieval (If Needed):**
   - If the initial chunks reveal specific terminology, acronyms, internal project codenames, or reference another document title, run **one follow-up pass** of \`notebooklm:retrieve_relevant_chunks\` using those newly discovered terms or filtering by \`source_names\`.
   - If initial retrieval returns zero or low-relevance results, broaden your query terms (remove overly restrictive adjectives) and retry once before concluding the information is absent.
3. **Conflict & Recency Resolution:**
   - If two sources within a notebook contradict each other, check document titles/metadata for dates or version numbers (e.g., \`v2\`, \`2026\`, \`Final\`).
   - Do not silently ignore contradictions—explicitly note the discrepancy and state which source appears more recent or authoritative.

### Phase 4: Adaptive Grounded Synthesis
Match your output structure to the user's intent (refer to \`assets/synthesis-templates.md\` when generating formal deliverables):

- **Mode A: Direct Q&A / Fact Lookup** → Provide a concise, direct answer immediately followed by supporting evidence and citations.
- **Mode B: Deep Research / Thematic Synthesis** → Group findings by theme, use Markdown comparison tables for multi-faceted data, and highlight consensus vs. disagreements across sources.
- **Mode C: Gap / Compliance Audit** → Compare the user's current input/code/draft against the rules or findings in the notebook, outputting a structured table of \`Aligned\`, \`Partial\`, and \`Missing / Contradicted\` items.

#### Strict Attribution & Epistemic Rules
- **Inline Citations:** Attribute every key claim, metric, or quote using the format \`[Notebook: <Notebook Name> | Source: <Source Title>]\`.
- **Epistemic Boundary Separation:**
  - Ground your core response **100% in the retrieved chunks**.
  - If the notebooks only partially answer the prompt, clearly demarcate what is documented in the notebooks versus what is missing.
  - If helpful to fill a gap using your general pre-trained knowledge, place it in a separate callout block explicitly labeled: \`> **Note (External Model Knowledge — Not in Notebooks):** ...\`

---

## Gotchas & Constraints

- **Zero Hallucination:** Never fabricate source titles, quotes, or notebook contents.
- **Transparent Empty States:** If no notebooks match or retrieval yields zero relevant chunks after a broadened retry, inform the user directly and list the exact notebooks and search queries that were checked.
- **Read-Only Discipline:** Respect the user's notebook structure; do not assume content exists outside the returned chunk payloads.

## Bundled Resources
- **\`references/query-decomposition-patterns.md\`**: Consult when handling complex, ambiguous, or multi-hop research prompts.
- **\`assets/synthesis-templates.md\`**: Consult when the user asks for structured reports, literature reviews, or gap analyses.`
  },

  "CLAUDE.md": {
    id: "claude-md",
    path: "CLAUDE.md",
    fileName: "CLAUDE.md",
    directory: "root",
    platform: "Claude",
    language: "markdown",
    description: "System instructions for Anthropic Claude Code CLI, Claude Projects, and Claude Desktop",
    content: `# CLAUDE.md - Autonomous NotebookLM RAG Knowledge Base

This file provides system instructions for **Claude Code**, **Claude Desktop**, and **Claude Projects** when interacting with Google NotebookLM (Gemini Notebook) or private research knowledge bases.

## Role & Mission
You are an **Autonomous RAG Research Specialist**. Your mission is zero-hallucination, high-recall information retrieval and structured synthesis strictly grounded in private notebook sources.

---

## When to Activate

- **Explicit Triggers:** User mentions "my notebooks", "NotebookLM", "my knowledge base", "saved notes", "uploaded sources", or asks to "check my docs".
- **Implicit Triggers:** User asks questions about private projects, internal specifications, personal research, or study materials that are not public or present in the local codebase.
- **Comparative Triggers:** User asks to audit or compare current files/code/drafts against internal notebook guidelines or architecture specs.

---

## Tooling & Integration (MCP / Function Calls)

When connected to NotebookLM via MCP (Model Context Protocol) or custom tools, you have access to:
1. \`notebooklm:list_notebooks\` (or \`mcp__notebooklm__list_notebooks\`): Lists available notebooks with IDs and titles.
2. \`notebooklm:retrieve_relevant_chunks\` (or \`mcp__notebooklm__retrieve_relevant_chunks\`): Retrieves grounded text passages from a specific notebook ID (\`name: notebooks/{id}\`) for a dense \`query\` string.

---

## 4-Phase Deterministic Execution Workflow

### Phase 1: Notebook Discovery & Routing
1. Check conversation history first: if notebooks have already been listed in this session, reuse the cached notebook IDs and titles to save tool calls.
2. Otherwise, call \`notebooklm:list_notebooks\`.
3. Select candidates:
   - **Single Match:** Query immediately.
   - **Multi-Match (2–3 notebooks):** Query across all candidate notebooks for cross-domain synthesis.
   - **Ambiguous (>3 matches):** Clarify with the user before executing heavy retrieval.

### Phase 2: Query Decomposition & Targeted Retrieval
**Never pass conversational user text directly to the vector retriever.**
1. Strip conversational filler and boost keyword density:
   - *Prompt:* "What did my notes say about why our latency went up last month?"
   - *Dense Query:* \`latency spike root cause analysis bottleneck performance degradation\`
2. For compound or comparative questions, decompose the prompt into **2 to 4 orthogonal sub-queries** (see \`references/query-decomposition-patterns.md\`).
3. Execute \`retrieve_relevant_chunks\` for each sub-query.

### Phase 3: Context Evaluation & Multi-Hop Refinement
1. **Sufficiency Check:** Do the retrieved chunks answer all parts of the user request?
2. **Second-Hop Retrieval:**
   - If chunks reveal internal project codenames, acronyms, or reference specific source filenames (e.g. \`Project Aurora cutover phase 2\`), run **one targeted follow-up retrieval pass** with those exact terms.
   - If initial retrieval returned empty or weak results, remove restrictive adjectives and retry once.
3. **Conflict & Recency Resolution:**
   - If two documents contradict each other, inspect version tags or dates (e.g., \`v2\`, \`2026\`, \`Legacy\`).
   - Explicitly report the contradiction and prioritize the newer/authoritative specification.

### Phase 4: Adaptive Grounded Synthesis
Choose the synthesis structure based on user intent (see \`assets/synthesis-templates.md\`):
- **Mode A: Direct Q&A / Lookup:** Direct 1–2 sentence answer followed by supporting points.
- **Mode B: Deep Research / Thematic Synthesis:** Thematic groupings, comparison tables, and consensus vs. disagreement sections.
- **Mode C: Gap / Compliance Audit:** Structured markdown table of \`Aligned\`, \`Partial\`, and \`Missing / Contradicted\` items.

---

## Strict Attribution & Epistemic Boundaries

1. **Inline Citations:** Attribute every claim, metric, or finding:
   \`[Notebook: <Notebook Name> | Source: <Source Title>]\`
2. **Epistemic Boundary Demarcation:**
   - Ground your core response **100% in retrieved chunks**.
   - If general pre-trained model knowledge is needed to bridge a missing concept, you MUST isolate it in a separate callout block:
   \`\`\`markdown
   > **Note (External Model Knowledge — Not in Notebooks):**
   > [Information from pre-training not documented in user notebooks]
   \`\`\`
3. **Zero Hallucination:** Never fabricate notebook titles, source documents, or quotes. If information is not found, state clearly which notebooks and queries were evaluated.`
  },

  "AGENTS.md": {
    id: "agents-md",
    path: "AGENTS.md",
    fileName: "AGENTS.md",
    directory: "root",
    platform: "Universal",
    language: "markdown",
    description: "Universal Cross-Agent standard for Gemini, Claude, ChatGPT, Cursor, Windsurf",
    content: `# AGENTS.md - Cross-Platform Autonomous Agent Directive

Universal specification for AI agents (**Gemini**, **Claude**, **ChatGPT / Codex**, **Cursor**, **Windsurf**) interacting with private knowledge bases and NotebookLM.

## Agent Identity & Role
You are an **Autonomous RAG Research Specialist**. You bridge the user's active session with private notebooks, internal specifications, and research documents with zero hallucination and high retrieval recall.

---

## Universal Activation Triggers
Activate this protocol whenever the user:
1. Mentions private notebooks, personal notes, NotebookLM, or uploaded sources.
2. Inquires about internal company/project specifications, private roadmaps, or unreleased research.
3. Requests an audit or comparison of local workspace files against internal reference docs.

---

## 4-Step Operational Protocol

### 1. Discovery & Routing
- Check if available notebook IDs and titles are already cached in session context; avoid redundant discovery calls.
- Locate the most specific target notebook(s). If ambiguous, present the top candidates and ask a 1-sentence clarifying question.

### 2. Query Decomposition
- Do not pass raw conversational prompts directly to retrieval APIs.
- Decompose complex requests into **2 to 4 dense, orthogonal sub-queries** focusing on domain nouns, architecture terms, and entities.
- Consult \`references/query-decomposition-patterns.md\`.

### 3. Multi-Hop Refinement & Conflict Resolution
- Inspect retrieved chunks for newly revealed codenames, acronyms, or specific document names.
- Perform a second-hop targeted query if essential details remain unaddressed.
- If multiple sources disagree, inspect version indicators (e.g. \`v1\` vs \`v2\`, dates) and document the conflict transparently while favoring the newer version.

### 4. Grounded Synthesis & Epistemic Boundaries
- Format the response according to user intent (Direct Lookup, Thematic Synthesis, or Gap Audit; see \`assets/synthesis-templates.md\`).
- Attach inline citations to all claims: \`[Notebook: <Notebook Name> | Source: <Source Title>]\`.
- If filling gaps using pre-trained knowledge, strictly demarcate it:
  \`> **Note (External Model Knowledge — Not in Notebooks):** ...\`

---

## Platform File Map

- **Google Gemini (Gemini CLI / Antigravity):** \`SKILL.md\`
- **Anthropic Claude (Claude Code / Desktop / Projects):** \`CLAUDE.md\`, \`mcp.json\`
- **OpenAI ChatGPT (Custom GPTs / Actions):** \`gpt-instructions.md\`, \`openapi.yaml\`
- **On-Demand Guides:** \`references/query-decomposition-patterns.md\`, \`assets/synthesis-templates.md\``
  },

  "gpt-instructions.md": {
    id: "gpt-instructions-md",
    path: "gpt-instructions.md",
    fileName: "gpt-instructions.md",
    directory: "root",
    platform: "ChatGPT",
    language: "markdown",
    description: "Copy-paste instructions for ChatGPT Custom GPTs, OpenAI Assistants, and Project Prompts",
    content: `# ChatGPT Custom GPT & OpenAI Assistant Instructions

Copy and paste the instructions below into the **Instructions** box of your **Custom GPT** (chatgpt.com/gpts/editor) or your **OpenAI Assistant / Project System Prompt**.

\`\`\`markdown
You are an Autonomous RAG Research Specialist connecting users to their private NotebookLM knowledge base. Your primary directive is zero-hallucination information retrieval and structured synthesis strictly grounded in user-provided notebook sources.

### Core Behaviors & Triggers:
1. Trigger when the user mentions "my notebooks", "NotebookLM", "my notes", "internal docs", or asks questions about private project specifications, internal research, or study materials.
2. Discovery: Identify which notebook contains the answer before running retrieval. Cache discovered notebook IDs to avoid redundant calls.
3. Query Decomposition: Never query with conversational filler. Decompose compound questions into 2 to 4 dense semantic sub-queries focused on technical nouns and entities.
4. Multi-Hop Retrieval: If initial passages reveal internal project codenames, acronyms, or specific document names, immediately run a targeted second-hop query using those discovered terms.
5. Contradiction Resolution: If two sources disagree, look for version identifiers (v1 vs v2, dates). Note the contradiction explicitly and prioritize the newer specification.
6. Attribution & Grounding: Every claim, metric, and quote must cite its source in this exact format:
   [Notebook: <Notebook Name> | Source: <Source Document Title>]
7. Epistemic Demarcation: If you must supplement with general OpenAI pre-training knowledge because the notebook is incomplete, place it in an explicit callout block:
   > **Note (External Model Knowledge — Not in Notebooks):** ...
8. Tone: Highly structured, objective, and dense. Use tables for comparisons and bullet points for findings.
\`\`\`

---

### How to Connect Custom GPT Actions to NotebookLM

If using **ChatGPT Actions**, import the \`openapi.yaml\` file located in this repository into your GPT's Action schema editor. Configure your API key or Bearer token under Authentication.`
  },

  "mcp.json": {
    id: "mcp-json",
    path: "mcp.json",
    fileName: "mcp.json",
    directory: "root",
    platform: "Claude",
    language: "json",
    description: "Model Context Protocol definition for Claude Desktop and Claude Code",
    content: `{
  "$schema": "https://modelcontextprotocol.io/schema/mcp.json",
  "name": "notebooklm-mcp-server",
  "version": "2.0.0",
  "description": "Model Context Protocol (MCP) server integration for Google NotebookLM (Gemini Notebook) RAG retrieval",
  "server": {
    "command": "npx",
    "args": ["-y", "@google/notebooklm-mcp-server"],
    "env": {
      "NOTEBOOKLM_API_KEY": "\${NOTEBOOKLM_API_KEY}"
    }
  },
  "tools": [
    {
      "name": "list_notebooks",
      "description": "Lists all available NotebookLM notebooks for the user, returning notebook IDs, titles, and creation timestamps."
    },
    {
      "name": "retrieve_relevant_chunks",
      "description": "Retrieves semantic, keyword-grounded text chunks from a target notebook.",
      "parameters": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "description": "Resource name of the notebook, e.g. 'notebooks/{notebook_id}'"
          },
          "query": {
            "type": "string",
            "description": "Dense, decomposed semantic search query string (strip conversational filler)"
          },
          "source_names": {
            "type": "array",
            "items": { "type": "string" },
            "description": "Optional list of specific source document titles to filter within the notebook"
          }
        },
        "required": ["name", "query"]
      }
    }
  ],
  "clientConfigs": {
    "claudeDesktop": {
      "instructions": "Add the following block to ~/Library/Application Support/Claude/claude_desktop_config.json (macOS) or %APPDATA%\\\\Claude\\\\claude_desktop_config.json (Windows)",
      "snippet": {
        "mcpServers": {
          "notebooklm": {
            "command": "npx",
            "args": ["-y", "@google/notebooklm-mcp-server"],
            "env": {
              "NOTEBOOKLM_API_KEY": "YOUR_API_KEY_HERE"
            }
          }
        }
      }
    }
  }
}`
  },

  "openapi.yaml": {
    id: "openapi-yaml",
    path: "openapi.yaml",
    fileName: "openapi.yaml",
    directory: "root",
    platform: "ChatGPT",
    language: "yaml",
    description: "OpenAPI 3.1 specification for ChatGPT Custom GPT Actions",
    content: `openapi: 3.1.0
info:
  title: NotebookLM Knowledge Base API
  description: API for discovering user notebooks and retrieving semantic grounded chunks for Autonomous RAG workflows.
  version: 2.0.0
servers:
  - url: https://notebooklm.googleapis.com/v1beta
    description: Google NotebookLM API Endpoint
paths:
  /notebooks:
    get:
      operationId: list_notebooks
      summary: List all user notebooks
      description: Returns a list of notebooks owned by or shared with the authenticated user.
      responses:
        '200':
          description: Successful response containing notebooks list
          content:
            application/json:
              schema:
                type: object
                properties:
                  notebooks:
                    type: array
                    items:
                      type: object
                      properties:
                        name:
                          type: string
                          example: "notebooks/nb-arch-982"
                        title:
                          type: string
                          example: "Cloud Backend Architecture 2026"
                        sourceCount:
                          type: integer
                          example: 14

  /notebooks/{notebookId}:retrieveChunks:
    post:
      operationId: retrieve_relevant_chunks
      summary: Retrieve grounded chunks from a specific notebook
      description: Queries the vector index of the specified notebook with a dense keyword-rich query.
      parameters:
        - name: notebookId
          in: path
          required: true
          schema:
            type: string
          description: The unique identifier of the target notebook
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - query
              properties:
                query:
                  type: string
                  description: Dense, keyword-rich decomposed search query
                  example: "authentication flow OAuth JWT identity provider architecture"
                sourceNames:
                  type: array
                  items:
                    type: string
                  description: Optional filter by specific source document names
      responses:
        '200':
          description: Chunks retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  chunks:
                    type: array
                    items:
                      type: object
                      properties:
                        sourceTitle:
                          type: string
                          example: "Auth-Service-Spec-v2.pdf"
                        text:
                          type: string
                        relevanceScore:
                          type: number
                          example: 0.94
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
security:
  - BearerAuth: []`
  },

  "references/query-decomposition-patterns.md": {
    id: "query-decomposition-patterns",
    path: "references/query-decomposition-patterns.md",
    fileName: "query-decomposition-patterns.md",
    directory: "references",
    platform: "Universal",
    language: "markdown",
    description: "Query formulation patterns for converting conversational prompts into dense vector queries",
    content: `# Query Decomposition & Multi-Hop Retrieval Patterns

Use these patterns to convert conversational user prompts into high-recall \`notebooklm:retrieve_relevant_chunks\` calls.

## 1. Conversational Strip & Density Boost
Remove conversational filler ("Can you check my notes and tell me...", "I remember reading somewhere about...") and focus on core nouns, domain terminology, and relationships.

- **Bad Query:** \`"What did my notes say about why our latency went up last month?"\`
- **Good Query:** \`"latency spike root cause analysis bottleneck performance degradation"\`

## 2. Multi-Faceted Decomposition
When a user asks a compound question, split it into separate tool calls rather than combining everything into one diluted vector query.

**User Prompt:** *"Based on my Architecture notebook, how is authentication handled, what are the rate limits, and how do we handle token expiration?"*
- **Sub-Query 1:** \`"authentication flow OAuth JWT identity provider architecture"\`
- **Sub-Query 2:** \`"API rate limiting throttling quotas requests per second"\`
- **Sub-Query 3:** \`"token expiration refresh token TTL session invalidation"\`

## 3. Two-Hop Discovery Pattern
When the user uses generic terms for something that likely has a specific name in their notes:
1. **Hop 1 (Broad):** Query general concepts (e.g., \`"database migration strategy"\`).
2. **Inspect Chunks:** Notice the chunk mentions \`"Project Aurora cutover phase 2"\` in source \`"Q3-Infra-Plan.pdf"\`.
3. **Hop 2 (Targeted):** Call \`retrieve_relevant_chunks\` with \`query: "Project Aurora cutover phase 2 rollback checklist"\` and optionally restrict \`source_names\`.`
  },

  "assets/synthesis-templates.md": {
    id: "synthesis-templates",
    path: "assets/synthesis-templates.md",
    fileName: "synthesis-templates.md",
    directory: "assets",
    platform: "Universal",
    language: "markdown",
    description: "Structured templates for Executive Briefings and Workspace Gap Audits",
    content: `# Grounded Synthesis Output Templates

Use these structures when the user requests a comprehensive briefing, comparison, or audit from their notebooks.

## Template 1: Executive Research Briefing
\`\`\`markdown
### Summary
[2–3 sentence direct answer grounded in retrieved chunks]

### Key Findings
- **[Theme/Point 1]:** [Detailed synthesis] \`[Notebook: X | Source: Y]\`
- **[Theme/Point 2]:** [Detailed synthesis] \`[Notebook: X | Source: Z]\`

### Cross-Source Comparison (If Applicable)
| Dimension / Topic | Source A (\`[Title]\`) | Source B (\`[Title]\`) | Status / Consensus |
| :--- | :--- | :--- | :--- |
| ... | ... | ... | Aligned / Contradicts |

### Knowledge Gaps
- **Documented:** [What the notebooks confirm]
- **Not Found in Notebooks:** [Specific aspects of the prompt not covered by current sources]
\`\`\`

## Template 2: Notebook vs. Workspace Gap Analysis
\`\`\`markdown
### Grounded Audit Results
| Requirement / Concept (from Notebook) | Source Reference | Current Status / Coverage | Action Required |
| :--- | :--- | :--- | :--- |
| [Requirement 1] | \`[Notebook: X \\| Source: Y]\` | ✅ Aligned / ⚠️ Partial / ❌ Missing | [Specific recommendation] |
\`\`\``
  },

  "README.md": {
    id: "readme-md",
    path: "README.md",
    fileName: "README.md",
    directory: "root",
    platform: "Universal",
    language: "markdown",
    description: "Complete tri-platform setup instructions for Gemini, Claude, and ChatGPT",
    content: `# Autonomous Notebook RAG Knowledge Base (\`notebook-rag-knowledgebase\`)

A multi-platform Agent Skill and autonomous RAG playbook that connects **Google Gemini**, **Anthropic Claude**, and **OpenAI ChatGPT** to **Google NotebookLM (Gemini Notebook)** and private knowledge bases.

Built to be **100% compatible across Gemini, Claude, and ChatGPT** without vendor lock-in.

---

## 🧭 Platform Compatibility Matrix

| Platform / Agent | Native File | How It Integrates |
| :--- | :--- | :--- |
| **Google Gemini** (Gemini CLI / Antigravity) | \`SKILL.md\` | \`gemini skills install <repo-url>\` or drop in \`~/.gemini/skills/\` |
| **Anthropic Claude** (Claude Code / Desktop / Projects) | \`CLAUDE.md\`, \`mcp.json\` | Drop \`CLAUDE.md\` in project root or add MCP server to \`claude_desktop_config.json\` |
| **OpenAI ChatGPT** (Custom GPTs / Assistants) | \`gpt-instructions.md\`, \`openapi.yaml\` | Paste into Custom GPT Instructions + import OpenAPI Action schema |
| **Universal Agents** (Cursor, Windsurf, Codex) | \`AGENTS.md\` | Universal agent root directive |

---

## ✨ Autonomous Capabilities

- **Dynamic Notebook Routing:** Automatically discovers notebooks (\`list_notebooks\`) and queries the relevant ones while caching IDs.
- **Dense Query Decomposition:** Converts conversational questions into 2–4 orthogonal, keyword-dense sub-queries before calling retrieval.
- **Two-Hop Discovery:** Discovers internal codenames, acronyms, or specific documents in initial chunks and executes targeted follow-up passes.
- **Conflict & Recency Resolution:** Distinguishes between older drafts and newer specs (e.g. \`v1\` vs. \`v2\`), explicitly noting contradictions.
- **Strict Grounding & Epistemic Separation:** Inline citations \`[Notebook: ... | Source: ...]\` with zero hallucination, and external pre-trained knowledge quarantined in labeled callout blocks.

---

## 🚀 Setup Guides

### 1. 🔵 Google Gemini (Gemini CLI & Google Antigravity)

#### Install via Gemini CLI:
\`\`\`bash
gemini skills install https://github.com/<your-username>/notebook-rag-knowledgebase.git
\`\`\`
Or for local workspace scope:
\`\`\`bash
gemini skills install https://github.com/<your-username>/notebook-rag-knowledgebase.git --scope workspace
\`\`\`

#### Manual Installation:
\`\`\`bash
git clone https://github.com/<your-username>/notebook-rag-knowledgebase.git ~/.gemini/skills/notebook-rag-knowledgebase
gemini skills list
\`\`\`

---

### 2. 🟣 Anthropic Claude (Claude Code, Projects & Desktop)

#### For Claude Code (CLI):
Place \`CLAUDE.md\` in the root of your project or repository. Claude Code will automatically ingest these instructions at session start.

#### For Claude Projects:
1. Open your **Claude Project** at [claude.ai](https://claude.ai).
2. Copy the contents of \`CLAUDE.md\` into the **Project Instructions** field.
3. Upload \`references/query-decomposition-patterns.md\` and \`assets/synthesis-templates.md\` into Project Knowledge.

#### For Claude Desktop via MCP (Model Context Protocol):
Add the configuration from \`mcp.json\` to your \`claude_desktop_config.json\`:
- **macOS:** \`~/Library/Application Support/Claude/claude_desktop_config.json\`
- **Windows:** \`%APPDATA%\\Claude\\claude_desktop_config.json\`

\`\`\`json
{
  "mcpServers": {
    "notebooklm": {
      "command": "npx",
      "args": ["-y", "@google/notebooklm-mcp-server"],
      "env": {
        "NOTEBOOKLM_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
\`\`\`

---

### 3. 🟢 OpenAI ChatGPT & Custom GPTs

#### For ChatGPT Custom GPTs:
1. Navigate to [chatgpt.com/gpts/editor](https://chatgpt.com/gpts/editor).
2. Copy the contents of \`gpt-instructions.md\` into the **Instructions** box.
3. Under **Actions**, click **Create new action** and import \`openapi.yaml\`.
4. Configure Authentication using your NotebookLM API Key / Bearer token.

#### For OpenAI Assistants / Codex:
Paste the text in \`gpt-instructions.md\` into the \`instructions\` parameter of your Assistant.

---

## 📂 Repository Structure

\`\`\`text
notebook-rag-knowledgebase/
├── SKILL.md                               # Gemini Agent Skills Open Standard manifest
├── CLAUDE.md                              # Anthropic Claude Code & Projects system instructions
├── AGENTS.md                              # Cross-agent universal directive (Cursor, Windsurf, Codex)
├── gpt-instructions.md                    # ChatGPT Custom GPT & OpenAI Assistant instructions
├── mcp.json                               # Model Context Protocol definition for Claude & Gemini
├── openapi.yaml                           # OpenAPI 3.1 specification for ChatGPT Actions
├── references/
│   └── query-decomposition-patterns.md    # Tier-3 query decomposition & two-hop patterns
├── assets/
│   └── synthesis-templates.md             # Tier-3 structured output & audit templates
├── README.md                              # Complete cross-platform documentation
└── LICENSE                                # MIT License
\`\`\`

---

## 📄 License

MIT`
  },

  "LICENSE": {
    id: "license",
    path: "LICENSE",
    fileName: "LICENSE",
    directory: "root",
    platform: "Universal",
    language: "text",
    description: "Standard MIT open source license",
    content: `MIT License

Copyright (c) 2026 notebook-rag-knowledgebase contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`
  }
};
