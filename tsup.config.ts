import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/app.ts', 'src/pages.ts', 'src/link.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: true,
  external: ['react', 'react-dom', 'next/link', 'next/router', 'next/navigation'],
});
