export function normalizeUrl(href: string): string {
  try {
    const url = new URL(href, window.location.origin);
    return url.origin + url.pathname + url.search;
  } catch {
    return href;
  }
}

export function getCurUrl(): string {
  return normalizeUrl(window.location.href);
}

export function isSameUrl(href: string): boolean {
  const curUrl = getCurUrl();
  href = normalizeUrl(href);
  return href === curUrl;
}

export function isExternalUrl(href: string): boolean {
  try {
    const url = new URL(href, window.location.origin);
    return url.origin !== window.location.origin;
  } catch {
    return false;
  }
}
