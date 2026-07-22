import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Preloader, { RING_CIRCUMFERENCE } from './Preloader';
import HeroContent from './HeroContent';

const BOOT_MESSAGES = ['INITIALIZING C3 PLATFORM...', 'LOADING MODULES...', 'SYSTEMS READY'];

const Hero = () => {
  const [showPreloader, setShowPreloader] = useState(true);

  // Preloader refs
  const ringGroupRef = useRef(null);
  const progressRingRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const hudRefs = useRef([]);
  const bootLineRef = useRef(null);

  // Hero content refs
  const headingWrapRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const descRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const master = gsap.timeline({
      onComplete: () => setShowPreloader(false),
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

    // 2. HUD corner text stagger
    master.fromTo(
      hudRefs.current,
      { opacity: 0 },
      {
        opacity: 0.7,
        duration: 0.1,
        stagger: 0.1,
      },
      'ringStart'
    );

    BOOT_MESSAGES.forEach((msg, i) => {
      master.call(
        () => {
          if (bootLineRef.current) bootLineRef.current.textContent = msg;
        },
        null,
        `ringStart+=${i * 0.4}`
      );
    });

    // 3. Ring fills loader
    master.to(
      progressRingRef.current,
      { strokeDashoffset: 0, duration: 1.2, ease: 'power1.inOut' },
      'ringStart'
    );

    // 4. Preloader split panels open
    master.to(ringGroupRef.current, { opacity: 0, scale: 0.95, duration: 0.2 });
    master.to(hudRefs.current, { opacity: 0, duration: 0.2 }, '<');
    master.to(bootLineRef.current, { opacity: 0, duration: 0.2 }, '<');
    master.to(
      leftPanelRef.current,
      { xPercent: -100, duration: 0.6, ease: 'power3.inOut' },
      '-=0.05'
    );
    master.to(
      rightPanelRef.current,
      { xPercent: 100, duration: 0.6, ease: 'power3.inOut' },
      '<'
    );

    // 5. Hero content reveal
    master
      .to(headingRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
      .to(subRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.35')
      .to(descRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.35')
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.35');

    return () => master.kill();
  }, []);

  const preloaderRefs = { ringGroupRef, progressRingRef, leftPanelRef, rightPanelRef, hudRefs, bootLineRef };
  const heroContentRefs = { headingWrapRef, headingRef, subRef, descRef, ctaRef };

  return (
    <div className="relative min-h-[90vh] bg-[#071A2B] overflow-hidden flex items-center justify-center">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#38BDF8]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] bg-[#2DD4BF]/10 rounded-full blur-[100px] pointer-events-none" />

      <Preloader show={showPreloader} refs={preloaderRefs} />
      <HeroContent refs={heroContentRefs} />
    </div>
  );
};

export default Hero;
