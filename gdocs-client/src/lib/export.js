import { api } from './api';

const MIME_TO_EXT = {
  pdf: 'pdf',
  html: 'html',
  txt: 'txt',
  json: 'json',
};

export async function downloadDocumentExport(documentId, title, format) {
  const response = await api.get(`/documents/${documentId}/export`, {
    params: { format },
    responseType: 'blob',
  });

  const ext = MIME_TO_EXT[format] || format;
  const filename = `${(title || 'document').replace(/[^\w-]+/g, '_')}.${ext}`;

  const url = URL.createObjectURL(response.data);
  const link = window.document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
