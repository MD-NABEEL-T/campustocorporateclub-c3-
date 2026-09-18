import Lenis from 'lenis';

/**
 * Initialize Lenis smooth scroll engine for public pages.
 */
export function initSmoothScroll() {
  if (typeof window === 'undefined') return;

  const lenis = new Lenis({
    duration: 1.0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  let animId;
  function raf(time) {
    lenis.raf(time);
    animId = requestAnimationFrame(raf);
  }

  animId = requestAnimationFrame(raf);

  return () => {
    if (animId) cancelAnimationFrame(animId);
    lenis.destroy();
  };
}
