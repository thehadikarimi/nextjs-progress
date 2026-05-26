import { clamp } from '../utils/progress.util';

import { PROGRESS_MAX, PROGRESS_MIN, TIMEOUT_DELAY } from '../constants';

import type { ProgressOptions } from '../types/progress.type';

const defaultSettings: Required<ProgressOptions> = {
  easing: 'linear',
  speed: 200,
  trickle: true,
  trickleSpeed: 200,
  showSpinner: false,
  disableSameUrl: true,
  direction: 'ltr',
  exitDuration: 200,
};

export class Progress {
  static settings: Required<ProgressOptions> = defaultSettings;
  static status: number | null = null;

  // Timer for the automatic trickle increment effect
  private static trickleTimer: ReturnType<typeof setTimeout> | null = null;

  // Track pending initialization and exit timers
  private static initTimer: ReturnType<typeof setTimeout> | null = null;
  private static exitTimer: ReturnType<typeof setTimeout> | null = null;

  // List of components/hooks that want to be notified on every status change
  private static listeners: Set<() => void> = new Set();

  // Configure Progress with new options
  static configure(options: Partial<ProgressOptions>) {
    const changed = (Object.keys(options) as (keyof ProgressOptions)[]).some(
      (key) => this.settings[key] !== options[key],
    );

    if (!changed) return;

    this.settings = { ...this.settings, ...options };
    this.notify();
  }

  // Set the Progress status
  static set(n: number) {
    n = clamp(n, PROGRESS_MIN, PROGRESS_MAX);

    if (this.status === n) return;

    // Clear any pending exit timer - new progress cycle is starting
    if (this.exitTimer) {
      clearTimeout(this.exitTimer);
      this.exitTimer = null;
    }

    // Initial render: set to 0 immediately, then animate to target
    if (this.status === null) {
      this.status = 0;
      this.notify();

      this.initTimer = setTimeout(() => {
        this.initTimer = null;
        this.set(n);
      }, TIMEOUT_DELAY);

      return;
    }

    // If we're still in init phase and done() is called, skip to completion
    if (this.initTimer && n === PROGRESS_MAX) {
      clearTimeout(this.initTimer);
      this.initTimer = null;
    }

    // Completion: stop trickle, set to 100%, then hide after exit duration
    if (n === PROGRESS_MAX) {
      if (this.trickleTimer) {
        clearTimeout(this.trickleTimer);
        this.trickleTimer = null;
      }

      this.status = PROGRESS_MAX;
      this.notify();

      this.exitTimer = setTimeout(() => {
        this.exitTimer = null;
        this.status = null;
        this.notify();
      }, this.settings.exitDuration + TIMEOUT_DELAY);

      return;
    }

    this.status = n;
    this.notify();
  }

  // Start the Progress
  static start() {
    if (this.status !== null) return;

    this.set(0);

    if (this.settings.trickle) {
      this.trickleLoop();
    }
  }

  // Complete the Progress
  static done(force: boolean = false) {
    if (!force && this.status === null) return;
    this.set(PROGRESS_MAX);
  }

  // Increment the Progress
  static inc(amount?: number) {
    if (this.status === null) {
      return this.start();
    }

    let n = this.status;

    if (typeof amount !== 'number') {
      if (n >= 0 && n < 0.2) {
        amount = 0.1;
      } else if (n >= 0.2 && n < 0.5) {
        amount = 0.04;
      } else if (n >= 0.5 && n < 0.8) {
        amount = 0.02;
      } else if (n >= 0.8 && n < 0.99) {
        amount = 0.005;
      } else {
        amount = 0;
      }
    }

    n = clamp(n + amount, 0, 0.994);

    this.set(n);
  }

  // Runs the trickle increment loop while Progress is active
  private static trickleLoop() {
    this.trickleTimer = setTimeout(() => {
      if (this.status === null) return;

      if (this.status < PROGRESS_MAX) {
        this.inc();
        this.trickleLoop();
      }
    }, this.settings.trickleSpeed);
  }

  // Notify all subscribed components/hooks that status changed
  private static notify() {
    [...this.listeners].forEach((cb) => cb());
  }

  // Allow React components to subscribe to status changes. Returns unsubscribe function
  static subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
