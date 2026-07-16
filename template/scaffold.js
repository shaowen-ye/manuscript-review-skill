// ============================================================
// Multi-Agent Bilingual Manuscript Review — Scaffold Template
// ============================================================
// Usage: Claude reads this template, copies the helper infrastructure,
//        then fills in content[] with manuscript text + agent reviews.
//
// Configuration: Set these 3 variables before content generation:
//   MEDIA       — path to image directory (or '' if no images)
//   OUTPUT_FILE — output docx file path
//   HEADER_TEXT — header text for page header
// ============================================================

const fs = require('fs');
let docx;
try {
  docx = require('docx');
} catch (e) {
  console.error('Error: the "docx" package is not installed. Run: npm install docx');
  process.exit(1);
}
const { Document, Packer, Paragraph, TextRun, Header, Footer, ImageRun,
        AlignmentType, HeadingLevel, PageNumber, PageBreak,
        ShadingType, BorderStyle, Table, TableRow, TableCell, WidthType } = docx;

// === CONFIGURATION (set per manuscript) ===
const MEDIA = '';                                     // <-- image directory (e.g. './media/'), or '' if no images
const OUTPUT_FILE = './bilingual_agents_review.docx'; // <-- adjust per manuscript
const HEADER_TEXT = 'Manuscript Agent Team Review';   // <-- adjust per manuscript

// ============================================================
// HELPER FUNCTIONS — Typography & Layout
// ============================================================

// English paragraph (Times New Roman 10pt, black)
function eng(text, opts = {}) {
  return new Paragraph({ spacing: { before: 80, after: 40, line: 260 }, ...opts,
    children: [new TextRun({ text, font: "Times New Roman", size: 20, color: "000000" })] });
}

// English with mixed formatting runs
function engRuns(runs, opts = {}) {
  return new Paragraph({ spacing: { before: 80, after: 40, line: 260 }, ...opts,
    children: runs.map(r => typeof r === 'string'
      ? new TextRun({ text: r, font: "Times New Roman", size: 20, color: "000000" })
      : new TextRun({ font: "Times New Roman", size: 20, color: "000000", ...r })) });
}

// Chinese translation paragraph (YaHei 8.5pt, dark blue)
function chn(text, opts = {}) {
  return new Paragraph({ spacing: { before: 40, after: 40, line: 260 }, ...opts,
    children: [
      new TextRun({ text: "\u3010\u4E2D\u6587\u7FFB\u8BD1\u3011", font: "Microsoft YaHei", size: 17, color: "003366", bold: true }),
      new TextRun({ text: " " + text, font: "Microsoft YaHei", size: 17, color: "003366" })
    ] });
}

// Bilingual section heading (returns array)
function sectionHead(level, engText, chnText) {
  const hl = level === 1 ? HeadingLevel.HEADING_1 : level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3;
  return [new Paragraph({ heading: hl, spacing: { before: 240, after: 60, line: 276 },
    children: [
      new TextRun({ text: engText, font: "Arial", size: level === 1 ? 26 : level === 2 ? 22 : 20, bold: true, color: "000000" }),
      new TextRun({ text: "  ", font: "Arial", size: 18 }),
      new TextRun({ text: chnText, font: "Microsoft YaHei", size: level === 1 ? 22 : level === 2 ? 20 : 18, bold: true, color: "333333" })
    ] })];
}

// Horizontal separator line
function separator() {
  return new Paragraph({ spacing: { before: 60, after: 60 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC", space: 4 } },
    children: [new TextRun({ text: "", size: 8 })] });
}

// Page break
function pb() { return new Paragraph({ children: [new PageBreak()] }); }

// Infer docx ImageRun type from file extension (docx supports jpg/png/gif/bmp)
function imgType(file) {
  const ext = file.slice(file.lastIndexOf('.') + 1).toLowerCase();
  if (ext === 'jpg' || ext === 'jpeg') return 'jpg';
  if (ext === 'gif') return 'gif';
  if (ext === 'bmp') return 'bmp';
  return 'png';
}

// Figure with bilingual caption (reads from MEDIA directory)
function fig(imgFile, w, h, engCap, chnCap) {
  const items = [];
  try {
    const data = fs.readFileSync(MEDIA + imgFile);
    items.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 40 },
      children: [new ImageRun({ type: imgType(imgFile), data, transformation: { width: w, height: h },
        altText: { title: engCap, description: engCap, name: imgFile } })] }));
  } catch(e) { items.push(eng("[Image: " + imgFile + " not found]")); }
  items.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 20, after: 20, line: 240 },
    children: [new TextRun({ text: engCap, font: "Arial", size: 16, color: "333333", bold: true })] }));
  items.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 10, after: 60, line: 240 },
    children: [new TextRun({ text: chnCap, font: "Microsoft YaHei", size: 15, color: "003366" })] }));
  return items;
}

// ============================================================
// 6 AGENT REVIEW FUNCTIONS
// ============================================================
// Each agent: colored text + shaded background, Chinese review text

