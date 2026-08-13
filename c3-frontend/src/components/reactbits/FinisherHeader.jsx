import { useEffect, useId } from 'react';
import 'finisher-header';

/**
 * React wrapper around the `finisher-header` npm package.
 *
 * That package isn't a real ES module - it's a legacy script that attaches
 * `window.FinisherHeader` as a side effect and expects an existing DOM
 * element (found via `getElementsByClassName`) to render its canvas into.
 * This component does that lookup safely inside React by giving each
 * instance a unique class name, so multiple FinisherHeaders can exist on
 * the same page without colliding.
 *
 * Note: the underlying library has no destroy/cleanup API. Its animation
 * loop keeps running via requestAnimationFrame even after the canvas is
 * removed from the DOM on unmount - harmless (it just draws to a detached
 * canvas), but worth knowing if this ends up mounting/unmounting a lot.
 */
const FinisherHeader = ({ config, className = '', children }) => {
  const uid = useId().replace(/:/g, '');
  const instanceClass = `finisher-header-${uid}`;

  useEffect(() => {
    if (!window.FinisherHeader) return;
    // eslint-disable-next-line no-new
    new window.FinisherHeader({ ...config, className: instanceClass });
  }, [config, instanceClass]);

  return (
    <div className={`finisher-header ${instanceClass} relative overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export default FinisherHeader;
