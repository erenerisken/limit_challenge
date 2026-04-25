// @vitest-environment node

import { afterEach, describe, expect, it, vi } from 'vitest';
import { formatDate, formatDateTime } from '@/lib/utils/date';

describe('date utils', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('formats dates with the expected locale and options', () => {
    const toLocaleDateStringSpy = vi
      .spyOn(Date.prototype, 'toLocaleDateString')
      .mockReturnValue('Jan 15, 2026');

    expect(formatDate('2026-01-15T09:30:00.000Z')).toBe('Jan 15, 2026');
    expect(toLocaleDateStringSpy).toHaveBeenCalledWith('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  });

  it('formats date-times with the expected locale and options', () => {
    const toLocaleStringSpy = vi
      .spyOn(Date.prototype, 'toLocaleString')
      .mockReturnValue('Jan 15, 2026, 9:30 AM');

    expect(formatDateTime('2026-01-15T09:30:00.000Z')).toBe('Jan 15, 2026, 9:30 AM');
    expect(toLocaleStringSpy).toHaveBeenCalledWith('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  });
});
