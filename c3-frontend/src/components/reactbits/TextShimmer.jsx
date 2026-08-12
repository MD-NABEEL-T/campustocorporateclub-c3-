// TextShimmer — motion-primitives-style shimmering text effect.
// Usage:
// <TextShimmer className="font-mono text-sm" duration={1}>
//   Generating code...
// </TextShimmer>

import { motion } from 'motion/react';
import { useMemo } from 'react';

export const TextShimmer = ({
  children,
  className = '',
  duration = 2,
  spread = 2,
}) => {
  const text = typeof children === 'string' ? children : '';

  const dynamicSpread = useMemo(() => {
    return (text.length || 10) * spread;
  }, [text, spread]);

  return (
    <motion.span
      className={`relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent [background-repeat:no-repeat,padding-box] ${className}`}
      style={{
        '--spread': `${dynamicSpread}px`,
        backgroundImage:
          'linear-gradient(90deg, transparent calc(50% - var(--spread)), var(--text-main, #F8FAFC), transparent calc(50% + var(--spread))), linear-gradient(var(--text-muted, #94A3B8), var(--text-muted, #94A3B8))',
      }}
      initial={{ backgroundPosition: '100% center' }}
      animate={{ backgroundPosition: '0% center' }}
      transition={{
        repeat: Infinity,
        duration,
        ease: 'linear',
      }}
    >
      {children}
    </motion.span>
  );
};

export default TextShimmer;