import { useCallback } from 'react';
import { useRouter as useNextRouter } from 'next/navigation';

import { useProgress } from './use-progress';
import { getCurUrl, isExternalUrl, isSameUrl, normalizeUrl } from '../utils/router.util';

import { TIMEOUT_DELAY } from '../constants';

import type { AppRouterInstance, NavigateOptions, PrefetchOptions } from '../types/router.type';

/**
 * This hook allows you to programmatically change routes inside [Client Component](https://nextjs.org/docs/app/building-your-application/rendering/client-components).
 *
 * @example
 * ```tsx
 * 'use client'
 * import { useRouter } from 'nextjs-progress/app';
 *
 * export default function Page() {
 *   const router = useRouter();
 *   // ...
 *   router.push('/dashboard'); // Navigate to /dashboard
 * }
 * ```
 *
 * Read more: [Next.js Docs: `useRouter`](https://nextjs.org/docs/app/api-reference/functions/use-router)
 */
export function useRouter(): AppRouterInstance {
  const router = useNextRouter();
  const progress = useProgress();

  const handleShowProgress = useCallback(
    (href: string) => {
      if (href.startsWith('?')) {
        href = window.location.pathname + href + window.location.hash;
      } else if (href.startsWith('#')) {
        href = window.location.pathname + window.location.search + href;
      }

      href = window.location.origin + href;

      if (isExternalUrl(href)) return;

      if (isSameUrl(href)) {
        if (progress.settings.disableSameUrl) {
          return;
        }
        setTimeout(() => {
          progress.done();
        }, TIMEOUT_DELAY);
      }

      // This prevent start progress when hash change
      const curUrl = getCurUrl();
      if (href !== curUrl && normalizeUrl(href) === curUrl) return;

      progress.start();
    },
    [progress],
  );

  const push = useCallback(
    (href: string, options?: NavigateOptions) => {
      handleShowProgress(href);
      router.push(href, options);
    },
    [router, progress],
  );

  const replace = useCallback(
    (href: string, options?: NavigateOptions) => {
      handleShowProgress(href);
      router.replace(href, options);
    },
    [router, progress],
  );

  const back = useCallback(() => {
    if (window.history.length <= 1) return;
    const prevUrl = getCurUrl();
    router.back();
    setTimeout(() => {
      if (prevUrl !== getCurUrl()) progress.start();
    }, TIMEOUT_DELAY);
  }, [router, progress]);

  const forward = useCallback(() => {
    const prevUrl = getCurUrl();
    router.forward();
    setTimeout(() => {
      if (prevUrl !== getCurUrl()) progress.start();
    }, TIMEOUT_DELAY);
  }, [router, progress]);

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  const prefetch = useCallback(
    (href: string, options?: PrefetchOptions) => {
      router.prefetch(href, options);
    },
    [router],
  );

  return {
    ...router,
    push,
    replace,
    back,
    forward,
    refresh,
    prefetch,
  };
}
