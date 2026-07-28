import Lenis from 'lenis';

/**
 * Initialize Lenis smooth scroll engine for public pages.
 */
export function initSmoothScroll() {
  if (typeof window === 'undefined') return;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  const animId = requestAnimationFrame(raf);

  return () => {
    cancelAnimationFrame(animId);
    lenis.destroy();
  };
}
