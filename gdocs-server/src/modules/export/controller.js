import { toStandaloneHtml } from '../../utils/export/toHtml.js';
import { contentToText } from '../../utils/export/toText.js';
import { documentToPdf } from '../../utils/export/toPdf.js';

export async function exportDocument(req, res) {
  const format = (req.query.format || 'pdf').toLowerCase();
  const doc = req.document;
  const filename = (doc.title || 'document').replace(/[^\w-]+/g, '_');

  switch (format) {
    case 'json': {
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.json"`);
      return res.json(doc.contentJSON || {});
    }
    case 'txt': {
      const text = contentToText(doc.contentJSON, doc.title);
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.txt"`);
      return res.send(text);
    }
    case 'html': {
      const html = toStandaloneHtml(doc);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.html"`);
      return res.send(html);
    }
    case 'pdf': {
      const pdfBuffer = await documentToPdf(doc);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
      return res.send(pdfBuffer);
    }
    default:
      return res.status(400).json({ error: 'Unsupported format. Use pdf, html, txt, or json.' });
  }
}
