import type { ComponentPropsWithoutRef, ElementType } from 'react';

export type ProgressDirection = 'ltr' | 'rtl';

export type ProgressOptions = {
  minimum?: number;
  maximum?: number;
  easing?: string;
  speed?: number;
  trickle?: boolean;
  trickleSpeed?: number;
  showSpinner?: boolean;
  disableSameUrl?: boolean;
  direction?: ProgressDirection;
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
   * Set the progress to a specific value (0–maximum as defined in settings).
   */
  set: (n: number) => void;
  /**
   * Increment the progress value (0–maximum as defined in settings).
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
  options?: Omit<ProgressOptions, 'disableSameUrl'>;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children'>;
