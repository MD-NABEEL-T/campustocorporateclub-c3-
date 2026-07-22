const RING_RADIUS = 50;
export const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const Preloader = ({ show, refs }) => {
  const {
    ringGroupRef,
    progressRingRef,
    leftPanelRef,
    rightPanelRef,
    hudRefs,
    bootLineRef,
  } = refs;

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      <div ref={leftPanelRef} className="absolute top-0 left-0 w-1/2 h-full bg-[#071A2B]" />
      <div ref={rightPanelRef} className="absolute top-0 right-0 w-1/2 h-full bg-[#071A2B]" />

      {/* Top HUD text */}
      <span ref={(el) => (hudRefs.current[0] = el)} className="absolute top-8 left-8 text-[11px] font-mono text-[#94A3B8] uppercase tracking-widest">
        SYS://C3-PLATFORM
      </span>
      <span ref={(el) => (hudRefs.current[1] = el)} className="absolute top-8 right-8 text-[11px] font-mono text-[#38BDF8] uppercase tracking-widest">
        AUTHORIZED ACCESS
      </span>

      {/* Boot sequence log */}
      <span ref={bootLineRef} className="absolute bottom-8 left-8 text-[11px] font-mono text-[#94A3B8] uppercase tracking-widest">
        INITIALIZING C3 CORE...
      </span>

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
              fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round"
            />
          </svg>
          <span className="font-heading font-extrabold text-[#F8FAFC] absolute text-xl tracking-tight">
            C3
          </span>
        </div>

        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#94A3B8] mt-4">
          Learn. Build. Collaborate. Lead.
        </span>
      </div>
    </div>
  );
};

export default Preloader;
