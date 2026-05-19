import React from 'react';
import { createPortal } from 'react-dom';

import { useProgress } from '../hooks/use-progress';
import { toBarPerc } from '../utils/progress.util';

import type { ProgressDirection, ProgressProps } from '../types/progress.type';

function Progress<T extends React.ElementType = 'div'>(
  props: ProgressProps<T>,
): React.ReactElement | null {
  const { as, asChild, children, disableSameUrl = true, options, ...rest } = props;
  const Comp = as || 'div';
  const isCustomProgress = children || as;

  const [mounted, setMounted] = React.useState(false);

  const progress = useProgress();
  const isActive = progress.status !== null;
  const dataState = isActive ? 'active' : 'done';
  const dataProgress = progress.status === null ? 100 : Math.round(progress.status * 100);
  const perc = toBarPerc(progress.status ?? 0, progress.settings.direction as ProgressDirection);

  React.useEffect(() => {
    let dir = progress.settings.direction;

    if (options?.direction) {
      dir = options.direction;
    } else if (document.dir) {
      dir = document.dir as ProgressDirection;
    }

    progress.configure({ ...options, disableSameUrl, direction: dir });
  }, [options, disableSameUrl]);

  React.useEffect(() => {
    if (isActive) {
      setMounted(true);
      return;
    }

    const delay = isCustomProgress ? progress.settings.exitDuration : progress.settings.speed;
    const stateTimeout = setTimeout(() => {
      setMounted(false);
    }, delay);

    return () => clearTimeout(stateTimeout);
  }, [isActive]);

  React.useEffect(() => {
    if (dataState === 'active') {
      document.body.classList.add('progress-busy');
    } else {
      document.body.classList.remove('progress-busy');
    }
  }, [dataState]);

  if (asChild && !React.isValidElement(children)) {
    throw new Error(
      '[Progress]: When using the \`asChild\` prop, the \`children\` must be a valid React Element.',
    );
  }

  if (!mounted) return null;

  if (isCustomProgress) {
    return createPortal(
      <>
        {asChild ? (
          React.cloneElement(children as React.ReactElement, {
            ...rest,
            'data-state': dataState,
            'data-progress': dataProgress,
          })
        ) : (
          <Comp {...rest} data-state={dataState} data-progress={dataProgress}>
            {children}
          </Comp>
        )}
      </>,
      document.body,
    );
  }

  return createPortal(
    <div
      id="progress"
      style={{
        opacity: isActive ? '1' : '0',
        transition: `opacity ${progress.settings.speed}ms ${progress.settings.easing}`,
      }}
      dir={progress.settings.direction}
    >
      <div
        className="bar"
        style={{
          transition: `transform ${progress.settings.speed}ms ${progress.settings.easing}`,
          transform: isActive ? `translate3d(${perc}%, 0, 0)` : 'none',
        }}
      >
        <div className="peg" />
      </div>
      {progress.settings.showSpinner && (
        <div className="spinner">
          <div className="spinner-icon" />
        </div>
      )}
    </div>,
    document.body,
  );
}

export default Progress;
