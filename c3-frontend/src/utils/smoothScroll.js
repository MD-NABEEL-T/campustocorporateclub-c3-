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
      activeLenis.scrollTo(el, { duration: 1.0, offset: options.offset ?? -85, ...options });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

/**
 * Initialize Lenis smooth scroll engine for public pages.
 * Lazy-loaded so portal routes never download the Lenis chunk.
 */
export function initSmoothScroll() {
  if (typeof window === 'undefined') return () => {};

  let animId;
  let lenisInstance = null;
  let isCancelled = false;

  import('lenis').then(({ default: Lenis }) => {
    if (isCancelled) return;
    document.documentElement.classList.add('lenis', 'lenis-smooth');

    lenisInstance = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });

    activeLenis = lenisInstance;
    window.__c3_lenis = lenisInstance;

    function raf(time) {
      if (isCancelled) return;
      lenisInstance.raf(time);
      animId = requestAnimationFrame(raf);
    }
    animId = requestAnimationFrame(raf);
  }).catch((err) => {
    console.warn('[SmoothScroll] Failed to lazy-load Lenis, falling back to native scroll:', err);
  });

  return () => {
    isCancelled = true;
    if (animId) cancelAnimationFrame(animId);
    if (lenisInstance) {
      lenisInstance.destroy();
    }
    document.documentElement.classList.remove('lenis', 'lenis-smooth');
    if (activeLenis === lenisInstance) {
      activeLenis = null;
      if (typeof window !== 'undefined') {
        window.__c3_lenis = null;
      }
    }
  };
}

