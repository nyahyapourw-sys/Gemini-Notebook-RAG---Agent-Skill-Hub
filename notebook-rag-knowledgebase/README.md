# Autonomous Notebook RAG Knowledge Base (`notebook-rag-knowledgebase`)

A multi-platform Agent Skill and autonomous RAG playbook that connects **Google Gemini**, **Anthropic Claude**, and **OpenAI ChatGPT** to **Google NotebookLM (Gemini Notebook)** and private knowledge bases.

Built to be **100% compatible across Gemini, Claude, and ChatGPT** without vendor lock-in.

---

## 🧭 Platform Compatibility Matrix

| Platform / Agent | Native File | How It Integrates |
| :--- | :--- | :--- |
| **Google Gemini** (Gemini CLI / Antigravity) | `SKILL.md` | `gemini skills install <repo-url>` or drop in `~/.gemini/skills/` |
| **Anthropic Claude** (Claude Code / Desktop / Projects) | `CLAUDE.md`, `mcp.json` | Drop `CLAUDE.md` in project root or add MCP server to `claude_desktop_config.json` |
| **OpenAI ChatGPT** (Custom GPTs / Assistants) | `gpt-instructions.md`, `openapi.yaml` | Paste into Custom GPT Instructions + import OpenAPI Action schema |
| **Universal Agents** (Cursor, Windsurf, Codex) | `AGENTS.md` | Universal agent root directive |

---

## ✨ Autonomous Capabilities

- **Dynamic Notebook Routing:** Automatically discovers notebooks (`list_notebooks`) and queries the relevant ones while caching IDs.
- **Dense Query Decomposition:** Converts conversational questions into 2–4 orthogonal, keyword-dense sub-queries before calling retrieval.
- **Two-Hop Discovery:** Discovers internal codenames, acronyms, or specific documents in initial chunks and executes targeted follow-up passes.
- **Conflict & Recency Resolution:** Distinguishes between older drafts and newer specs (e.g. `v1` vs. `v2`), explicitly noting contradictions.
- **Strict Grounding & Epistemic Separation:** Inline citations `[Notebook: ... | Source: ...]` with zero hallucination, and external pre-trained knowledge quarantined in labeled callout blocks.

---

## 🚀 Setup Guides

### 1. 🔵 Google Gemini (Gemini CLI & Google Antigravity)

#### Install via Gemini CLI:
```bash
gemini skills install https://github.com/<your-username>/notebook-rag-knowledgebase.git
```
Or for local workspace scope:
```bash
gemini skills install https://github.com/<your-username>/notebook-rag-knowledgebase.git --scope workspace
```

#### Manual Installation:
```bash
git clone https://github.com/<your-username>/notebook-rag-knowledgebase.git ~/.gemini/skills/notebook-rag-knowledgebase
gemini skills list
```

---

### 2. 🟣 Anthropic Claude (Claude Code, Projects & Desktop)

#### For Claude Code (CLI):
Place `CLAUDE.md` in the root of your project or repository. Claude Code will automatically ingest these instructions at session start.

#### For Claude Projects:
1. Open your **Claude Project** at [claude.ai](https://claude.ai).
2. Copy the contents of `CLAUDE.md` into the **Project Instructions** field.
3. Upload `references/query-decomposition-patterns.md` and `assets/synthesis-templates.md` into Project Knowledge.

#### For Claude Desktop via MCP (Model Context Protocol):
Add the configuration from `mcp.json` to your `claude_desktop_config.json`:
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
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
```

---

### 3. 🟢 OpenAI ChatGPT & Custom GPTs

#### For ChatGPT Custom GPTs:
1. Navigate to [chatgpt.com/gpts/editor](https://chatgpt.com/gpts/editor).
2. Copy the contents of `gpt-instructions.md` into the **Instructions** box.
3. Under **Actions**, click **Create new action** and import `openapi.yaml`.
4. Configure Authentication using your NotebookLM API Key / Bearer token.

#### For OpenAI Assistants / Codex:
Paste the text in `gpt-instructions.md` into the `instructions` parameter of your Assistant.

---

## 📂 Repository Structure

```text
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
```

---

## 💡 Example Cross-Platform Prompts

These prompts trigger autonomous RAG in Gemini, Claude, and ChatGPT:

- **Fact Lookup:** *"Check my notebooks for our API rate-limiting rules and authentication headers."*
- **Literature Review:** *"Search my research notebooks on distributed consensus and create a comparison table of Raft vs. Paxos based on my saved papers."*
- **Compliance Audit:** *"Consult my 'Security Guidelines' notebook and audit my current auth implementation for any missing requirements."*

---

## 📄 License

MIT
