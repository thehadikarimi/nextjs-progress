type RoutingOptions = {
  basePath: string;
  i18nPath: boolean;
};

function stripBasePath(pathname: string, basePath: string): string {
  const prefix = `/${basePath.replace(/^\/+|\/+$/g, '')}`;

  if (prefix === '/' || (pathname !== prefix && !pathname.startsWith(`${prefix}/`))) {
    return pathname;
  }

  return pathname.slice(prefix.length) || '/';
}

function getLocale(pathname: string, basePath: string): string | undefined {
  const parts = stripBasePath(pathname, basePath).split('/');
  return parts[1] || undefined;
}

function stripLocale(pathname: string, locale: string | undefined): string {
  const parts = pathname.split('/');

  // Only strip the current locale. A different locale is a real navigation.
  if (locale && parts[1] === locale) {
    parts.splice(1, 1);
  }

  return parts.join('/') || '/';
}

/** Normalize a URL for route comparison, ignoring the configured base path and current locale prefix. */
export function normalizeUrl(href: string, { basePath, i18nPath }: RoutingOptions): string {
  try {
    const url = new URL(href, window.location.href);
    let pathname = stripBasePath(url.pathname, basePath);

    if (i18nPath) {
      const currentLocale = getLocale(window.location.pathname, basePath);
      pathname = stripLocale(pathname, currentLocale);
    }

    return url.origin + pathname + url.search;
  } catch {
    return href;
  }
}

export function getCurUrl(options: RoutingOptions): string {
  return normalizeUrl(window.location.href, options);
}

export function isSameUrl(href: string, options: RoutingOptions): boolean {
  return normalizeUrl(href, options) === getCurUrl(options);
}

export function isExternalUrl(href: string): boolean {
  try {
    const url = new URL(href, window.location.href);
    return url.origin !== window.location.origin;
  } catch {
    return false;
  }
}