// Agent A: Architecture Strategist 架构军师 (purple)
function agentA(text) {
  return new Paragraph({ spacing: { before: 30, after: 30, line: 240 },
    shading: { fill: "F5F0F8", type: ShadingType.CLEAR },
    children: [
      new TextRun({ text: "\u3010A \u67B6\u6784\u519B\u5E08\u3011", font: "Microsoft YaHei", size: 16, color: "660066", bold: true }),
      new TextRun({ text: " " + text, font: "Microsoft YaHei", size: 16, color: "660066" })
    ] });
}

// Agent B: Theory Mentor 理论导师 (dark blue)
function agentB(text) {
  return new Paragraph({ spacing: { before: 30, after: 30, line: 240 },
    shading: { fill: "F0F4FA", type: ShadingType.CLEAR },
    children: [
      new TextRun({ text: "\u3010B \u7406\u8BBA\u5BFC\u5E08\u3011", font: "Microsoft YaHei", size: 16, color: "003399", bold: true }),
      new TextRun({ text: " " + text, font: "Microsoft YaHei", size: 16, color: "003399" })
    ] });
}

// Agent C: Methods & Stats Reviewer 方法统计审稿人 (dark red)
function agentC(text) {
  return new Paragraph({ spacing: { before: 30, after: 30, line: 240 },
    shading: { fill: "FAF0F0", type: ShadingType.CLEAR },
    children: [
      new TextRun({ text: "\u3010C \u65B9\u6CD5\u7EDF\u8BA1\u5BA1\u7A3F\u4EBA\u3011", font: "Microsoft YaHei", size: 16, color: "990000", bold: true }),
      new TextRun({ text: " " + text, font: "Microsoft YaHei", size: 16, color: "990000" })
    ] });
}

// Agent D: Application Advisor 应用保护顾问 (dark green)
function agentD(text) {
  return new Paragraph({ spacing: { before: 30, after: 30, line: 240 },
    shading: { fill: "F0FAF0", type: ShadingType.CLEAR },
    children: [
      new TextRun({ text: "\u3010D \u5E94\u7528\u4FDD\u62A4\u987E\u95EE\u3011", font: "Microsoft YaHei", size: 16, color: "006600", bold: true }),
      new TextRun({ text: " " + text, font: "Microsoft YaHei", size: 16, color: "006600" })
    ] });
}

// Agent E: Journal Editor 期刊主编 (dark orange)
function agentE(text) {
  return new Paragraph({ spacing: { before: 30, after: 30, line: 240 },
    shading: { fill: "FFF8F0", type: ShadingType.CLEAR },
    children: [
      new TextRun({ text: "\u3010E \u671F\u520A\u4E3B\u7F16\u3011", font: "Microsoft YaHei", size: 16, color: "CC6600", bold: true }),
      new TextRun({ text: " " + text, font: "Microsoft YaHei", size: 16, color: "CC6600" })
    ] });
}

// Agent F: Senior Collaborator 资深合作者 (teal)
function agentF(text) {
  return new Paragraph({ spacing: { before: 30, after: 30, line: 240 },
    shading: { fill: "F0FAFA", type: ShadingType.CLEAR },
    children: [
      new TextRun({ text: "\u3010F \u8D44\u6DF1\u5408\u4F5C\u8005\u3011", font: "Microsoft YaHei", size: 16, color: "006666", bold: true }),
      new TextRun({ text: " " + text, font: "Microsoft YaHei", size: 16, color: "006666" })
    ] });
}

// Optional: Agent ML — ML/Statistics Specialist (magenta)
function agentML(text) {
  return new Paragraph({ spacing: { before: 30, after: 30, line: 240 },
    shading: { fill: "FFF0F5", type: ShadingType.CLEAR },
    children: [
      new TextRun({ text: "\u3010ML \u673A\u5668\u5B66\u4E60/\u9AD8\u7EA7\u7EDF\u8BA1\u4E13\u5BB6\u3011", font: "Microsoft YaHei", size: 16, color: "8B008B", bold: true }),
      new TextRun({ text: " " + text, font: "Microsoft YaHei", size: 16, color: "8B008B" })
    ] });
}

// Panel header — marks the start of an agent review panel
function panelHeader(text) {
  return new Paragraph({ spacing: { before: 120, after: 40, line: 240 },
    border: { top: { style: BorderStyle.DOUBLE, size: 2, color: "999999", space: 4 } },
    children: [new TextRun({ text, font: "Arial", size: 18, bold: true, color: "333333" })] });
}

// ============================================================
// SCORING TABLE HELPERS
// ============================================================

// Create a table cell
function makeCell(text, isHeader = false, color = "333333") {
  return new TableCell({
    width: { size: isHeader ? 1500 : 1000, type: WidthType.DXA },
    shading: isHeader ? { fill: "E8E8E8", type: ShadingType.CLEAR } : undefined,
    children: [new Paragraph({ spacing: { before: 30, after: 30 }, alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: String(text), font: "Arial", size: 15,
        bold: isHeader, color })] })]
  });
}

