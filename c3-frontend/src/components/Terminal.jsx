import { useEffect, useState, useRef } from 'react';
import { useInView } from 'motion/react';

const LINES = [
  { prompt: '$', text: 'whoami' },
  { prompt: '>', text: 'a student who wants to build, not just study.' },
  { prompt: '$', text: 'join c3 --domain=choose-your-own' },
  { prompt: '>', text: 'matching you with Design, AI/ML, Networking, Data or Comms...' },
  { prompt: '>', text: 'welcome to Campus to Corporate. let\u2019s build something.' }
];

const TYPE_SPEED = 28;

const Terminal = ({ className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView || done) return;

    if (lineIndex >= LINES.length) {
      setDone(true);
      return;
    }

    const currentText = LINES[lineIndex].text;

    if (charIndex < currentText.length) {
      const timer = setTimeout(() => setCharIndex(c => c + 1), TYPE_SPEED);
      return () => clearTimeout(timer);
    }

    const lineTimer = setTimeout(() => {
      setLineIndex(l => l + 1);
      setCharIndex(0);
    }, 400);
    return () => clearTimeout(lineTimer);
  }, [inView, lineIndex, charIndex, done]);

  return (
    <div
      ref={ref}
      className={`rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] ${className}`}
    >
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
        <span className="ml-3 text-[11px] font-mono text-[#71717A]">join-c3.sh</span>
      </div>

      <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm leading-relaxed min-h-[180px]">
        {LINES.slice(0, lineIndex).map((line, i) => (
          <p key={i} className={line.prompt === '$' ? 'text-white' : 'text-[#38BDF8]'}>
            <span className="text-[#71717A] mr-2">{line.prompt}</span>
            {line.text}
          </p>
        ))}

        {inView && lineIndex < LINES.length && (
          <p className={LINES[lineIndex].prompt === '$' ? 'text-white' : 'text-[#38BDF8]'}>
            <span className="text-[#71717A] mr-2">{LINES[lineIndex].prompt}</span>
            {LINES[lineIndex].text.slice(0, charIndex)}
            <span className="inline-block w-[7px] h-[1em] align-middle bg-[#38BDF8] ml-0.5 animate-pulse" />
          </p>
        )}
      </div>
    </div>
  );
};

export default Terminal;