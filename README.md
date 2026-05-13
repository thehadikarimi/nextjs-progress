# nextjs-progress

A lightweight and customizable progress for **Next.js** applications that works with both **App Router** and **Pages Router** directory.
It supports custom progress, browser back/forward detection and handles same-page navigations.

## Features

- Works in both **App Router** and **Pages Router** directory
- Fully customizable
- Custom progress support
- Detects browser back/forward and same-page navigations
- Works seamlessly with both JavaScript and TypeScript
- Custom `useRouter` for App Router and `Link` that works with the progress
- `useProgress` hook for manual control (e.g., during data fetching)

## Installation

```bash
npm install nextjs-progress
```

## Usage

### App Router

#### Default Progress Bar

```tsx
'use client';

import { Progress } from 'nextjs-progress/app';
import 'nextjs-progress/css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Progress options={{ showSpinner: true }} />
      </body>
    </html>
  );
}
```

---

#### Custom Progress

```tsx
'use client';

import { Progress } from 'nextjs-progress/app';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Progress className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          Loading...
        </Progress>
      </body>
    </html>
  );
}
```

When working with the **App Router** directory, you can use the progress in two different ways:

1. Make your RootLayout a client component and render the progress directly inside it.
2. Wrap progress in a client component and use it inside your server Layout (Recommended).

### Pages Router

#### Default Progress Bar

```tsx
import type { AppProps } from 'next/app';
import { Progress } from 'nextjs-progress/pages';
import 'nextjs-progress/css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Progress options={{ showSpinner: true }} />
    </>
  );
}
```

---

#### Custom Progress

```tsx
import type { AppProps } from 'next/app';
import { Progress } from 'nextjs-progress/pages';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Progress className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        Loading...
      </Progress>
    </>
  );
}
```

**Note**: When using custom progress, a `data-state` (`"active"` or `"done"`) and `data-progress` attributes will be added to the element. You can use these for CSS transitions and animations.

### Additional Utilities (Hooks & Link)

#### `Link`

A drop-in replacement for `next/link` with progress support.

If you want to disable the progress for a specific link, you can pass the `disableProgress` prop.

```tsx
import Link from 'nextjs-progress/link';

export default function Navigation() {
  return (
    <nav>
      // Standard link with progress
      <Link href="/about">About</Link>
      
      // Link that disables progress
      <Link href="/contact" disableProgress>
        Contact
      </Link>
    </nav>
  );
}
```

---

#### `useRouter` (App Router only)

Custom hook that wraps Next.js App Router.

```tsx
'use client';
import { useRouter } from 'nextjs-progress/app';

export default function Page() {
  const router = useRouter();
  // ...
  router.push('/dashboard'); // Navigate to /dashboard
}
```

---

#### `useProgress`

Hook to manually control progress.

```tsx
'use client';
import { useProgress } from 'nextjs-progress';

export default function Page() {
  const { start, done } = useProgress();
  // ...
  const fetchData = async () => {
    start(); // Start the progress
    await fetch('/api/data');
    done(); // Done the progress
  };
}
```

## Props

| Prop             | Type              | Default     | Description                                                                              |
| ---------------- | ----------------- | ----------- | ---------------------------------------------------------------------------------------- |
| `children`       | `React.ReactNode` | `undefined` | Content to be rendered as custom progress.                                               |
| `as`             | `ElementType`     | `div`       | The HTML element type to render the progress as.                                         |
| `asChild`        | `boolean`         | `false`     | If `true`, the custom progress will be rendered as a child of its content.               |
| `disableSameUrl` | `boolean`         | `true`      | If `false`, progress will be shown when navigating to the same URL.                      |
| `options`        | `ProgressOptions` | `undefined` | Configuration object for the progress behavior. See `ProgressOptions` below for details. |

### ProgressOptions

| options        | Type      | Default  | Description                                                                                                   |
| -------------- | --------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| `easing`       | `string`  | `linear` | The CSS `transition-timing-function` for progress bar animations.                                             |
| `speed`        | `number`  | `200`    | The speed of the progress animation in milliseconds.                                                          |
| `trickle`      | `number`  | `true`   | Whether to enable the “trickle” effect (gradual progress bar increase).                                       |
| `trickleSpeed` | `number`  | `200`    | The speed of the trickle effect in milliseconds.                                                              |
| `showSpinner`  | `boolean` | `false`  | Whether to show a loading spinner with progress bar.                                                          |
| `direction`    | `ltr│rtl` | `ltr`    | Direction of the progress bar. If not provided, it automatically falls back to `document.dir` (if available). |

## Configuration

If you are using nextjs-progress with the **Pages Router** directory, you need to add nextjs-progress to the transpilePackages array in your next.config(.js/.ts) file. This is necessary for the package to be correctly works in **Pages Router** directory.

```tsx
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... other configurations
  transpilePackages: ['nextjs-progress', ...otherPackages],
};

module.exports = nextConfig;
```

## Theming

For advanced customization of the progress bar’s appearance (like color, height and etc.), nextjs-progress utilizes CSS variables. This allows for flexible theming without needing to pass props.

Add these variables to your global CSS file.

Available CSS Variables:

- `--progress-color`: Sets the main color of the progress bar.
- `--progress-height`: Sets the height of the progress bar.
- `--progress-z-index`: Controls the stacking order of the progress bar.
- `--progress-box-shadow`: Sets the shadow for the progress bar.
- `--progress-spinner-size`: Defines the size of the spinner icon.
- `--progress-spinner-top`: Adjusts the top position of the spinner.
- `--progress-spinner-right`: Adjusts the right position of the spinner.
- `--progress-spinner-bottom`: Adjusts the bottom position of the spinner.
- `--progress-spinner-left`: Adjusts the left position of the spinner.
- `--progress-spinner-border-width`: Sets the border width for the spinner.
- `--progress-spinner-animation`: Sets the animation for the spinner.
- `--progress-spinner-animation-duration`: Controls the default animation speed of the spinner.

## License

MIT License
