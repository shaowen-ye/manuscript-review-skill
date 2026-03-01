# Multi-Agent Academic Manuscript Review

A [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skill that simulates a panel of 6 expert reviewers to critique academic manuscripts before journal submission. Generates a bilingual (English-Chinese) annotated `.docx` file with color-coded, section-by-section reviews and a quantitative scoring matrix.

## What It Does

Give it a manuscript (docx, PDF, or pasted text), and it produces a professional review document where 6 specialized AI agents critique every section — from Title to Supplementary Materials — each scoring on a 1–10 scale calibrated to your target journal's standards.

### The 6-Agent Review Panel

| Agent | Role | Focus |
|-------|------|-------|
| **A** | Architecture Strategist 架构军师 | Structure, logic chain, internal consistency, narrative flow |
| **B** | Theory Mentor 理论导师 | Novelty, literature gaps, conceptual precision, significance |
| **C** | Methods & Stats Reviewer 方法统计审稿人 | Statistical rigor, reproducibility, effect sizes, ML feasibility |
| **D** | Application Advisor 应用保护顾问 | Practical relevance, management implications, policy connections |
| **E** | Journal Editor 期刊主编 | Journal fit, formatting compliance, impact, competitive positioning |
| **F** | Senior Collaborator 资深合作者 | Strategic positioning, vulnerability assessment, future directions |

Optional: **Agent ML** for quantitative-heavy papers (advanced statistics / machine learning specialist).

### Output Example

Each manuscript section gets:
- Bilingual text display (English original + Chinese translation)
- Color-coded review panels from each relevant agent
- Per-section scores with justification
- A final scoring matrix table (Agents × Sections)
- Prioritized improvement list (Critical / Major / Minor)

## Installation

### As a Claude Code Skill

Copy this directory to your Claude Code skills folder:

```bash
cp -r . ~/.claude/skills/manuscript-review
```

Or clone directly:

```bash
git clone https://github.com/Shaowen-Ye/manuscript-review-skill.git ~/.claude/skills/manuscript-review
```

### Dependencies

```bash
# Node.js docx package (for generating .docx output)
npm install docx

# Pandoc (optional, for converting .docx input to readable text)
brew install pandoc   # macOS
# or: apt install pandoc  # Linux
```

## Usage

In Claude Code, simply say:

```
审稿 my_paper.docx
```

or:

```
Please review my manuscript for PNAS submission
```

**Trigger phrases** (English or Chinese):
- "审稿", "多Agent审稿", "文稿审阅", "投稿前审阅", "逐段审稿"
- "manuscript review", "agent team review", "paper review panel"

### Configuration Options

When triggered, the skill will ask you to confirm:

1. **Target journal** — PNAS, Nature, Science, Ecology Letters, etc.
2. **Review depth** — Quick (1-2 sentences/agent) or Deep (4-6 sentences/agent, default)
3. **Additional agents** — Whether to include Agent ML
4. **Language pair** — Default English-Chinese, configurable
5. **Output file path**

## Scoring Calibration

Scores are calibrated to the **top 10% of accepted papers** at the target journal:

| Score | Meaning | Frequency |
|-------|---------|-----------|
| 9-10 | Exceptional — publish as-is | < 5% |
| 8 | Very good — minor revision only | ~10-15% |
| 7 | Good — solid work, 3-5 issues | ~20-25% |
| 5-6 | Adequate — needs significant revision | ~40-50% |
| 3-4 | Weak — fundamental problems | ~5-10% |
| 1-2 | Reject — methodological flaws | ~1-2% |

**Most first-draft manuscripts should score 5-7.** A score of 9+ is virtually never given on first review.

## Sections Reviewed

The review covers every component of a standard manuscript:

- Title, Significance Statement, Abstract
- Introduction
- Materials and Methods
- Results
- Discussion
- Figures, Tables
- Supplementary Methods, Supplementary Figures & Tables

## File Structure

```
manuscript-review/
├── SKILL.md                    # Main skill definition (Claude reads this)
├── references/
│   └── agent-profiles.md       # Detailed agent personas, review dimensions, must-ask questions
├── template/
│   └── scaffold.js             # docx generation template with helper functions
├── 中文说明.md                  # Chinese reference documentation
└── README.md                   # This file
```

## How It Works

1. **Read** — Extracts manuscript text (from docx via pandoc, PDF, or pasted text)
2. **Configure** — Sets target journal, review depth, output preferences
3. **Generate** — Creates a Node.js script using the scaffold template that builds the annotated docx
4. **Output** — Runs the script to produce the final bilingual review document

The scaffold template (`template/scaffold.js`) provides all the docx formatting infrastructure — color-coded agent panels, bilingual text helpers, figure embedding, scoring table builder, etc.

## Customization

### Adding Custom Agents

You can request additional agents beyond the default 6. Agent ML is pre-defined for quantitative papers. Custom agents follow the same pattern: a persona, review dimensions, must-ask questions, and a color scheme.

### Adapting to Different Disciplines

The skill adapts Agent D (application focus) and Agent E (journal standards) based on your discipline:

| Discipline | Agent D Focus | Agent E Journals |
|------------|---------------|------------------|
| Ecology | Conservation, ecosystem services | PNAS, Ecology Letters |
| Medicine | Clinical relevance, patient outcomes | NEJM, Lancet, JAMA |
| Engineering | Industrial applications, scalability | Nature Engineering, IEEE |
| Social Science | Policy implications, equity | Nature Human Behaviour |
| Chemistry | Synthesis feasibility, safety | JACS, Angewandte Chemie |
| Genomics | Clinical diagnostics, public health | Nature Genetics, Cell |

## Contributing

Contributions are welcome! Areas for improvement:

- Additional agent profiles for specialized domains
- Support for more output languages beyond English-Chinese
- Enhanced figure/table analysis capabilities
- Integration with reference management tools
- Journal-specific formatting templates

## License

MIT License — see [LICENSE](LICENSE) for details.
