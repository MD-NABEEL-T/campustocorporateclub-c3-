import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Preloader, { RING_CIRCUMFERENCE } from './Preloader';
import HeroContent from './HeroContent';
import LiquidChrome from '../LiquidChrome';

const INTRO_SESSION_KEY = 'c3_intro_played';

const Hero = () => {
  const alreadyPlayed =
    typeof window !== 'undefined' && sessionStorage.getItem(INTRO_SESSION_KEY) === 'true';

  const [showPreloader, setShowPreloader] = useState(!alreadyPlayed);

  // Preloader refs
  const ringGroupRef = useRef(null);
  const progressRingRef = useRef(null);
  const panelRef = useRef(null);

  // Hero content refs
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const descRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // Intro already played this browser session (e.g. navigating back to
    // Home) - skip straight to the final visible state, no replay.
    if (alreadyPlayed) {
      gsap.set([headingRef.current, subRef.current, descRef.current, ctaRef.current], {
        opacity: 1,
        y: 0,
      });
      return;
    }

    const master = gsap.timeline({
      onComplete: () => {
        setShowPreloader(false);
        sessionStorage.setItem(INTRO_SESSION_KEY, 'true');
      },
    });

    gsap.set([headingRef.current, subRef.current, descRef.current, ctaRef.current], {
      opacity: 0,
      y: 20,
    });

    gsap.set(progressRingRef.current, {
      strokeDasharray: RING_CIRCUMFERENCE,
      strokeDashoffset: RING_CIRCUMFERENCE,
    });

    // 1. Ring fades in
    master.fromTo(
      ringGroupRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
    );

    master.addLabel('ringStart', '<');

    // 2. Ring fills
    master.to(
      progressRingRef.current,
      { strokeDashoffset: 0, duration: 1.6, ease: 'power1.inOut' },
      'ringStart'
    );

    // 3. Intro exits as a single wipe sweeping right-to-left
    master.to(ringGroupRef.current, { opacity: 0, scale: 0.95, duration: 0.2 });
    master.to(panelRef.current, { xPercent: -100, duration: 0.7, ease: 'power3.inOut' }, '-=0.05');

    // 4. Hero content reveal
    master
      .to(headingRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.35')
      .to(subRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.35')
      .to(descRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.35')
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.35');

    return () => master.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const preloaderRefs = { ringGroupRef, progressRingRef, panelRef };
  const heroContentRefs = { headingRef, subRef, descRef, ctaRef };

  return (
    <div className="relative min-h-[90vh] bg-black overflow-hidden flex items-center justify-center">
      {/* LiquidChrome animated background - subdued so it supports the
          content instead of competing with it: lower opacity, slower and
          smaller motion, fully neutral base color (no color tint). */}
      <div className="absolute inset-0 opacity-[0.12]">
        <LiquidChrome baseColor={[0.04, 0.04, 0.04]} speed={0.15} amplitude={0.12} interactive={false} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black pointer-events-none" />
      {/* Ambient glow - mostly grayscale, blue kept faint enough to only
          hint at brand presence rather than color the whole scene */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.04] rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] bg-[#3B82F6]/[0.04] rounded-full blur-[110px] pointer-events-none" />
      <Preloader show={showPreloader} refs={preloaderRefs} />
      <HeroContent refs={heroContentRefs} />
    </div>
  );
};

export default Hero;