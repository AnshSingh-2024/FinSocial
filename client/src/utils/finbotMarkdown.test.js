import { describe, it, expect } from 'vitest';
import { normalizeFinbotMarkdown } from './finbotMarkdown';

describe('normalizeFinbotMarkdown', () => {
  it('splits inline bullets after a colon into a list', () => {
    const raw = 'We could: * Analyze a stock. * Discuss portfolio.';
    const out = normalizeFinbotMarkdown(raw);
    expect(out).toContain('We could:\n\n* Analyze');
    expect(out).toContain('\n\n* Discuss');
  });
});
