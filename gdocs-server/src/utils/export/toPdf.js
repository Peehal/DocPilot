import puppeteer from 'puppeteer';
import { toStandaloneHtml } from './toHtml.js';

export async function documentToPdf(document) {
  const html = toStandaloneHtml(document);

  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    return await page.pdf({ format: 'A4', printBackground: true });
  } finally {
    await browser.close();
  }
}
