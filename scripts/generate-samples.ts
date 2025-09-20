import { PDFDocument, StandardFonts } from 'pdf-lib';
import { promises as fs } from 'fs';
import path from 'path';

async function createPdf(filename: string, title: string, lines: string[]) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  let y = 750;
  page.drawText(title, { x: 50, y, size: 18, font });
  y -= 30;
  for (const line of lines) {
    page.drawText(line, { x: 50, y, size: 12, font });
    y -= 18;
  }
  const pdfBytes = await pdfDoc.save();
  const outputPath = path.resolve('docs/samples', filename);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, pdfBytes);
}

async function main() {
  await createPdf('1040-nr-treaty-sample.pdf', 'Form 1040-NR Summary', [
    'Residency: Nonresident alien (Korean treaty)',
    'Income: $30,000 Royalties (Form 1042-S)',
    'Treaty Article 12 applies 5% rate.',
    'Tax Computed: $1,500'
  ]);
  await createPdf('1040-feie-sample.pdf', 'Form 1040 with Form 2555', [
    'Residency: US citizen abroad in Korea',
    'Foreign Wages: ₩120,000,000 (KRW) → $92,456',
    'FEIE Applied: $120,000, Housing Exclusion $15,000',
    'Tax Due: $0, Refund $2,300 withholding'
  ]);
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
