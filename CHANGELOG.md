# Changelog

All notable changes to this skill are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/); versions follow [Semantic Versioning](https://semver.org/).

## [1.1.0] — 2026-07-16

### Fixed 修复

- **scaffold.js `fig()`**: image type is now inferred from the file extension (png/jpg/jpeg/gif/bmp) instead of hardcoded `"png"` — non-PNG media extracted from a docx no longer fail to embed. 图片类型按扩展名自动推断，不再硬编码 PNG。
- **scaffold.js `buildScoreTable()`**: the grand average is now the true mean over ALL scores, not a mean of per-agent column means (which was biased when agents score different numbers of sections). 总均分改为全部有效分数的真实平均，修正了"均值的均值"偏差。
- **scaffold.js**: the script now sets a non-zero exit code when document generation fails, so automated callers can detect failure. 生成失败时返回非零退出码。
- **scaffold.js**: friendly error message when the `docx` package is not installed. `docx` 包缺失时给出明确安装提示。
- **SKILL.md**: removed a literal `→` escape artifact in the review guidelines. 修复正文中的转义字符残留。
- **Consistency**: review-depth definitions unified across SKILL.md, README.md, and 中文说明.md (Quick = 2-3 sentences, Deep = 4-6 sentences per agent per section). 三处文档的审稿深度定义统一。

### Changed 变更

- **Self-contained**: the docx API reference is now bundled at `references/docx-js-api.md`; SKILL.md no longer points to a machine-specific absolute path. skill 现在完全自包含，不再依赖本机私有路径。
- **scaffold.js**: the `MEDIA` default is now empty instead of a leftover machine-specific path. `MEDIA` 默认值清空。
- **SKILL.md**: added `license: MIT` to the frontmatter. frontmatter 增加许可证字段。
- **README.md**: file-structure diagram updated to include all shipped files. 文件结构图补全。

### Added 新增

- `references/docx-js-api.md` — condensed docx (docx-js) API reference covering everything the scaffold uses, with critical formatting rules and a failure-mode table. docx API 精简参考文档。
- `CHANGELOG.md` — this file. 本变更记录。

## [1.0.0] — 2026-03-02

### Added 新增

- Initial release: multi-agent academic manuscript review skill with 6 core agents (+ optional Agent ML), bilingual annotated docx output, stringent scoring calibration, scoring matrix, and prioritized improvement list. 首次发布：6 位核心审稿 Agent（可选 ML Agent）、双语彩色批注 docx 输出、严格评分校准、评分矩阵与改进优先级清单。
