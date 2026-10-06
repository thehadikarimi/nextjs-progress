<img referrerpolicy="no-referrer-when-downgrade" src="https://static.scarf.sh/a.png?x-pxid=be2d8a11-9712-4c1d-9963-580b2d4fb133" />

<div align="center">
  <img src="https://raw.githubusercontent.com/thehadikarimi/nextjs-progress/main/media/header.png" alt="nextjs-progress" />
</div>

<br />

<div align="center">
  <a href="https://www.npmjs.com/package/nextjs-progress"><img src="https://img.shields.io/npm/v/nextjs-progress?color=055cf9" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/nextjs-progress"><img src="https://img.shields.io/npm/dm/nextjs-progress?color=cb3837" alt="npm downloads" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/nextjs-progress?color=2ea44f" alt="License" /></a>
  <a href="https://github.com/thehadikarimi/nextjs-progress/stargazers"><img src="https://img.shields.io/github/stars/thehadikarimi/nextjs-progress?style=social" alt="GitHub stars" /></a>
</div>

<div align="center">
  <a href="https://bundlejs.com/?q=nextjs-progress"><img src='https://deno.bundlejs.com/?q=nextjs-progress&config={"esbuild":{"external":["react","react-dom","next"]}}&badge=detailed' alt="Bundle size" /></a>
</div>

# nextjs-progress

A lightweight and customizable progress indicator for **Next.js** applications.

Supports both the **App Router** and **Pages Router**.

## Features

- App Router and Pages Router support
- Customizable progress indicator
- Browser back/forward navigation
- Same-URL navigation
- `basePath` support
- Locale-prefixed routes (`i18nPath`)
- Progress-aware `Link`
- Custom `createRouter()` and `createLink()` APIs
- Manual progress control with `useProgress`
- TypeScript support

## Installation

```bash
npm install nextjs-progress
```

## App Router

### Progress

```tsx
'use client';

import { Progress } from 'nextjs-progress/app';
import 'nextjs-progress/css';

export default function ProgressProvider() {
  return <Progress />;
}
```

You can pass progress options:

```tsx
<Progress
  options={{
    showSpinner: true,
    trickle: true,
  }}
/>
```

### Custom Progress

Use `children`, `as`, or `asChild` to customize the progress component.

```tsx
'use client';

import { Progress } from 'nextjs-progress/app';

export default function ProgressProvider() {
  return (
    <Progress className="fixed inset-0 z-50 flex items-center justify-center">Loading...</Progress>
  );
}
```

### `useRouter`

The package provides a progress-aware App Router `useRouter`.

```tsx
'use client';

import { useRouter } from 'nextjs-progress/app';

export default function Example() {
  const router = useRouter();

  return <button onClick={() => router.push('/dashboard')}>Dashboard</button>;
}
```

## Pages Router

### Progress

```tsx
import type { AppProps } from 'next/app';

import { Progress } from 'nextjs-progress/pages';
import 'nextjs-progress/css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Progress />
    </>
  );
}
```

### Configuration

Add `nextjs-progress` to `transpilePackages` in `next.config.js` or `next.config.ts`.

```ts
const nextConfig = {
  transpilePackages: ['nextjs-progress'],
};

export default nextConfig;
```

## Link

Use `nextjs-progress/link` as a progress-aware replacement for `next/link`.

```tsx
import Link from 'nextjs-progress/link';

export default function Navigation() {
  return (
    <nav>
      <Link href="/about">About</Link>

      <Link href="/contact" disableProgress>
        Contact
      </Link>
    </nav>
  );
}
```

Use `disableProgress` to prevent progress from starting for a specific link.

## Custom Navigation

The `nextjs-progress/navigation` entry point provides:

- `createRouter()`
- `createLink()`

These APIs can be used with custom router and Link implementations.

### `createRouter()`

Wrap a custom router hook:

```tsx
'use client';

import { createRouter } from 'nextjs-progress/navigation';
import { useMyRouter } from './my-router';

export const useRouter = createRouter(useMyRouter);
```

The wrapped router provides progress handling for supported navigation methods.

### `createLink()`

Wrap a custom Link component:

```tsx
'use client';

import { createLink } from 'nextjs-progress/navigation';
import MyLink from './my-link';

export const Link = createLink(MyLink);
```

The returned component supports the original Link props and `disableProgress`.

### next-intl

`createRouter()` and `createLink()` can be used with `next-intl`.

