import { PDFDocument, StandardFonts } from 'pdf-lib';
import { promises as fs } from 'fs';
import path from 'path';

export async function generateSummaryPdf(returnId: string, summary: { agi: number; taxableIncome: number; taxLiability: number }) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { width, height } = page.getSize();
  const fontSize = 12;
  page.drawText('Expat Tax Summary', { x: 50, y: height - 50, size: 18, font });
  page.drawText(`Return ID: ${returnId}`, { x: 50, y: height - 90, size: fontSize, font });
  page.drawText(`AGI: $${summary.agi.toFixed(2)}`, { x: 50, y: height - 120, size: fontSize, font });
  page.drawText(`Taxable Income: $${summary.taxableIncome.toFixed(2)}`, { x: 50, y: height - 150, size: fontSize, font });
  page.drawText(`Tax Liability: $${summary.taxLiability.toFixed(2)}`, { x: 50, y: height - 180, size: fontSize, font });

  const pdfBytes = await pdfDoc.save();
  const outputDir = process.env.PDF_OUTPUT_DIR ?? path.resolve(process.cwd(), 'storage/pdfs');
  await fs.mkdir(outputDir, { recursive: true });
  const filePath = path.join(outputDir, `${returnId}.pdf`);
  await fs.writeFile(filePath, pdfBytes);
  return filePath;
}
