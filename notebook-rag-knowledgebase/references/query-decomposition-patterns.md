# Query Decomposition & Multi-Hop Retrieval Patterns

Use these patterns to convert conversational user prompts into high-recall `notebooklm:retrieve_relevant_chunks` calls.

## 1. Conversational Strip & Density Boost
Remove conversational filler ("Can you check my notes and tell me...", "I remember reading somewhere about...") and focus on core nouns, domain terminology, and relationships.

- **Bad Query:** `"What did my notes say about why our latency went up last month?"`
- **Good Query:** `"latency spike root cause analysis bottleneck performance degradation"`

## 2. Multi-Faceted Decomposition
When a user asks a compound question, split it into separate tool calls rather than combining everything into one diluted vector query.

**User Prompt:** *"Based on my Architecture notebook, how is authentication handled, what are the rate limits, and how do we handle token expiration?"*
- **Sub-Query 1:** `"authentication flow OAuth JWT identity provider architecture"`
- **Sub-Query 2:** `"API rate limiting throttling quotas requests per second"`
- **Sub-Query 3:** `"token expiration refresh token TTL session invalidation"`

## 3. Two-Hop Discovery Pattern
When the user uses generic terms for something that likely has a specific name in their notes:
1. **Hop 1 (Broad):** Query general concepts (e.g., `"database migration strategy"`).
2. **Inspect Chunks:** Notice the chunk mentions `"Project Aurora cutover phase 2"` in source `"Q3-Infra-Plan.pdf"`.
3. **Hop 2 (Targeted):** Call `retrieve_relevant_chunks` with `query: "Project Aurora cutover phase 2 rollback checklist"` and optionally restrict `source_names`.
