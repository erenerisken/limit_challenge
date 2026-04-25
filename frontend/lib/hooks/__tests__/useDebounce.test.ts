import { act, renderHook } from '@testing-library/react';

import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('test', 400));

    expect(result.current).toBe('test');
  });

  it('updates value after delay', () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 400), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'b' });

    // still old value
    expect(result.current).toBe('a');

    // advance time
    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current).toBe('b');

    vi.useRealTimers();
  });

  it('cancels previous timeout if value changes quickly', () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 400), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'b' });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    // change again before debounce finishes
    rerender({ value: 'c' });

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current).toBe('c');

    vi.useRealTimers();
  });
});
