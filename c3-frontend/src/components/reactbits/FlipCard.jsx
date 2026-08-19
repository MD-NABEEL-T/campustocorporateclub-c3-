import { useState } from 'react';

// Click/tap toggles the flip - deliberately not hover-based, since hover
// doesn't exist on touch devices (our primary target).
const FlipCard = ({ front, back, className = '' }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`[perspective:1200px] cursor-pointer ${className}`}
      onClick={() => setFlipped(f => !f)}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setFlipped(f => !f);
        }
      }}
    >
      <div
        className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d]"
        style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        <div className="absolute inset-0 [backface-visibility:hidden]">{front}</div>
        <div
          className="absolute inset-0 [backface-visibility:hidden]"
          style={{ transform: 'rotateY(180deg)' }}
        >
          {back}
        </div>
      </div>
    </div>
  );
};

export default FlipCard;