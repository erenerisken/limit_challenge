'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type Primitive = string | number | boolean | undefined | null;

type SearchStatePreset<T> = {
  parse?: (value: string | null) => T | undefined;
  serialize?: (value: T | undefined) => Primitive;
};

type UseSearchStateOptions<T> = SearchStatePreset<T> & {
  name: string;
  defaultValue?: T;
  replace?: boolean;
  equalityFn?: (a: T | undefined, b: T | undefined) => boolean;
};

type SearchStateUpdates = Record<string, Primitive>;

export const searchStatePresets = {
  string: <T extends string = string>(): SearchStatePreset<T | undefined> => ({
    parse: (value) => (value || undefined) as T | undefined,
    serialize: (value) => value,
  }),

  number: (): SearchStatePreset<number | undefined> => ({
    parse: (value) => {
      if (!value) return undefined;

      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : undefined;
    },
    serialize: (value) => value,
  }),

  boolean: (): SearchStatePreset<boolean | undefined> => ({
    parse: (value) => {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return undefined;
    },
    serialize: (value) => value,
  }),
};

function updateSearchParam(params: URLSearchParams, key: string, value: Primitive) {
  if (value === undefined || value === null || value === '') {
    params.delete(key);
    return;
  }

  params.set(key, String(value));
}

export function useSearchState<T>({
  name,
  defaultValue,
  parse = (value) => value as T | undefined,
  serialize = (value) => value as Primitive,
  replace = true,
  equalityFn = (a, b) => a === b,
}: UseSearchStateOptions<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigateWithParams = useCallback(
    (params: URLSearchParams) => {
      const queryString = params.toString();
      const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

      if (replace) {
        router.replace(nextUrl, { scroll: false });
      } else {
        router.push(nextUrl, { scroll: false });
      }
    },
    [pathname, replace, router],
  );

  const value = useMemo(() => {
    try {
      const parsed = parse(searchParams.get(name));
      return parsed ?? defaultValue;
    } catch {
      return defaultValue;
    }
  }, [defaultValue, name, parse, searchParams]);

  const setValue = useCallback(
    (nextValue: T | undefined) => {
      if (equalityFn(value, nextValue)) return;

      const params = new URLSearchParams(searchParams.toString());
      const serialized = serialize(nextValue);
      const isDefaultValue = equalityFn(nextValue, defaultValue);

      updateSearchParam(params, name, isDefaultValue ? undefined : serialized);
      navigateWithParams(params);
    },
    [defaultValue, equalityFn, name, navigateWithParams, searchParams, serialize, value],
  );

  const setSearchState = useCallback(
    (updates: SearchStateUpdates) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, nextValue]) => {
        updateSearchParam(params, key, nextValue);
      });

      navigateWithParams(params);
    },
    [navigateWithParams, searchParams],
  );

  return [value, setValue, setSearchState] as const;
}
