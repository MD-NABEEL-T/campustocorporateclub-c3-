import { motion, useScroll, useTransform } from 'motion/react';

// The Ascent line - a single scroll-linked stroke that threads through the
// entire home page as a background "spine", drawing itself as the page is
// read, then resolving into an arrowhead (echoing the C3 logo mark) near
// the Join section.
//
// Deliberately ambient rather than scroll-spy precise: the path is drawn in
// a normalized 100x1000 coordinate box and stretched to fill the full page
// height via preserveAspectRatio="none", so it isn't pinned to exact section
// pixel boundaries. That's a reasonable trade for a first pass - it reads as
// a continuous trajectory without requiring per-breakpoint measurement of
// every section's height. Nudge the `d` values below to retune the curve
// once real content settles.
//
// Rendered with mix-blend-mode: screen at low-ish opacity. Two effects fall
// out of that for free: (1) it glows against every section's black
// background without needing per-section z-index gymnastics, and (2) screen-
// blending a colored line over white text produces virtually no visible
// change (screen(white, anything) stays white), so the line can pass behind
// headings without hurting legibility - no manual path-routing around type
// required.
export const AscentLine = ({ target }) => {
  const { scrollYProgress } = useScroll({
    target,
    offset: ['start start', 'end end']
  });

  const lineOffset = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const arrowOffset = useTransform(scrollYProgress, [0.85, 1], [1, 0]);

  return (
    <div className="absolute inset-0 z-30 pointer-events-none mix-blend-screen opacity-70">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ascent-gradient" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#818CF8" stopOpacity="0.55" />
            <stop offset="80%" stopColor="#A78BFA" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#E9D5FF" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        <motion.path
          d="M10,1000 C10,950 18,920 10,880 C4,840 13,800 8,760
             C3,720 14,680 9,640 C4,600 15,560 8,520
             C2,480 14,440 9,400 C4,360 15,320 8,280
             C2,240 13,200 9,160 C6,130 14,100 20,70
             C30,40 46,26 62,16 C74,9 84,4 92,1"
          stroke="url(#ascent-gradient)"
          strokeWidth="0.55"
          strokeLinecap="round"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: lineOffset,
            filter: 'drop-shadow(0 0 6px rgba(129,140,248,0.5))'
          }}
        />

        {/* Arrowhead flourish - the payoff, resolves as the reader
            approaches Join, echoing the arrow cut through the C3 logo. */}
        <motion.path
          d="M84,10 L94,1 M94,1 L86,3 M94,1 L91,9"
          stroke="url(#ascent-gradient)"
          strokeWidth="0.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: arrowOffset,
            filter: 'drop-shadow(0 0 6px rgba(233,213,255,0.6))'
          }}
        />
      </svg>
    </div>
  );
};

export default AscentLine;