// Build a scoring matrix table from a scores object
// scores = { "Section Name": { A: 8, B: 7, C: null, D: 6, E: 8, F: 9 }, ... }
function buildScoreTable(scores) {
  const agents = ['A', 'B', 'C', 'D', 'E', 'F'];
  const agentLabels = ['A \u67B6\u6784', 'B \u7406\u8BBA', 'C \u65B9\u6CD5', 'D \u5E94\u7528', 'E \u4E3B\u7F16', 'F \u5408\u4F5C'];
  const headerRow = new TableRow({ children: [
    makeCell("Section", true),
    ...agentLabels.map(l => makeCell(l, true)),
    makeCell("Avg", true)
  ]});

  const dataRows = [];
  const agentTotals = agents.map(() => ({ sum: 0, count: 0 }));
  let grandSum = 0, grandCount = 0;

  for (const [section, agentScores] of Object.entries(scores)) {
    const vals = agents.map((a, i) => {
      const v = agentScores[a];
      if (v != null) { agentTotals[i].sum += v; agentTotals[i].count++; grandSum += v; grandCount++; }
      return v;
    });
    const validVals = vals.filter(v => v != null);
    const avg = validVals.length ? (validVals.reduce((a, b) => a + b, 0) / validVals.length).toFixed(1) : "-";
    dataRows.push(new TableRow({ children: [
      makeCell(section, false, "333333"),
      ...vals.map(v => makeCell(v != null ? String(v) : "-", false, v != null && v <= 5 ? "CC0000" : "333333")),
      makeCell(avg, false, "000000")
    ]}));
  }

  // Overall average row (grand average = true mean over ALL scores, not mean of column means)
  const overallVals = agentTotals.map(t => t.count ? (t.sum / t.count).toFixed(1) : "-");
  const grandAvg = grandCount ? (grandSum / grandCount).toFixed(1) : "-";
  dataRows.push(new TableRow({ children: [
    makeCell("Overall", true, "000000"),
    ...overallVals.map(v => makeCell(v, true, "000000")),
    makeCell(grandAvg, true, "000000")
  ]}));

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows]
  });
}

// ============================================================
// CONTENT ARRAY — Claude fills this section
// ============================================================
const content = [];

// === INSERT CONTENT HERE ===
// Claude generates all content.push(...) calls below this line.
// Each section follows this pattern:
//
// content.push(...sectionHead(1, "English Title", "中文标题"));
// content.push(
//   eng("English paragraph text..."),
//   chn("中文翻译..."),
//   separator()
// );
// content.push(panelHeader("▶ Agent Team Review: Section 中文标签"));
// content.push(
//   agentA("审稿评语... [Score: X/10]"),
//   agentB("审稿评语... [Score: X/10]"),
//   agentC("审稿评语... [Score: X/10]"),
//   agentD("审稿评语... [Score: X/10]"),
//   agentE("审稿评语... [Score: X/10]"),
//   agentF("审稿评语... [Score: X/10]"),
//   separator()
// );
//
// For figures:
// content.push(...fig("image1.png", 580, 400, "Figure 1. English caption", "图1 中文图注"));
//
// At the end, add scoring table:
// const scores = { "Title": { A:8, B:7, C:null, D:null, E:8, F:9 }, ... };
// content.push(panelHeader("▶ Scoring Matrix 评分矩阵"));
// content.push(buildScoreTable(scores));
//
// Then add priority improvements:
// content.push(panelHeader("▶ Priority Improvements 优先改进清单"));
// content.push(eng("CRITICAL:"), agentC("..."), separator());
// content.push(eng("MAJOR:"), agentB("..."), separator());
// content.push(eng("MINOR:"), agentF("..."), separator());

// === END CONTENT ===

// ============================================================
// ASSEMBLE DOCUMENT
// ============================================================
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Times New Roman", size: 20 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, color: "000000", font: "Arial" },
        paragraph: { spacing: { before: 240, after: 60 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, color: "000000", font: "Arial" },
        paragraph: { spacing: { before: 180, after: 60 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 20, bold: true, color: "000000", font: "Arial" },
        paragraph: { spacing: { before: 120, after: 60 }, outlineLevel: 2 } }
    ]
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 864, right: 864, bottom: 864, left: 864 },
        size: { width: 11906, height: 16838 }  // A4
      }
    },
    headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: HEADER_TEXT, font: "Arial", size: 14, color: "999999", italics: true })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: "Page ", font: "Arial", size: 14, color: "999999" }),
        new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 14, color: "999999" }),
        new TextRun({ text: " / ", font: "Arial", size: 14, color: "999999" }),
        new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Arial", size: 14, color: "999999" })
      ] })] }) },
    children: content
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(OUTPUT_FILE, buffer);
  console.log("Agent Team Review document created: " + OUTPUT_FILE);
}).catch(err => {
  console.error("Error creating document:", err);
  process.exitCode = 1;  // let callers detect failure via exit code
});
