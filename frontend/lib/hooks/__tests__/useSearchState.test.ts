import { act, renderHook } from '@testing-library/react';

import { searchStatePresets, useSearchState } from '../useSearchState';

const replaceMock = vi.fn();
const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: replaceMock,
    push: pushMock,
  }),
  usePathname: () => '/submissions',
  useSearchParams: () => new URLSearchParams('status=new&brokerId=1'),
}));

describe('useSearchState', () => {
  beforeEach(() => {
    replaceMock.mockClear();
    pushMock.mockClear();
  });

  it('reads value from search params', () => {
    const { result } = renderHook(() =>
      useSearchState({
        name: 'status',
        ...searchStatePresets.string(),
      }),
    );

    expect(result.current[0]).toBe('new');
  });

  it('updates value and calls router.replace', () => {
    const { result } = renderHook(() =>
      useSearchState({
        name: 'status',
        ...searchStatePresets.string(),
      }),
    );

    act(() => {
      result.current[1]('closed');
    });

    expect(replaceMock).toHaveBeenCalledWith('/submissions?status=closed&brokerId=1', {
      scroll: false,
    });
  });

  it('removes param when set to undefined', () => {
    const { result } = renderHook(() =>
      useSearchState({
        name: 'status',
        ...searchStatePresets.string(),
      }),
    );

    act(() => {
      result.current[1](undefined);
    });

    expect(replaceMock).toHaveBeenCalledWith('/submissions?brokerId=1', { scroll: false });
  });

  it('updates multiple params with setSearchState', () => {
    const { result } = renderHook(() =>
      useSearchState({
        name: 'status',
        ...searchStatePresets.string(),
      }),
    );

    act(() => {
      result.current[2]({
        status: 'closed',
        page: 2,
      });
    });

    expect(replaceMock).toHaveBeenCalledWith('/submissions?status=closed&brokerId=1&page=2', {
      scroll: false,
    });
  });
});
