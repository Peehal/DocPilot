const BLOCK_TYPES = new Set([
  'paragraph',
  'heading',
  'listItem',
  'taskItem',
  'tableRow',
  'blockquote',
  'codeBlock',
]);

function walk(node, lines) {
  if (!node) return;

  if (node.type === 'text') {
    lines.current += node.text || '';
    return;
  }

  if (node.content) {
    node.content.forEach((child) => walk(child, lines));
  }

  if (BLOCK_TYPES.has(node.type)) {
    lines.current += '\n';
  }
}

export function contentToText(contentJSON, title) {
  const lines = { current: '' };
  if (contentJSON) walk(contentJSON, lines);

  const body = lines.current
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return title ? `${title}\n${'='.repeat(title.length)}\n\n${body}\n` : `${body}\n`;
}
