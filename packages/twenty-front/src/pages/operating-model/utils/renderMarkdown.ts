// Simple markdown to HTML renderer for preview purposes.
// Handles headers, bold, italic, inline code, lists, and horizontal rules.
export const renderMarkdownToHtml = (markdown: string): string => {
  let html = markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
    .replace(/^---$/gm, '<hr/>');

  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

  // Wrap remaining plain lines in <p>
  html = html
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (
        trimmed === '' ||
        trimmed.startsWith('<h') ||
        trimmed.startsWith('<ul') ||
        trimmed.startsWith('<li') ||
        trimmed.startsWith('</ul') ||
        trimmed.startsWith('<hr')
      ) {
        return line;
      }
      return `<p>${trimmed}</p>`;
    })
    .join('\n');

  // Remove empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '');

  return html;
};
