import ClickSpark from '../ClickSpark';
import { TextShimmer } from '../TextShimmer';

const RING_RADIUS = 50;
export const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const Preloader = ({ show, refs }) => {
  const { ringGroupRef, progressRingRef, panelRef } = refs;

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <ClickSpark sparkColor="#3B82F6" sparkSize={12} sparkRadius={20} sparkCount={8} duration={500}>
        {/* Single full-screen wipe panel - slides fully off to the left on
            completion, reading as one clean right-to-left sweep. */}
        <div ref={panelRef} className="absolute inset-0 w-full h-full bg-black" />

        {/* Ring Loader */}
        <div
          ref={ringGroupRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center"
        >
          <div className="relative flex items-center justify-center">
            <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90">
              <circle
                cx="56" cy="56" r={RING_RADIUS}
                fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2"
              />
              <circle
                ref={progressRingRef}
                cx="56" cy="56" r={RING_RADIUS}
                fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"
              />
            </svg>
            <span className="font-heading font-extrabold text-white absolute text-xl tracking-tight">
              C3
            </span>
          </div>

          <TextShimmer className="font-mono text-xs uppercase tracking-[0.2em] mt-4" duration={1.4}>
            Learn. Build. Collaborate. Lead.
          </TextShimmer>
        </div>
      </ClickSpark>
    </div>
  );
};

export default Preloader;