import React from 'react';
import { createPortal } from 'react-dom';

import { useProgress } from '../hooks/use-progress';
import { toBarPerc } from '../utils/progress.util';

import { PROGRESS_MAX } from '../constants';

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
  const perc = toBarPerc(
    progress.status ?? PROGRESS_MAX,
    progress.settings.direction as ProgressDirection,
  );

  React.useEffect(() => {
    const direction =
      options?.direction || (document.dir as ProgressDirection) || progress.settings.direction;
    const exitDuration = isCustomProgress
      ? (options?.exitDuration ?? progress.settings.exitDuration)
      : (options?.speed ?? progress.settings.speed);

    progress.configure({ ...options, disableSameUrl, direction, exitDuration });
  }, [options, disableSameUrl, isCustomProgress, progress]);

  React.useEffect(() => {
    if (isActive) {
      setMounted(true);
      return;
    }

    const stateTimeout = setTimeout(() => {
      setMounted(false);
    }, progress.settings.exitDuration);

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
      dir={progress.settings.direction}
      style={{
        ...(!isActive && {
          opacity: '0',
          transition: `opacity ${progress.settings.speed}ms ${progress.settings.easing}`,
        }),
      }}
    >
      <div
        className="bar"
        style={{
          transform: `translate3d(${perc}%, 0, 0)`,
          transition: `transform ${progress.settings.speed}ms ${progress.settings.easing}`,
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
