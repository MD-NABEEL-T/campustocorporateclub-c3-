import { useEffect, useRef, useId } from 'react';

// Wraps the "finisher-header" package (a lightweight vanilla-JS animated
// blob header). The package attaches `window.FinisherHeader` as a side
// effect when imported, so it's dynamically imported here rather than at
// the top of the file - keeps it out of the main bundle until actually used.
const FinisherHeader = ({ config, className = '', children }) => {
  const ref = useRef(null);
  const uid = useId();

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      if (!window.FinisherHeader) {
        await import('finisher-header');
      }
      if (cancelled || !ref.current) return;
      // eslint-disable-next-line no-new
      new window.FinisherHeader(config);
    };

    init();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  return (
    <div ref={ref} id={uid} className={`finisher-header ${className}`}>
      {children}
    </div>
  );
};

export default FinisherHeader;