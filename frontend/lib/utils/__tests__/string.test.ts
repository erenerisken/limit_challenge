// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { getInitials } from '@/lib/utils/string';

describe('string utils', () => {
  it('returns uppercase initials for first and last names', () => {
    expect(getInitials('Jane Doe')).toBe('JD');
  });

  it('limits initials to the first two characters', () => {
    expect(getInitials('Jane Mary Doe')).toBe('JM');
  });

  it('handles a single name', () => {
    expect(getInitials('Plato')).toBe('P');
  });

  it('ignores repeated spaces between name parts', () => {
    expect(getInitials('Jane   Doe')).toBe('JD');
  });

  it('returns an empty string for an empty name', () => {
    expect(getInitials('')).toBe('');
  });
});
