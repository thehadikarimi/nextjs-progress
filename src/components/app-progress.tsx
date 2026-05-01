import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import Progress from './progress';

import { useProgress } from '../hooks/use-progress';
import { getCurUrl } from '../utils/router.util';

import { TIMEOUT_DELAY } from '../constants';

import type { ProgressProps } from '../types/progress.type';

function AppProgressComponent<T extends React.ElementType = 'div'>(props: ProgressProps<T>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const progress = useProgress();
  const prevUrlRef = React.useRef<string>('');

  // Delay needed because with React.Suspense, Next.js updates the URL before
  // the transition visibly finishes (esp. on back/forward). Without this delay,
  // prevUrlRef updates too soon and progress won’t start and done.
  React.useEffect(() => {
    const curUrl = getCurUrl();

    if (prevUrlRef.current && prevUrlRef.current !== curUrl) {
      setTimeout(() => {
        progress.done();
      }, TIMEOUT_DELAY);
    }

    setTimeout(() => {
      prevUrlRef.current = curUrl;
    }, TIMEOUT_DELAY);
  }, [pathname, searchParams]);

  React.useEffect(() => {
    const handlePopState = () => {
      const curUrl = getCurUrl();

      if (prevUrlRef.current === curUrl) return;

      progress.start();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return <Progress {...props} />;
}

/**
 * Progress component for Next.js App Router directory.
 * This component displays a visual progress during client-side page transitions.
 * It integrates seamlessly with your application's routing to provide a smooth user experience during navigation.
 *
 * @example
 * ```tsx
 * 'use client';
 * import { Progress } from 'nextjs-progress/app';
 * import 'nextjs-progress/css';
 *
 * export default function RootLayout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <html lang="en">
 *       <body>
 *         {children}
 *         <Progress options={{ showSpinner: true }} />
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 *
 * Read more: [nextjs-progress docs](https://github.com/thehadikarimi/nextjs-progress#readme)
 */
export function AppProgress<T extends React.ElementType = 'div'>(props: ProgressProps<T>) {
  return (
    <React.Suspense>
      <AppProgressComponent {...props} />
    </React.Suspense>
  );
}
