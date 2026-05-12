import { ProgressDirection } from '../types/progress.type';

export function toBarPerc(n: number, direction: ProgressDirection) {
  if (direction === 'rtl') return (1 - n) * 100;
  return (-1 + n) * 100;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(n, max));
}

// Used to prevent starting progress in the Pages Router directory when navigation was triggered
// by <Link />. This flag resets automatically after being read.
let skipProgress: boolean = false;

export function setSkipProgress(): void {
  skipProgress = true;
}

export function shouldSkipProgress(): boolean {
  const prevSkipProgress = skipProgress;
  skipProgress = false;
  return prevSkipProgress;
}
