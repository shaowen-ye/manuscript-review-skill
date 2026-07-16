# docx (docx-js) API Quick Reference

Condensed reference for the `docx` npm package (v8+), covering only the APIs used by this skill's scaffold. Read this before generating or modifying the review script.

## Setup

```javascript
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Header, Footer, ImageRun,
        AlignmentType, HeadingLevel, PageNumber, PageBreak,
        ShadingType, BorderStyle, Table, TableRow, TableCell, WidthType } = require('docx');
```

Install in the working directory if missing: `npm install docx`

## Critical Rules (violating these corrupts the file or breaks rendering)

1. **Never use `\n` inside a `TextRun`** — line breaks do NOT work. Use one `Paragraph` per line.
2. **Font sizes are half-points**: `size: 20` renders as 10pt. (`size: 17` = 8.5pt)
3. **Colors are hex WITHOUT `#`**: `color: "660066"`, `shading: { fill: "F5F0F8" }`. Using `#` breaks rendering.
4. **Spacing/indent units are twentieths of a point (DXA-like)**: `spacing: { before: 240 }` = 12pt before.
5. **`ImageRun` requires an explicit `type`** (`"png" | "jpg" | "gif" | "bmp"`) in docx v8+; omitting it throws.
6. **Every `Document` needs `sections`**; content goes in `sections[0].children` as an array of `Paragraph`/`Table`.
7. **`Packer.toBuffer` is async** — write the file inside `.then()`, and set `process.exitCode = 1` in `.catch()` so callers can detect failure.

## Paragraph & TextRun

```javascript
new Paragraph({
  alignment: AlignmentType.CENTER,            // LEFT | CENTER | RIGHT | JUSTIFIED
  spacing: { before: 80, after: 40, line: 260 }, // line: 240 = single spacing
  heading: HeadingLevel.HEADING_1,            // optional
  shading: { fill: "F5F0F8", type: ShadingType.CLEAR }, // paragraph background
  border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC", space: 4 } },
  children: [
    new TextRun({ text: "Bold text", bold: true, font: "Times New Roman", size: 20, color: "000000" }),
    new TextRun({ text: "中文", font: "Microsoft YaHei", size: 17, color: "003366", italics: true })
  ]
})
```

- Mixed CJK/Latin: set `font` per `TextRun` ("Microsoft YaHei" for Chinese, "Times New Roman"/"Arial" for Latin).
- Page break: `new Paragraph({ children: [new PageBreak()] })`.

## Tables

```javascript
new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    new TableRow({ children: [
      new TableCell({
        width: { size: 1500, type: WidthType.DXA },   // DXA = 1/20 pt; 1500 ≈ 1.06 cm... use consistent widths
        shading: { fill: "E8E8E8", type: ShadingType.CLEAR },
        children: [ new Paragraph({ children: [new TextRun({ text: "Header", bold: true })] }) ]
      })
    ]})
  ]
})
```

- Each `TableCell.children` must contain at least one `Paragraph` (an empty cell still needs `new Paragraph({})`).
- Cell text must be a string: wrap numbers with `String(value)`.

## Images

```javascript
new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [new ImageRun({
    type: "png",                                // must match the actual format: png/jpg/gif/bmp
    data: fs.readFileSync("./media/image1.png"),
    transformation: { width: 580, height: 400 },  // in pixels
    altText: { title: "Figure 1", description: "Figure 1", name: "image1.png" }
  })]
})
```

- Wrap `fs.readFileSync` in try/catch and emit a text placeholder when the image file is missing (the scaffold's `fig()` does this).
- EMF/TIFF/WMF images extracted from a docx are NOT supported — convert them to PNG first (e.g. `magick input.emf output.png`).

## Headers / Footers / Page numbers

```javascript
headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: "Header text", size: 14, color: "999999", italics: true })] })] }) },
footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
  children: [
    new TextRun({ text: "Page ", size: 14 }),
    new TextRun({ children: [PageNumber.CURRENT], size: 14 }),
    new TextRun({ text: " / ", size: 14 }),
    new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 14 })
  ] })] }) }
```

`PageNumber.CURRENT` / `PageNumber.TOTAL_PAGES` must go in a `TextRun`'s `children` array (not `text`).

## Document assembly & output

```javascript
const doc = new Document({
  styles: { default: { document: { run: { font: "Times New Roman", size: 20 } } } },
  sections: [{
    properties: { page: {
      margin: { top: 864, right: 864, bottom: 864, left: 864 },   // 864 DXA ≈ 0.6 inch
      size: { width: 11906, height: 16838 }                        // A4 in DXA
    } },
    headers: { /* ... */ }, footers: { /* ... */ },
    children: content   // array of Paragraph/Table
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(OUTPUT_FILE, buffer);
  console.log("created: " + OUTPUT_FILE);
}).catch(err => { console.error(err); process.exitCode = 1; });
```

## Common failure modes

| Symptom | Cause | Fix |
|---|---|---|
| Word says file is corrupted | `#` in a color value; or non-string in cell text | Strip `#`; wrap with `String()` |
| Text renders on one line | `\n` inside `TextRun` | Split into separate `Paragraph`s |
| Everything is huge/tiny | Forgot sizes are half-points | `size: 20` = 10pt |
| `ImageRun` throws at build | Missing `type`, or unsupported format (emf/tiff) | Infer type from extension; convert to PNG |
| Script "succeeds" but no file | Error swallowed in async `.catch` | Set `process.exitCode = 1` in catch |
| Chinese shows as boxes | Latin-only font applied to CJK runs | Use "Microsoft YaHei" (or another CJK font) per run |
