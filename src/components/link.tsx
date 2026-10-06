import React from 'react';
import NextLink from 'next/link';

import { useProgress } from '../hooks/use-progress';
import { setSkipProgress } from '../utils/progress.util';
import { getCurUrl, isExternalUrl, isSameUrl, normalizeUrl } from '../utils/router.util';

import { Progress } from '../core/progress';

import { TIMEOUT_DELAY } from '../constants';

type LinkProps<T extends React.ElementType> = React.ComponentPropsWithoutRef<T> & {
  disableProgress?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

type CustomLinkProps<T extends React.ElementType> = LinkProps<T> & {
  LinkComponent: T;
};

const CustomLink = React.forwardRef<HTMLAnchorElement, CustomLinkProps<React.ElementType>>(
  (props, ref) => {
    const { LinkComponent, onClick, disableProgress, ...rest } = props;
    const progress = useProgress();
    const { disableSameUrl, basePath, i18nPath } = Progress.getRouting();

    const clickHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (onClick) onClick(e);

      if (e.defaultPrevented) return;

      if ('shallow' in props && props.shallow) return;

      if (e.currentTarget.target === '_blank') return;

      if (e.currentTarget.hasAttribute('download')) return;

      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const href = e.currentTarget.href;

      if (isExternalUrl(href)) return;

      // Tell PagesProgress not to start progress for <Link />.
      setSkipProgress();

      if (disableProgress) return;

      const routingOptions = { basePath, i18nPath };

      if (isSameUrl(href, routingOptions)) {
        if (disableSameUrl) {
          return;
        }

        progress.start();

        setTimeout(() => {
          progress.done();
        }, TIMEOUT_DELAY);

        return;
      }

      // This prevent start progress when hash change
      const curUrl = getCurUrl(routingOptions);
      if (normalizeUrl(href, routingOptions) === curUrl) return;

      progress.start();
    };

    return React.createElement(LinkComponent, {
      ...rest,
      ref,
      onClick: clickHandler,
    });
  },
);

/**
 * Creates a progress-aware link component.
 * 
 * @param LinkComponent - The link component to wrap (e.g., `next/link`).
 * @returns A new link component that integrates with the progress indicator.
 */
export function createLink<T extends React.ElementType>(LinkComponent: T) {
  const ProgressLink = React.forwardRef<HTMLAnchorElement, LinkProps<T>>((props, ref) => (
    <CustomLink {...props} ref={ref} LinkComponent={LinkComponent} />
  ));

  const componentName =
    typeof LinkComponent === 'string'
      ? LinkComponent
      : LinkComponent.displayName || LinkComponent.name || 'Link';

  ProgressLink.displayName = componentName;

  return ProgressLink;
}

/**
 * A React component that extends the HTML `<a>` element to provide [prefetching](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#prefetching)
 * and client-side navigation between routes.
 *
 * It is the primary way to navigate between routes in Next.js.
 *
 * Read more: [Next.js docs: `<Link>`](https://nextjs.org/docs/app/api-reference/components/link)
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps<typeof NextLink>>(
  (props, ref) => <CustomLink {...props} ref={ref} LinkComponent={NextLink} />,
);

Link.displayName = 'Link';