```tsx
'use client';

import { createNavigation } from 'next-intl/navigation';
import { createLink, createRouter } from 'nextjs-progress/navigation';

import { routing } from './routing';

const {
  Link: NextIntlLink,
  redirect,
  usePathname,
  useRouter: useNextIntlRouter,
  getPathname,
} = createNavigation(routing);

const useRouter = createRouter(useNextIntlRouter);
const Link = createLink(NextIntlLink);

export { getPathname, Link, redirect, usePathname, useRouter };
```

> The module that calls `createLink()` must be a Client Component.

You can then use the wrapped APIs normally:

```tsx
'use client';

import { Link, useRouter } from './navigation';

export default function Example() {
  const router = useRouter();

  return (
    <>
      <Link href="/about">About</Link>

      <button onClick={() => router.push('/dashboard')}>Dashboard</button>
    </>
  );
}
```

## Routing Options

### `basePath`

```tsx
<Progress basePath="/docs" />
```

### `i18nPath`

```tsx
<Progress i18nPath />
```

### Both

```tsx
<Progress basePath="/docs" i18nPath />
```

### `disableSameUrl`

Enable progress for same-URL navigation:

```tsx
<Progress disableSameUrl={false} />
```

## `useProgress`

Control the progress indicator manually.

```tsx
'use client';

import { useProgress } from 'nextjs-progress';

export default function Example() {
  const { start, done } = useProgress();

  const loadData = async () => {
    start();

    try {
      await fetch('/api/data');
    } finally {
      done();
    }
  };

  return <button onClick={loadData}>Load data</button>;
}
```

## Progress Options

```tsx
<Progress
  options={{
    easing: 'linear',
    speed: 200,
    trickle: true,
    trickleSpeed: 200,
    showSpinner: false,
    direction: 'ltr',
    exitDuration: 200,
  }}
/>
```

| Option         | Type             | Default | Description                                                                                                                                                   |
| -------------- | ---------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `easing`       | `string`         | —       | The CSS `transition-timing-function` used for progress bar animations.                                                                                        |
| `speed`        | `number`         | —       | The animation speed of the progress bar, in milliseconds.                                                                                                     |
| `trickle`      | `boolean`        | —       | Enables or disables the automatic trickle effect that gradually increases progress while navigation is in progress.                                           |
| `trickleSpeed` | `number`         | —       | The interval, in milliseconds, between automatic trickle updates.                                                                                             |
| `showSpinner`  | `boolean`        | —       | Determines whether a loading spinner is displayed alongside the progress bar.                                                                                 |
| `direction`    | `'ltr' \| 'rtl'` | —       | Sets the direction of the progress bar. If not specified, the direction can fall back to the document direction when available.                               |
| `exitDuration` | `number`         | —       | The time, in milliseconds, that the progress indicator remains mounted after completion. This should match the duration of your exit transition or animation. |

## Progress Props

| Prop             | Type                | Default | Description                                                                                                                  |
| ---------------- | ------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `disableSameUrl` | `boolean`           | `true`  | If `false`, progress will also be shown when navigating to the current URL.                                                  |
| `basePath`       | `string`            | `''`    | The base path configured for your Next.js application.                                                                       |
| `i18nPath`       | `boolean`           | `false` | Enables support for locale-prefixed routes.                                                                                  |
| `options`        | `ProgressOptions`   | —       | Configuration options for the progress indicator. See `ProgressOptions` below.                                               |
| `as`             | `React.ElementType` | `'div'` | The element or component used to render the progress indicator.                                                              |
| `asChild`        | `boolean`           | `false` | If `true`, renders the progress indicator using the provided child element or component instead of creating its own element. |
| `children`       | `React.ReactNode`   | —       | Custom content rendered inside the progress indicator.                                                                       |

## Theming

Import the package CSS:

```tsx
import 'nextjs-progress/css';
```

Customize the progress indicator with CSS variables:

```css
:root {
  --progress-color: #3c6df0;
  --progress-height: 3px;
  --progress-z-index: 9999;
  --progress-box-shadow: 0 0 10px var(--progress-color);

  --progress-spinner-size: 18px;
  --progress-spinner-top: 15px;
  --progress-spinner-right: 15px;
  --progress-spinner-bottom: auto;
  --progress-spinner-left: auto;
  --progress-spinner-border-width: 2px;
  --progress-spinner-animation: spin 0.4s linear infinite;
  --progress-spinner-animation-duration: 0.4s;
}
```

## License

MIT
