# 多智能体学术稿件审阅 | Multi-Agent Academic Manuscript Review

一个 [Claude Code](https://docs.anthropic.com/en/docs/claude-code) 技能，模拟由6位专家组成的审稿团队，在投稿前对学术稿件进行全面评审。生成中英双语彩色批注 `.docx` 文件，含逐段评审、量化评分矩阵和改进建议优先级排序。

A [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skill that simulates a panel of 6 expert reviewers to critique academic manuscripts before journal submission. Generates a bilingual (English-Chinese) annotated `.docx` file with color-coded, section-by-section reviews and a quantitative scoring matrix.

---

## 功能概述 | What It Does

输入稿件（docx、PDF 或粘贴文本），即可生成一份专业审稿文档：6位专业AI审稿人逐段点评，每位审稿人按1–10分制打分，评分标准根据目标期刊校准。

Give it a manuscript (docx, PDF, or pasted text), and it produces a professional review document where 6 specialized AI agents critique every section — from Title to Supplementary Materials — each scoring on a 1–10 scale calibrated to your target journal's standards.

### 6位审稿专家 | The 6-Agent Review Panel

| 代号 Agent | 角色 Role | 审稿重点 Focus |
|:---:|---|---|
| **A** | 架构军师 Architecture Strategist | 结构、逻辑链、内部一致性、叙事节奏 Structure, logic chain, internal consistency, narrative flow |
| **B** | 理论导师 Theory Mentor | 创新性、文献空白、概念精确度、显著性 Novelty, literature gaps, conceptual precision, significance |
| **C** | 方法统计审稿人 Methods & Stats Reviewer | 统计严谨性、可重复性、效应量、ML可行性 Statistical rigor, reproducibility, effect sizes, ML feasibility |
| **D** | 应用保护顾问 Application Advisor | 实际相关性、管理建议、政策衔接 Practical relevance, management implications, policy connections |
| **E** | 期刊主编 Journal Editor | 期刊适配度、格式合规、影响力、竞争定位 Journal fit, formatting compliance, impact, competitive positioning |
| **F** | 资深合作者 Senior Collaborator | 战略定位、脆弱点评估、未来方向 Strategic positioning, vulnerability assessment, future directions |

可选：**Agent ML** 针对定量密集型论文（高级统计/机器学习专家）。

Optional: **Agent ML** for quantitative-heavy papers (advanced statistics / machine learning specialist).

### 输出内容 | Output

每个稿件章节包含：
- 中英双语文本展示（英文原文 + 中文翻译）
- 各审稿人彩色标注评审面板
- 逐章评分及评分理由
- 最终评分矩阵表（审稿人 × 章节）
- 改进建议优先级列表（关键 / 重要 / 次要）

Each manuscript section gets:
- Bilingual text display (English original + Chinese translation)
- Color-coded review panels from each relevant agent
- Per-section scores with justification
- A final scoring matrix table (Agents × Sections)
- Prioritized improvement list (Critical / Major / Minor)

---

## 安装 | Installation

### 作为 Claude Code 技能安装 | As a Claude Code Skill

将本目录复制到 Claude Code 技能文件夹：

Copy this directory to your Claude Code skills folder:

```bash
cp -r . ~/.claude/skills/manuscript-review
```

或直接克隆 | Or clone directly:

```bash
git clone https://github.com/Shaowen-Ye/manuscript-review-skill.git ~/.claude/skills/manuscript-review
```

### 依赖 | Dependencies

```bash
# Node.js docx 包（用于生成 .docx 输出）
# Node.js docx package (for generating .docx output)
npm install docx

# Pandoc（可选，用于将 .docx 输入转为可读文本）
# Pandoc (optional, for converting .docx input to readable text)
brew install pandoc   # macOS
# or: apt install pandoc  # Linux
```

---

## 使用方法 | Usage

在 Claude Code 中直接说：

In Claude Code, simply say:

```
审稿 my_paper.docx
```

或 | or:

```
Please review my manuscript for PNAS submission
```

**触发短语 | Trigger phrases**（中英文均可）：
- "审稿"、"多Agent审稿"、"文稿审阅"、"投稿前审阅"、"逐段审稿"
- "manuscript review", "agent team review", "paper review panel"

### 配置选项 | Configuration Options

触发后，技能将请您确认：

When triggered, the skill will ask you to confirm:

1. **目标期刊 Target journal** — PNAS, Nature, Science, Ecology Letters 等
2. **审稿深度 Review depth** — 快速（每位审稿人2-3句）或深度（每位审稿人4-6句，默认）Quick (2-3 sentences per agent) or Deep (4-6 sentences, default)
3. **附加审稿人 Additional agents** — 是否启用 Agent ML
4. **语言对 Language pair** — 默认英中，可配置 Default English-Chinese, configurable
5. **输出文件路径 Output file path**

---

## 评分校准 | Scoring Calibration

评分基于目标期刊**录用论文前10%**的标准校准：

Scores are calibrated to the **top 10% of accepted papers** at the target journal:

| 分数 Score | 含义 Meaning | 频率 Frequency |
|:---:|---|:---:|
| 9-10 | 卓越——可直接发表 Exceptional — publish as-is | < 5% |
| 8 | 优秀——仅需小修 Very good — minor revision only | ~10-15% |
| 7 | 良好——扎实，3-5个问题 Good — solid work, 3-5 issues | ~20-25% |
| 5-6 | 合格——需要大修 Adequate — needs significant revision | ~40-50% |
| 3-4 | 薄弱——存在根本问题 Weak — fundamental problems | ~5-10% |
| 1-2 | 退稿——方法学缺陷 Reject — methodological flaws | ~1-2% |

**初稿通常应在5-7分之间。** 首轮审稿几乎不会给出9分以上的评分。

**Most first-draft manuscripts should score 5-7.** A score of 9+ is virtually never given on first review.

---

## 审阅章节 | Sections Reviewed

审阅覆盖标准学术稿件的全部组成部分：

The review covers every component of a standard manuscript:

- 标题、重要性声明、摘要 Title, Significance Statement, Abstract
- 引言 Introduction
- 材料与方法 Materials and Methods
- 结果 Results
- 讨论 Discussion
- 图、表 Figures, Tables
- 附录方法、附图与附表 Supplementary Methods, Supplementary Figures & Tables

---

## 工作原理 | How It Works

1. **读取 Read** — 提取稿件文本（通过 pandoc 转换 docx、PDF 或粘贴文本）Extracts manuscript text (from docx via pandoc, PDF, or pasted text)
2. **配置 Configure** — 设置目标期刊、审稿深度、输出偏好 Sets target journal, review depth, output preferences
3. **生成 Generate** — 使用脚手架模板创建 Node.js 脚本来构建批注 docx Creates a Node.js script using the scaffold template that builds the annotated docx
4. **输出 Output** — 运行脚本生成最终双语审稿文档 Runs the script to produce the final bilingual review document

脚手架模板（`template/scaffold.js`）提供所有 docx 格式化基础设施——彩色审稿人面板、双语文本助手、图片嵌入、评分表构建器等。

The scaffold template (`template/scaffold.js`) provides all the docx formatting infrastructure — color-coded agent panels, bilingual text helpers, figure embedding, scoring table builder, etc.

---

## 文件结构 | File Structure

```
manuscript-review/
├── SKILL.md                    # 主技能定义 Main skill definition (Claude reads this)
├── references/
│   ├── agent-profiles.md       # 审稿人详细人设 Detailed agent personas
│   └── docx-js-api.md          # docx API 精简参考 Condensed docx API reference
├── template/
│   └── scaffold.js             # docx 生成模板 docx generation template
├── 中文说明.md                  # 中文参考文档 Chinese reference documentation
├── CHANGELOG.md                # 版本变更记录 Version history
├── LICENSE                     # MIT 许可证 MIT license
└── README.md                   # 本文件 This file
```

---

## 自定义 | Customization

### 添加自定义审稿人 | Adding Custom Agents

除默认6位外，您可以请求添加额外审稿人。Agent ML 已为定量型论文预设。自定义审稿人遵循相同模式：人设、审稿维度、必问问题和配色方案。

You can request additional agents beyond the default 6. Agent ML is pre-defined for quantitative papers. Custom agents follow the same pattern: a persona, review dimensions, must-ask questions, and a color scheme.

### 适应不同学科 | Adapting to Different Disciplines

本技能根据您的学科调整 Agent D（应用方向）和 Agent E（期刊标准）：

The skill adapts Agent D (application focus) and Agent E (journal standards) based on your discipline:

| 学科 Discipline | Agent D 重点 Focus | Agent E 期刊 Journals |
|---|---|---|
| 生态学 Ecology | 保护、生态系统服务 Conservation, ecosystem services | PNAS, Ecology Letters |
| 医学 Medicine | 临床相关性、患者结局 Clinical relevance, patient outcomes | NEJM, Lancet, JAMA |
| 工程学 Engineering | 工业应用、可扩展性 Industrial applications, scalability | Nature Engineering, IEEE |
| 社会科学 Social Science | 政策影响、公平性 Policy implications, equity | Nature Human Behaviour |
| 化学 Chemistry | 合成可行性、安全性 Synthesis feasibility, safety | JACS, Angewandte Chemie |
| 基因组学 Genomics | 临床诊断、公共卫生 Clinical diagnostics, public health | Nature Genetics, Cell |

---

## 贡献 | Contributing

欢迎贡献！可改进的方向：

Contributions are welcome! Areas for improvement:

- 更多学科的审稿人配置 Additional agent profiles for specialized domains
- 支持更多输出语言（不限于英中） Support for more output languages beyond English-Chinese
- 增强图表分析能力 Enhanced figure/table analysis capabilities
- 集成参考文献管理工具 Integration with reference management tools
- 期刊特定格式模板 Journal-specific formatting templates

---

## 许可证 | License

MIT 许可证——详见 [LICENSE](LICENSE)。

MIT License — see [LICENSE](LICENSE) for details.
