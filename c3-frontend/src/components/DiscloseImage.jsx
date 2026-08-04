import { motion } from 'motion/react';

// Reveals the image with a left-to-right wipe on mount, instead of a plain fade.
const DiscloseImage = ({ src, alt = '', className = '', imgClassName = '', overlayClassName = '' }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={{ clipPath: 'inset(0 0% 0 0)' }}
        transition={{ duration: 1.1, ease: [0.77, 0, 0.18, 1] }}
        className={`absolute inset-0 w-full h-full object-cover ${imgClassName}`}
      />
      {/* Wipe leading-edge sheen */}
      <motion.div
        initial={{ x: '0%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 1.1, ease: [0.77, 0, 0.18, 1] }}
        className={`absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none ${overlayClassName}`}
      />
    </div>
  );
};

export default DiscloseImage;