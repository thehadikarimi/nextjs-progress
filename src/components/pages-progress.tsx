import React from 'react';
import { useRouter as useNextRouter } from 'next/router';

import Progress from './progress';

import { useProgress } from '../hooks/use-progress';
import { getCurUrl, isSameUrl, normalizeUrl } from '../utils/router.util';

import type { ProgressProps } from '../types/progress.type';

/**
 * Progress component for Next.js Pages Router directory.
 * This component displays a visual progress during client-side page transitions.
 * It integrates seamlessly with your application's routing to provide a smooth user experience during navigation.
 *
 * @example
 * ```tsx
 * import type { AppProps } from "next/app";
 * import { Progress } from 'nextjs-progress/pages';
 * import 'nextjs-progress/css';
 *
 * export default function App({ Component, pageProps }: AppProps) {
 *   return (
 *     <>
 *       <Component {...pageProps} />
 *       <Progress options={{ showSpinner: true }} />
 *     </>
 *   );
 * }
 * ```
 *
 * Read more: [nextjs-progress docs](https://github.com/thehadikarimi/nextjs-progress#readme)
 */
export function PagesProgress<T extends React.ElementType = 'div'>(props: ProgressProps<T>) {
  const router = useNextRouter();
  const progress = useProgress();
  const prevUrlRef = React.useRef<string>('');

  React.useEffect(() => {
    const handleStart = (url: string, { shallow }: { shallow: boolean }) => {
      if (shallow) return;

      // Next.js Pages Router does not update the `url` argument on browser
      // back/forward, so we detect popstate by checking the current URL.
      // If it's unchanged, treat it as a backward/forward navigation and
      // use the previous URL instead, so progress can start correctly.
      if (prevUrlRef.current && normalizeUrl(url) === getCurUrl()) url = prevUrlRef.current;

      if (isSameUrl(url) && progress.settings.disableSameUrl) return;

      progress.start();
    };

    const handleComplete = () => {
      progress.done();
      prevUrlRef.current = getCurUrl();
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [progress.settings.disableSameUrl]);

  return <Progress {...props} />;
}
