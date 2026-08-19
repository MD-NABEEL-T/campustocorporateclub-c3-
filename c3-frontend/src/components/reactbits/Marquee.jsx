import './Marquee.css';

// Duplicates its children once and animates the doubled track by exactly
// -50%, which loops seamlessly for any content width.
const Marquee = ({ children, direction = 'left', speed = 32, pauseOnHover = true, className = '' }) => {
  return (
    <div className={`marquee-viewport ${className}`}>
      <div
        className={`marquee-track ${pauseOnHover ? 'marquee-pause-hover' : ''}`}
        style={{
          animationDuration: `${speed}s`,
          animationDirection: direction === 'right' ? 'reverse' : 'normal'
        }}
      >
        <div className="marquee-content">{children}</div>
        <div className="marquee-content" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Marquee;