import { motion } from 'motion/react';

// Each line sits in its own overflow-hidden mask and slides up from below.
const LineReveal = ({ lines, active, staggerDelay = 0.15, baseDelay = 0, className = '', lineClassName = '' }) => {
  return (
    <div className={className}>
      {lines.map((line, i) => (
        <div key={i} className={`overflow-hidden ${lineClassName}`}>
          <motion.span
            initial={{ y: '110%' }}
            animate={active ? { y: '0%' } : { y: '110%' }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
              delay: active ? baseDelay + i * staggerDelay : 0
            }}
            className="block"
          >
            {line}
          </motion.span>
        </div>
      ))}
    </div>
  );
};

export default LineReveal;