---
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
1. **Check Session Context First:** If `notebooklm:list_notebooks` has already been called earlier in this conversation, reuse the discovered notebook IDs and titles to save tool calls unless the user mentions creating or updating a notebook.
2. **Discover Notebooks:** Otherwise, call `notebooklm:list_notebooks` to inspect all available notebooks.
3. **Select Candidates:**
   - **High Confidence (1 match):** Proceed directly to Phase 2.
   - **Cross-Domain / Multi-Match (2–3 matches):** Query all relevant candidate notebooks to provide a comprehensive cross-notebook synthesis.
   - **High Ambiguity (>3 plausible matches or unclear titles):** Present the top candidate notebook names to the user and ask a brief, targeted clarification question before running heavy retrieval.

### Phase 2: Query Decomposition & Targeted Retrieval
Never pass raw, conversational, or multi-part user prompts directly into `retrieve_relevant_chunks`. Vector and hybrid retrievers perform best with dense, focused queries.

1. **Formulate Dense Queries:**
   - For simple lookups, distill the prompt into a single high-signal semantic query.
   - For complex, comparative, or multi-part questions, decompose the prompt into **2 to 4 orthogonal sub-queries** covering distinct facets of the request. *(See `references/query-decomposition-patterns.md` for advanced query formulation patterns).*
2. **Execute Retrieval (`notebooklm:retrieve_relevant_chunks`):**
   - `name`: Target notebook resource name (`notebooks/{notebook_id}`).
   - `query`: The distilled, keyword-dense sub-query.
   - `source_names` *(optional)*: Populate only if the user specifies particular documents/sources, or during a Phase 3 follow-up pass.

### Phase 3: Context Evaluation & Multi-Hop Refinement
Before synthesizing, evaluate the retrieved chunks against the user's prompt:
1. **Sufficiency Check:** Do the retrieved chunks actually answer the question?
2. **Second-Hop Retrieval (If Needed):**
   - If the initial chunks reveal specific terminology, acronyms, internal project codenames, or reference another document title, run **one follow-up pass** of `notebooklm:retrieve_relevant_chunks` using those newly discovered terms or filtering by `source_names`.
   - If initial retrieval returns zero or low-relevance results, broaden your query terms (remove overly restrictive adjectives) and retry once before concluding the information is absent.
3. **Conflict & Recency Resolution:**
   - If two sources within a notebook contradict each other, check document titles/metadata for dates or version numbers (e.g., `v2`, `2026`, `Final`).
   - Do not silently ignore contradictions—explicitly note the discrepancy and state which source appears more recent or authoritative.

### Phase 4: Adaptive Grounded Synthesis
Match your output structure to the user's intent (refer to `assets/synthesis-templates.md` when generating formal deliverables):

- **Mode A: Direct Q&A / Fact Lookup** → Provide a concise, direct answer immediately followed by supporting evidence and citations.
- **Mode B: Deep Research / Thematic Synthesis** → Group findings by theme, use Markdown comparison tables for multi-faceted data, and highlight consensus vs. disagreements across sources.
- **Mode C: Gap / Compliance Audit** → Compare the user's current input/code/draft against the rules or findings in the notebook, outputting a structured table of `Aligned`, `Partial`, and `Missing / Contradicted` items.

#### Strict Attribution & Epistemic Rules
- **Inline Citations:** Attribute every key claim, metric, or quote using the format `[Notebook: <Notebook Name> | Source: <Source Title>]`.
- **Epistemic Boundary Separation:**
  - Ground your core response **100% in the retrieved chunks**.
  - If the notebooks only partially answer the prompt, clearly demarcate what is documented in the notebooks versus what is missing.
  - If helpful to fill a gap using your general pre-trained knowledge, place it in a separate callout block explicitly labeled: `> **Note (External Model Knowledge — Not in Notebooks):** ...`

---

## Gotchas & Constraints

- **Zero Hallucination:** Never fabricate source titles, quotes, or notebook contents.
- **Transparent Empty States:** If no notebooks match or retrieval yields zero relevant chunks after a broadened retry, inform the user directly and list the exact notebooks and search queries that were checked.
- **Read-Only Discipline:** Respect the user's notebook structure; do not assume content exists outside the returned chunk payloads.

## Bundled Resources
- **`references/query-decomposition-patterns.md`**: Consult when handling complex, ambiguous, or multi-hop research prompts.
- **`assets/synthesis-templates.md`**: Consult when the user asks for structured reports, literature reviews, or gap analyses.
