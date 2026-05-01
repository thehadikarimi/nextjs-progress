import { useCallback, useSyncExternalStore } from 'react';

import { Progress } from '../core/progress';

import type { ProgressOptions, UseProgressReturn } from '../types/progress.type';

/**
 * This hook allows you to control progress.
 *
 * @example
 * ```tsx
 * 'use client'
 * import { useProgress } from 'nextjs-progress';
 *
 * export default function Page() {
 *   const { start, done } = useProgress();
 *   // ...
 *   const fetchData = async () => {
 *     start(); // Start the progress
 *     await fetch('/api/data');
 *     done(); // Done the progress
 *   };
 * }
 * ```
 */
export function useProgress(): UseProgressReturn {
  const status = useSyncExternalStore(
    (cb) => Progress.subscribe(cb),
    () => Progress.status,
    () => null,
  );

  const settings = useSyncExternalStore(
    (cb) => Progress.subscribe(cb),
    () => Progress.settings,
    () => Progress.settings,
  );

  const start = useCallback(() => Progress.start(), []);

  const done = useCallback((force?: boolean) => Progress.done(force), []);

  const set = useCallback((n: number) => Progress.set(n), []);

  const inc = useCallback((amount?: number) => Progress.inc(amount), []);

  const configure = useCallback((opts: Partial<ProgressOptions>) => Progress.configure(opts), []);

  return {
    status,
    settings,
    start,
    done,
    set,
    inc,
    configure,
  };
}
