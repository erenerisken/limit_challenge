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

      if (serialized === undefined || serialized === null || serialized === '' || isDefaultValue) {
        params.delete(name);
      } else {
        params.set(name, String(serialized));
      }

      const queryString = params.toString();
      const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

      if (replace) {
        router.replace(nextUrl, { scroll: false });
      } else {
        router.push(nextUrl, { scroll: false });
      }
    },
    [defaultValue, equalityFn, name, pathname, replace, router, searchParams, serialize, value],
  );

  return [value, setValue] as const;
}
