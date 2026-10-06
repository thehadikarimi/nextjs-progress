import { useCallback } from 'react';
import { useRouter as useNextRouter } from 'next/navigation';

import { useProgress } from './use-progress';
import { getCurUrl, isExternalUrl, isSameUrl, normalizeUrl } from '../utils/router.util';

import { Progress } from '../core/progress';

import { TIMEOUT_DELAY } from '../constants';

import type {
  AppRouterInstance,
  CustomRouterHook,
  NavigateOptions,
  PrefetchOptions,
} from '../types/router.type';

function useProgressRouter<T extends AppRouterInstance = AppRouterInstance>(router: T): T {
  const progress = useProgress();
  const { disableSameUrl, basePath, i18nPath } = Progress.getRouting();

  const handleShowProgress = useCallback(
    (href: string) => {
      const targetUrl = new URL(href, window.location.href);

      if (isExternalUrl(targetUrl.href)) return;

      const routingOptions = { basePath, i18nPath };

      if (isSameUrl(targetUrl.href, routingOptions)) {
        if (disableSameUrl) return;

        progress.start();

        setTimeout(() => {
          progress.done();
        }, TIMEOUT_DELAY);

        return;
      }

      // Do not start progress for hash-only navigation.
      const curUrl = getCurUrl(routingOptions);
      if (normalizeUrl(targetUrl.href, routingOptions) === curUrl) return;

      progress.start();
    },
    [progress, disableSameUrl, basePath, i18nPath],
  );

  const push = useCallback(
    (href: string, options?: NavigateOptions) => {
      handleShowProgress(href);
      router.push(href, options);
    },
    [router, handleShowProgress],
  );

  const replace = useCallback(
    (href: string, options?: NavigateOptions) => {
      handleShowProgress(href);
      router.replace(href, options);
    },
    [router, handleShowProgress],
  );

  const back = useCallback(() => {
    if (window.history.length <= 1) return;
    
    const routingOptions = { basePath, i18nPath };
    const prevUrl = getCurUrl(routingOptions);

    router.back();

    setTimeout(() => {
      if (prevUrl !== getCurUrl(routingOptions)) progress.start();
    }, TIMEOUT_DELAY);
  }, [router, progress]);

  const forward = useCallback(() => {
    const routingOptions = { basePath, i18nPath };
    const prevUrl = getCurUrl(routingOptions);

    router.forward();

    setTimeout(() => {
      if (prevUrl !== getCurUrl(routingOptions)) progress.start();
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
  return useProgressRouter(router);
}

/**
 * Creates a custom router with progress tracking.
 *
 * @param useCustomRouter - A function that returns a custom router instance.
 * @returns A function that returns the custom router with progress tracking.
 */
export function createRouter<T extends AppRouterInstance = AppRouterInstance>(
  useCustomRouter: CustomRouterHook<T>,
): () => T {
  return function useCustomProgressRouter(): T {
    const router = useCustomRouter();
    return useProgressRouter(router);
  };
}
