import { useRef, useState, useEffect, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import BlurText from '../reactbits/BlurText';
import FinisherHeader from '../reactbits/FinisherHeader';
import Terminal from '../reactbits/Terminal';
import ViewportGate from '../reactbits/ViewportGate';

// Particles uses ogl (WebGL) - heavy, lazy-loaded so it's only fetched once
// this section scrolls into view.
const Particles = lazy(() => import('../reactbits/Particles'));

const finisherConfig = {
  count: 8,
  size: { min: 900, max: 1200, pulse: 0 },
  speed: { x: { min: 0.1, max: 0.4 }, y: { min: 0.1, max: 0.4 } },
  colors: {
    background: 'transparent',
    particles: ['#1d4ed8', '#0f172a', '#2DD4BF', '#000000', '#38BDF8']
  },
  blending: 'overlay',
  opacity: { center: 0.5, edge: 0 },
  skew: -2,
  shapes: ['c']
};

export const JoinUsSection = () => {
  const introRef = useRef(null);
  const introInView = useInView(introRef, { once: true, amount: 0.4 });
  const [showIntroParagraph, setShowIntroParagraph] = useState(false);

  useEffect(() => {
    if (!introInView) return;
    const timer = setTimeout(() => setShowIntroParagraph(true), 350);
    return () => clearTimeout(timer);
  }, [introInView]);

  return (
    <section id="join" className="relative w-full bg-black overflow-hidden py-24 sm:py-28">
      {/* Ambient particle backdrop for the whole section */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <ViewportGate rootMargin="200px" className="absolute inset-0">
          <Suspense fallback={null}>
            <Particles
              particleColors={['#38BDF8', '#818CF8', '#2DD4BF']}
              particleCount={140}
              particleSpread={10}
              speed={0.1}
              particleBaseSize={90}
              moveParticlesOnHover={false}
              alphaParticles
              disableRotation
              pixelRatio={1}
            />
          </Suspense>
        </ViewportGate>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading, on its own animated blob backdrop */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 mb-10" style={{ height: 220 }}>
          <FinisherHeader config={finisherConfig} className="absolute inset-0">
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-4">
              {introInView && (
                <BlurText
                  text="Join C3"
                  direction="top"
                  delay={60}
                  stepDuration={0.4}
                  className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white justify-center"
                />
              )}
            </div>
          </FinisherHeader>
        </div>

        <div ref={introRef} className="text-center mb-12">
          {showIntroParagraph && (
            <BlurText
              text="Every member started exactly where you are now - curious, a little unsure, ready to learn. Pick a domain, show up, and build with people who'll actually teach you."
              direction="top"
              delay={6}
              stepDuration={0.28}
              className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed max-w-2xl mx-auto justify-center"
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <Terminal />

          <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-5">
            <p className="text-sm text-[#71717A] max-w-sm">
              Applications are reviewed on a rolling basis. No prior experience required - just curiosity
              and a willingness to show up.
            </p>
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#4B8FF7] hover:to-[#2E6EEF] shadow-lg shadow-[#3B82F6]/25 hover:shadow-[#3B82F6]/40 transition-all"
            >
              Apply Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinUsSection;