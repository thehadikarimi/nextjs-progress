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

  // Store the last settings to prevent redundant configurations
  private static lastSettings: Partial<ProgressOptions> | null = null;

  // Timer for the automatic trickle increment effect
  private static trickleInterval: ReturnType<typeof setTimeout> | null = null;

  // List of components/hooks that want to be notified on every status change
  private static listeners: (() => void)[] = [];

  // Configure Progress with new options
  static configure(options: Partial<ProgressOptions>) {
    const newSettings = { ...this.settings, ...options };

    if (JSON.stringify(newSettings) !== JSON.stringify(this.lastSettings)) {
      this.settings = newSettings;
      this.lastSettings = newSettings;
      this.notify();
    }
  }

  // Set the Progress status
  static set(n: number) {
    if (this.status === null) return;

    n = clamp(n, PROGRESS_MIN, PROGRESS_MAX);

    if (n === PROGRESS_MAX) {
      this.status = PROGRESS_MAX;

      setTimeout(() => {
        this.status = null;
        this.notify();
      }, this.settings.speed + TIMEOUT_DELAY);
    }

    this.status = n;
    this.notify();
  }

  // Start the Progress
  static start() {
    if (this.status !== null) return;

    this.status = 0;
    this.notify();

    if (this.settings.trickle) {
      this.trickleLoop();
    }
  }

  // Complete the Progress
  static done(force: boolean = false) {
    if (!force && this.status === null) return;

    if (this.trickleInterval) {
      clearTimeout(this.trickleInterval);
      this.trickleInterval = null;
    }

    this.status = PROGRESS_MAX;
    this.notify();

    setTimeout(() => {
      this.status = null;
      this.notify();
    }, this.settings.speed + TIMEOUT_DELAY);
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

    this.status = n;
    this.notify();
  }

  // Runs the trickle increment loop while Progress is active
  private static trickleLoop() {
    this.trickleInterval = setTimeout(() => {
      if (this.status === null) return;

      if (this.status < PROGRESS_MAX) {
        this.inc();
        this.trickleLoop();
      }
    }, this.settings.trickleSpeed);
  }

  // Notify all subscribed components/hooks that status changed
  private static notify() {
    this.listeners.forEach((cb) => cb());
  }

  // Allow React components to subscribe to status changes. Returns unsubscribe function
  static subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}
