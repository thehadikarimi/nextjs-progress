import React from 'react';
import NextLink from 'next/link';

import { useProgress } from '../hooks/use-progress';
import { getCurUrl, isExternalUrl, isSameUrl, normalizeUrl } from '../utils/router.util';

import { TIMEOUT_DELAY } from '../constants';

type Props = React.ComponentPropsWithRef<typeof NextLink> & {
  /**
   * Prevents the progress from showing during navigation.
   * @defaultValue `false`
   */
  disableProgress?: boolean;
};

/**
 * A React component that extends the HTML `<a>` element to provide [prefetching](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#prefetching)
 * and client-side navigation between routes.
 *
 * It is the primary way to navigate between routes in Next.js.
 *
 * Read more: [Next.js docs: `<Link>`](https://nextjs.org/docs/app/api-reference/components/link)
 */
export const Link = React.forwardRef<HTMLAnchorElement, Props>((props, ref) => {
  const { onClick, disableProgress, ...rest } = props;
  const progress = useProgress();

  const clickHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);

    if (e.defaultPrevented) return;

    if (props.shallow) return;

    if (e.currentTarget.target === '_blank') return;

    if (e.currentTarget.hasAttribute('download')) return;

    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    if (disableProgress) return;

    const href = e.currentTarget.href;

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
  };

  return <NextLink {...rest} ref={ref} onClick={clickHandler} />;
});
