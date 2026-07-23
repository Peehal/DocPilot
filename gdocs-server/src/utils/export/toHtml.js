import { generateHTML } from '@tiptap/html';
import { exportExtensions } from './extensions.js';

const EMPTY_DOC = { type: 'doc', content: [{ type: 'paragraph' }] };

export function contentToBodyHtml(contentJSON) {
  const doc = contentJSON && contentJSON.type ? contentJSON : EMPTY_DOC;
  return generateHTML(doc, exportExtensions);
}

export function toStandaloneHtml(document) {
  const bodyHtml = contentToBodyHtml(document.contentJSON);
  const margins = document.margins || { top: 96, bottom: 96, left: 96, right: 96 };

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(document.title)}</title>
    <style>
      body {
        font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
        color: #111;
        max-width: 800px;
        margin: 0 auto;
        padding: ${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px;
      }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #ccc; padding: 6px 10px; }
      th { background: #f3f3f3; }
      img { max-width: 100%; }
      ul[data-type="taskList"] { list-style: none; padding-left: 0; }
      ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 8px; }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(document.title)}</h1>
    ${bodyHtml}
  </body>
</html>`;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
