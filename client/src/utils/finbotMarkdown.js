/**
 * Gemini often returns markdown with inline bullets ("We could: * a * b").
 * Normalize to block markdown before react-markdown renders.
 */
export function normalizeFinbotMarkdown(raw) {
  if (!raw || typeof raw !== 'string') return '';

  let text = raw.replace(/\r\n/g, '\n').trim();

  // ": * item * item" → line breaks before list items
  if (/:\s*\*/.test(text)) {
    text = text.replace(/:\s+(?=\*)/g, ':\n\n');
  }
  text = text.replace(/([.!?])\s+\*\s+/g, '$1\n\n* ');
  text = text.replace(/(\))\s+\*\s+/g, '$1\n\n* ');

  // Collapse 3+ newlines
  text = text.replace(/\n{3,}/g, '\n\n');

  return text;
}
