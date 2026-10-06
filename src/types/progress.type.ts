import type { ComponentPropsWithoutRef, ElementType } from 'react';

export type ProgressDirection = 'ltr' | 'rtl';

export type ProgressOptions = {
  easing?: string;
  speed?: number;
  trickle?: boolean;
  trickleSpeed?: number;
  showSpinner?: boolean;
  direction?: ProgressDirection;
  exitDuration?: number;
};

export type ProgressRoutingOptions = {
  disableSameUrl?: boolean;
  basePath?: string;
  i18nPath?: boolean;
};

export type UseProgressReturn = {
  /**
   * The current progress value.
   */
  status: number | null;
  /**
   * The current configuration settings.
   */
  settings: ProgressOptions;
  /**
   * Start the progress.
   */
  start: () => void;
  /**
   * Complete the progress.
   */
  done: (force?: boolean) => void;
  /**
   * Set the progress to a specific value (0–1).
   */
  set: (n: number) => void;
  /**
   * Increment the progress value (0–1).
   */
  inc: (amount?: number) => void;
  /**
   * Updates progress settings.
   */
  configure: (options: Partial<ProgressOptions>) => void;
};

export type ProgressProps<T extends ElementType = 'div'> = {
  as?: T;
  asChild?: boolean;
  children?: React.ReactNode;
  disableSameUrl?: boolean;
  basePath?: string;
  i18nPath?: boolean;
  options?: ProgressOptions;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children'>;
