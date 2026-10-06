import Lenis from 'lenis';

let activeLenis = null;

/**
 * Get active Lenis instance if available.
 */
export function getLenis() {
  return activeLenis;
}

/**
 * Programmatically smooth-scroll to a given selector, element, or coordinate.
 */
export function scrollToTarget(target, options = {}) {
  if (typeof window === 'undefined') return;

  if (target === '#home' || target === '#top' || target === 0) {
    if (activeLenis) {
      activeLenis.scrollTo(0, { duration: 1.0, ...options });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return;
  }

  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (el) {
    if (activeLenis) {
      activeLenis.scrollTo(el, { duration: 1.0, offset: options.offset ?? -10, ...options });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

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

  activeLenis = lenis;
  if (typeof window !== 'undefined') {
    window.__c3_lenis = lenis;
  }

  let animId;
  function raf(time) {
    lenis.raf(time);
    animId = requestAnimationFrame(raf);
  }

  animId = requestAnimationFrame(raf);

  return () => {
    if (animId) cancelAnimationFrame(animId);
    lenis.destroy();
    if (activeLenis === lenis) {
      activeLenis = null;
      if (typeof window !== 'undefined') {
        window.__c3_lenis = null;
      }
    }
  };
}

