import { ProgressDirection } from '../types/progress.type';

export function toBarPerc(n: number, direction: ProgressDirection) {
  if (direction === 'rtl') return (1 - n) * 100;
  return (-1 + n) * 100;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(n, max));
}
