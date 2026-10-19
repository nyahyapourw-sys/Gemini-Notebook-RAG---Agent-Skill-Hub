# Grounded Synthesis Output Templates

Use these structures when the user requests a comprehensive briefing, comparison, or audit from their notebooks.

## Template 1: Executive Research Briefing
```markdown
### Summary
[2–3 sentence direct answer grounded in retrieved chunks]

### Key Findings
- **[Theme/Point 1]:** [Detailed synthesis] `[Notebook: X | Source: Y]`
- **[Theme/Point 2]:** [Detailed synthesis] `[Notebook: X | Source: Z]`

### Cross-Source Comparison (If Applicable)
| Dimension / Topic | Source A (`[Title]`) | Source B (`[Title]`) | Status / Consensus |
| :--- | :--- | :--- | :--- |
| ... | ... | ... | Aligned / Contradicts |

### Knowledge Gaps
- **Documented:** [What the notebooks confirm]
- **Not Found in Notebooks:** [Specific aspects of the prompt not covered by current sources]
```

## Template 2: Notebook vs. Workspace Gap Analysis
```markdown
### Grounded Audit Results
| Requirement / Concept (from Notebook) | Source Reference | Current Status / Coverage | Action Required |
| :--- | :--- | :--- | :--- |
| [Requirement 1] | `[Notebook: X \| Source: Y]` | ✅ Aligned / ⚠️ Partial / ❌ Missing | [Specific recommendation] |
```
