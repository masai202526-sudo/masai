// Add declarations for global libraries from CDN
declare const jspdf: any;
declare const docx: any;
declare const XLSX: any;
declare const marked: any;

// --- Helper Functions ---

/**
 * Checks if a markdown string contains a table.
 */
export function markdownHasTable(markdown: string): boolean {
  if (!markdown) return false;
  // A simple regex to check for markdown table syntax
  return /\|.*\|/.test(markdown) && /\|-.*\|/.test(markdown);
}

/**
 * Parses the first markdown table found in a string.
 */
function parseMarkdownTable(markdown: string): { head: string[][], body: string[][] } | null {
  if (!markdownHasTable(markdown)) return null;

  const tokens = marked.lexer(markdown);
  const tableToken = tokens.find((token: any) => token.type === 'table') as any | undefined;

  if (!tableToken) return null;

  const head = [tableToken.header.map((cell: any) => cell.text)];
  const body = tableToken.rows.map((row: any[]) => row.map((cell: any) => cell.text));
  
  return { head, body };
}

// --- Export Functions ---

/**
 * Exports content as a Markdown (.md) file.
 */
export function exportAsMarkdown(content: string, title: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/\s+/g, '_')}_output.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exports content as a PDF file with a clickable Table of Contents.
 */
export function exportAsPdf(markdown: string, title: string) {
  const { jsPDF } = jspdf;
  const doc = new jsPDF();
  const tokens = marked.lexer(markdown);
  
  // --- 1. Render content and collect heading locations ---
  const headings: { text: string; depth: number; y: number; page: number }[] = [];
  let y = 15;
  let page = 1;
  const pageMargin = 15;
  const contentWidth = doc.internal.pageSize.getWidth() - (pageMargin * 2);

  const checkPageBreak = () => {
    if (y > doc.internal.pageSize.getHeight() - pageMargin) {
      doc.addPage();
      page++;
      y = pageMargin;
    }
  };

  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text(title, pageMargin, y);
  y += 15;
  doc.setFont(undefined, 'normal');

  tokens.forEach((token: any) => {
    checkPageBreak();
    
    switch (token.type) {
      case 'heading':
        headings.push({ text: token.text, depth: token.depth, y: y, page: page });
        doc.setFontSize(22 - (token.depth * 2));
        doc.setFont(undefined, 'bold');
        doc.text(token.text, pageMargin, y);
        y += 7;
        doc.setFont(undefined, 'normal');
        break;
      case 'paragraph':
        doc.setFontSize(11);
        const splitText = doc.splitTextToSize(token.text, contentWidth);
        doc.text(splitText, pageMargin, y);
        y += splitText.length * 5;
        break;
      case 'list':
        doc.setFontSize(11);
        token.items.forEach((item: any, index: number) => {
           checkPageBreak();
           const prefix = token.ordered ? `${index + 1}. ` : `- `;
           const itemText = doc.splitTextToSize(item.text, contentWidth - 10);
           doc.text(`${prefix}${itemText[0]}`, pageMargin + 5, y);
           y += 5;
           if(itemText.length > 1) {
               doc.text(itemText.slice(1), pageMargin + 10, y);
               y += (itemText.length-1) * 5;
           }
        });
        break;
      case 'table':
        const tableData = parseMarkdownTable(token.raw);
        if (tableData) {
            doc.autoTable({
                head: tableData.head,
                body: tableData.body,
                startY: y,
                theme: 'striped',
                headStyles: { fillColor: [75, 85, 99] }, // slate-600
                margin: { left: pageMargin }
            });
            y = doc.autoTable.previous.finalY + 10;
        }
        break;
      case 'space':
        y += 5;
        break;
      default:
        break; // Ignore other tokens
    }
    y += 5; // padding
  });

  // --- 2. Insert TOC page and render links ---
  if (headings.length > 0) {
    doc.insertPage(1);
    doc.setPage(1);
    let tocY = pageMargin;
    
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Table of Contents', pageMargin, tocY);
    tocY += 15;
    doc.setFont(undefined, 'normal');
    
    headings.forEach(heading => {
      if (tocY > doc.internal.pageSize.getHeight() - pageMargin) {
        // Simple handling for TOC overflow, can be improved if needed
        return; 
      }
      
      const indent = pageMargin + (heading.depth - 1) * 5;
      const text = heading.text;
      
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 255); // Make link blue
      doc.text(text, indent, tocY);
      doc.setTextColor(0, 0, 0); // Reset text color
      
      const dims = doc.getTextDimensions(text);
      // Link destination page is +1 because we inserted the TOC page at the beginning
      const linkPage = heading.page + 1;
      
      doc.link(indent, tocY - dims.h, dims.w, dims.h, { pageNumber: linkPage, y: heading.y, R: 'FitV' });
      
      tocY += 7;
    });
  }

  doc.save(`${title.replace(/\s+/g, '_')}_output.pdf`);
}

/**
 * Exports content as a Word (.docx) file.
 */
export function exportAsDocx(markdown: string, title: string) {
    const tokens = marked.lexer(markdown);
    const children: any[] = [
        new docx.Paragraph({
            text: title,
            heading: docx.HeadingLevel.TITLE,
        }),
    ];

    tokens.forEach((token: any) => {
        switch (token.type) {
            case 'heading':
                children.push(new docx.Paragraph({
                    text: token.text,
                    heading: `HEADING_${token.depth}`,
                }));
                break;
            case 'paragraph':
                children.push(new docx.Paragraph({ text: token.text }));
                break;
            case 'list':
                token.items.forEach((item: any) => {
                    children.push(new docx.Paragraph({
                        text: item.text,
                        bullet: { level: 0 },
                    }));
                });
                break;
            case 'table':
                const header = new docx.TableRow({
                    children: token.header.map((cell: any) => new docx.TableCell({
                        children: [new docx.Paragraph({ text: cell.text, bold: true })],
                    })),
                });
                const rows = token.rows.map((row: any[]) => new docx.TableRow({
                    children: row.map((cell: any) => new docx.TableCell({
                        children: [new docx.Paragraph({ text: cell.text })],
                    })),
                }));
                children.push(new docx.Table({
                    rows: [header, ...rows],
                    width: { size: 100, type: docx.WidthType.PERCENTAGE },
                }));
                break;
            case 'space':
                children.push(new docx.Paragraph({ text: "" }));
                break;
        }
    });

    const doc = new docx.Document({
        sections: [{
            properties: {},
            children,
        }],
    });

    docx.Packer.toBlob(doc).then((blob: any) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/\s+/g, '_')}_output.docx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

/**
 * Exports content as a spreadsheet (XLSX or CSV).
 */
export function exportAsSpreadsheet(markdown: string, title: string, format: 'xlsx' | 'csv') {
    const tableData = parseMarkdownTable(markdown);
    if (!tableData) {
        alert("No table found in the output to export.");
        return;
    }

    const worksheet = XLSX.utils.aoa_to_sheet([
        ...tableData.head,
        ...tableData.body
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const extension = format === 'xlsx' ? 'xlsx' : 'csv';
    XLSX.writeFile(workbook, `${title.replace(/\s+/g, '_')}_output.${extension}`);
}
